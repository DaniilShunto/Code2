// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  MediaSessionState,
  MediaSessionType,
  ParticipantId,
  Timestamp,
  TrickleCandidate,
  VideoSetting,
} from '@opentalk/common';

import { MediaStatusChange } from '../../api/types/incoming/media';
import { formatBitRate } from '../../utils/numberUtils';
import { BaseEventEmitter } from '../EventListener';
import { BandwidthController } from './BandwidthController';
import { BaseWebRtcConnection } from './BaseWebRtcConnection';
import { MediaSignaling } from './MediaSignaling';
import { PublisherConnection } from './PublisherConnection';
import { StatsEvent } from './Statistics/ConnectionStats';
import { SubscriberConnection, SubscriberState } from './SubscriberConnection';
import { TurnProvider } from './TurnProvider';
import { PACKET_LOSS_THRESHOLD } from './index';

export const STATS_INTERVAL = 2000; // ms

export interface MediaDescriptor {
  participantId: ParticipantId;
  mediaType: MediaSessionType;
}

export type MediaId = string & { readonly __tag: unique symbol };

export const idFromDescriptor = (descriptor: MediaDescriptor): MediaId =>
  `${descriptor.participantId}/${descriptor.mediaType}` as MediaId;

export const descriptorFromId = (id: MediaId): MediaDescriptor => {
  const [participantId, mediaType] = id.split('/');
  return { participantId: participantId as ParticipantId, mediaType: mediaType as MediaSessionType };
};

export type SubscriberConfig = MediaDescriptor & MediaSessionState;

export interface SubscriberStateChanged extends MediaDescriptor {
  subscriberState: SubscriberState;
}

export interface QualityLimit extends MediaDescriptor {
  limit: VideoSetting;
}

export type WebRtcContextEvent = {
  // A 'subscriberchanged' event is sent when a subscriber config has been updated or created.
  subscriberchanged: SubscriberConfig;
  // A 'subscriberstatechanged' event is sent when the state of a subscriber media stream changes, e.g. the first track is online.
  subscriberstatechanged: SubscriberStateChanged;
  // A 'subscriberclosed' event is sent when a connection was closed and removed from the WebRTC context e.g. when unused for a while.
  subscriberclosed: MediaDescriptor;
  // 'statsUpdated' reports the connection bandwidth and packet loss for all active connections
  statsupdated: Record<MediaId, StatsEvent>;
  subscriberLimit: QualityLimit;
  upstreamLimit: VideoSetting;
  // 'removed' event is sent when a participant stops publishing e.g. when leaving the conference.
  removed: MediaDescriptor;
};

export class WebRtc extends BaseEventEmitter<WebRtcContextEvent> {
  private statsBitrate = { up: 0, down: 0, upLoss: 0, downLoss: 0 };
  private readonly maxVideoBandwidth: number;
  private readonly signaling: MediaSignaling;
  private readonly turnProvider: TurnProvider;

  private readonly reservations: Map<string, { mediaId: MediaId; target: VideoSetting }> = new Map();

  /*
  This map hold the state of all known subscribers
  `connection` is set, when it is initiated until then
  `action` holds a promise to await the initialisation
  `state` reflects the backend state and is updated as early as possible
  */
  private subscribers: Map<
    MediaId,
    { connection?: SubscriberConnection; action?: Promise<SubscriberConnection>; state: SubscriberConfig }
  > = new Map();

  private publishers: Map<MediaId, PublisherConnection> = new Map();
  private statsTimer?: NodeJS.Timer;

  private publisherController = new BandwidthController(
    VideoSetting.Low,
    4 * STATS_INTERVAL,
    10 * 60_000,
    STATS_INTERVAL
  );

  public constructor(signaling: MediaSignaling, turnProvider: TurnProvider, maxVideoBandwidth: number) {
    super();
    this.maxVideoBandwidth = maxVideoBandwidth;
    this.signaling = signaling;
    this.turnProvider = turnProvider;

    this.startStats();

    this.publisherController.addEventListener('limit', async (limit: VideoSetting) => {
      this.eventEmitter.emit('upstreamLimit', limit);
      this.publishers.forEach((publisher) => publisher.updateQualityLimit(limit));
    });
    //downgrade on startup
    this.publisherController.downgradeTemporarily();
  }

  private startStats() {
    if (this.statsTimer === undefined) {
      this.statsTimer = setInterval(async () => {
        const statsMap: Record<MediaId, StatsEvent> = {};

        const fetchStats = async (mediaId: MediaId, connection: BaseWebRtcConnection) => {
          const connectionStats = await connection.updateStats();
          if (connectionStats !== undefined) {
            statsMap[mediaId] = connectionStats;
          }
        };

        for (const [mediaId, subscriberItem] of this.subscribers) {
          const subscriber = subscriberItem.connection;
          if (subscriber) {
            await fetchStats(mediaId, subscriber);
          }
        }

        for (const [mediaId, publisher] of this.publishers) {
          await fetchStats(mediaId, publisher);
        }

        this.statsBitrate = Object.values(statsMap).reduce(
          (acc, { connection, inbound, outbound }) => {
            const result = {
              up: acc.up + (connection?.bitRateUp || outbound?.bitRate || 0),
              down: acc.down + (connection?.bitRateDown || inbound?.bitRate || 0),
              downLoss: 0,
              upLoss: 0,
            };
            if (inbound) {
              result.downLoss = Math.max(acc.downLoss, connection?.packetLoss || inbound?.packetLoss || 0);
            }
            if (outbound) {
              result.upLoss = Math.max(acc.upLoss, connection?.packetLoss || outbound?.packetLoss || 0);
            }
            return result;
          },
          { up: 0, down: 0, upLoss: 0, downLoss: 0 }
        );

        // Uplink loss is harder to observe so we need to be more sensitive hence PACKET_LOSS_THRESHOLD/2
        if (this.statsBitrate.upLoss > PACKET_LOSS_THRESHOLD / 2) {
          this.publisherController.downgradeTemporarily();
        }

        // Only log when loss is greater than 1%
        if (this.statsBitrate.upLoss > 0.01 || this.statsBitrate.downLoss > 0.01) {
          console.debug(
            `bandwidth up:${formatBitRate(this.statsBitrate.up)} down:${formatBitRate(
              this.statsBitrate.down
            )} upLoss:${((this.statsBitrate.upLoss || 0) * 100).toFixed(2)}% downLoss:${(
              (this.statsBitrate.downLoss || 0) * 100
            ).toFixed(2)}%`,
            statsMap
          );
        }

        this.eventEmitter.emit('statsupdated', statsMap);
      }, STATS_INTERVAL);
    }
  }

  private stopStats() {
    if (this.statsTimer !== undefined) {
      clearInterval(this.statsTimer);
      this.statsTimer = undefined;
    }
  }

  private getPublisherConnection = (descriptor: MediaDescriptor) => this.publishers.get(idFromDescriptor(descriptor));

  private getSubscriberConnection(descriptor: MediaDescriptor) {
    const subscriber = this.subscribers.get(idFromDescriptor(descriptor));
    if (subscriber === undefined) {
      throw new Error(`unknown connection (handle: ${idFromDescriptor(descriptor)})`);
    }
    if (subscriber?.action) {
      return subscriber?.action;
    }
    if (subscriber.connection === undefined) {
      throw new Error(`no connection for subscription for ${idFromDescriptor(descriptor)}`);
    }
    return subscriber.connection;
  }

  // To be used for the dispatch signaling messages on _existing_ connections
  private async getOnlineConnection(descriptor: MediaDescriptor) {
    const connection = this.getPublisherConnection(descriptor) || (await this.getSubscriberConnection(descriptor));
    if (connection === undefined) {
      throw new Error(`unknown connection (handle: ${idFromDescriptor(descriptor)})`);
    }
    return connection;
  }

  /**
   * Gets called with signals from the signaling server when a EndOfSdpCandidates arrives.
   *
   * @param descriptor
   */
  public async handleEndOfSdpCandidates(descriptor: MediaDescriptor) {
    const connection = await this.getOnlineConnection(descriptor);
    return connection.handleSdpCandidate();
  }

  /**
   * Gets called with signals from the signaling server when a SDPCandidate arrives.
   *
   * In this case to react to this event, you should bind to the onTrack callback which is exposed via the Promise from the subscribe function
   * @param descriptor
   * @param candidate
   */
  public async handleSdpCandidate(descriptor: MediaDescriptor, candidate: TrickleCandidate) {
    const connection = await this.getOnlineConnection(descriptor);
    return connection.handleSdpCandidate(candidate);
  }

  /**
   * Gets called with signals from the signaling server when an SDPOffer arrives.
   *
   * The onSdpOffer callback should send the passed answer to the signaling server.
   * @param descriptor
   * @param sdp
   */
  public async handleSdpOffer(descriptor: MediaDescriptor, sdp: string) {
    const subscriber = await this.getSubscriberConnection(descriptor);
    subscriber.handleOffer(sdp);
  }

  /**
   * Gets called with signals from the signaling server when an SDPAnswer arrives.
   *
   * In this case to react to this event, you should bind to the onTrack callback which is exposed via the Promise from the subscribe function
   * @param descriptor
   * @param sdp
   */
  public async handleSdpAnswer(descriptor: MediaDescriptor, sdp: string) {
    const connection = await this.getOnlineConnection(descriptor);
    if (connection instanceof PublisherConnection) {
      connection.handleAnswer(sdp);
    } else {
      console.error(
        `SDP answer is expected on publishers only. suscriber: ${idFromDescriptor(descriptor)} ; SDP message: ${sdp}`
      );
    }
  }

  /**
   * Gets called when a connection is up/down from the perspective of the signaling server.
   *
   * @param descriptor
   * @param up
   */
  public async setConnectionState(descriptor: MediaDescriptor, up: boolean) {
    const connection = await this.getOnlineConnection(descriptor).catch(() => {
      if (up) {
        console.error(
          `failed to set connection state 'up' because there is no connection available for subscriber ${idFromDescriptor(
            descriptor
          )}.`
        );
      }
      return undefined;
    });
    if (connection !== undefined) {
      connection.up = up;
    }
  }

  public async handleMediaStatus(descriptor: MediaDescriptor, statusChange: MediaStatusChange) {
    const connection = await this.getOnlineConnection(descriptor);
    if (connection instanceof PublisherConnection) {
      connection.updateMediaStatus(statusChange);
    } else {
      console.error(
        `media status is expected on publishers only. subscriber:${idFromDescriptor(descriptor)}; change:'${
          statusChange.kind
        }': ${statusChange.receiving}`
      );
    }
  }

  /**
   * Gets called when the backend sees thar a connection is slow, i.e. has packet loss.
   *
   * @param descriptor
   * @param direction
   * @param timestamp
   */
  public async handleSlowNotification(
    descriptor: MediaDescriptor,
    direction: 'upstream' | 'downstream',
    timestamp: Timestamp
  ) {
    const connection = await this.getOnlineConnection(descriptor);
    if (connection instanceof PublisherConnection) {
      console.debug('publisher slow link message', descriptor, direction, timestamp);
    }
    if (connection instanceof SubscriberConnection) {
      console.debug('subscriber slow link message', descriptor, direction, timestamp);
    }
  }

  /**
   * Gets called to access subscribers the media stream.
   *
   * @param descriptor
   */
  public getMediaStream(descriptor: MediaDescriptor): MediaStream {
    const mediaId = idFromDescriptor(descriptor);
    const subscriber = this.subscribers.get(mediaId);
    if (subscriber === undefined) {
      throw new Error(`subscriber media (handle: ${mediaId}) not available`);
    }

    if (subscriber.connection === undefined || subscriber.action !== undefined) {
      throw new Error(`subscriber media (handle: ${mediaId}) is not yet connected`);
    }

    const stream = subscriber.connection.getMediaStream();

    if (stream === undefined) {
      throw new Error(`subscriber media (handle: ${mediaId}) is not yet ready - observe audioRunning / videoRunning`);
    }

    return stream;
  }

  public requestQuality(descriptor: MediaDescriptor, target: VideoSetting, mediaRef: string) {
    const lastReservation = this.reservations.get(mediaRef);
    const mediaId = idFromDescriptor(descriptor);

    if (lastReservation?.mediaId === mediaId && lastReservation.target === target) {
      console.debug(`skip request for same target ${mediaRef} ${target} ${mediaId}`);
      return;
    }

    if (target === VideoSetting.Off) {
      this.reservations.delete(mediaRef);
    } else {
      this.reservations.set(mediaRef, { mediaId, target });
    }

    console.debug('Subscriber reservations changed', this.reservations);

    if (lastReservation && lastReservation.mediaId !== mediaId) {
      const oldSubscriber = this.subscribers.get(lastReservation.mediaId);
      const oldSubscriberTarget = this.currentTarget(lastReservation.mediaId);
      oldSubscriber?.connection?.updateQualityTarget(oldSubscriberTarget);
    }

    const subscriber = this.subscribers.get(mediaId);

    if (subscriber === undefined) {
      if (target === VideoSetting.Off) {
        return;
      }
      throw new Error(`subscriber media (handle: ${idFromDescriptor(descriptor)}) not available`);
    }

    if (subscriber.connection) {
      subscriber.connection.updateQualityTarget(this.currentTarget(mediaId));
      return;
    }

    if (!subscriber.action && target !== VideoSetting.Off) {
      this.createSubscriber(mediaId).catch((e) => console.error('createSubscriber failed', e));
    }
  }

  private currentTarget(mediaId: MediaId) {
    let maxReservation = { target: VideoSetting.Off };
    for (const reservation of this.reservations.values()) {
      if (reservation.mediaId === mediaId && maxReservation.target < reservation.target) {
        maxReservation = reservation;
      }
    }
    return maxReservation.target;
  }

  private async createSubscriber(mediaId: MediaId): Promise<SubscriberConnection> {
    const subscriber = this.subscribers.get(mediaId);
    if (subscriber === undefined) {
      throw new Error(`subscriber was closed while connect in progress for ${mediaId}`);
    }

    if (subscriber.action !== undefined) {
      throw new Error(`subscriber has an ongoing action in progress for ${mediaId}`);
    }

    subscriber.action = (async () => {
      const iceServers = await this.turnProvider.get().catch((e) => {
        console.error('failed to fetch TURN credentials', e);
        return [];
      });
      const subscriber = this.subscribers.get(mediaId);
      if (subscriber === undefined) {
        throw new Error(`subscriber was closed while connect in progress for ${mediaId}`);
      }
      if (subscriber?.connection) {
        throw new Error(`subscriber connection already exists for ${mediaId}`);
      }
      const connection = new SubscriberConnection(iceServers, subscriber.state, this.signaling);
      subscriber.connection = connection;
      this.subscribers.set(mediaId, subscriber);

      const closeHandler = () => {
        const subscriber = this.subscribers.get(mediaId);
        if (subscriber !== undefined) {
          this.eventEmitter.emit('subscriberclosed', subscriber.state);
          subscriber.connection = undefined;
          this.subscribers.set(mediaId, subscriber);
        } else {
          console.warn(`missing WebRTC subsciber state for ${mediaId}`);
        }
        connection.removeEventListener('closed', closeHandler);
        connection.removeEventListener('subscriberstatechanged', changeHandler);
        connection.removeEventListener('qualityLimit', limitHandler);
      };

      const changeHandler = (subscriberStateEvent: SubscriberStateChanged) => {
        this.eventEmitter.emit('subscriberstatechanged', subscriberStateEvent);
      };

      const limitHandler = (qualityLimit: QualityLimit) => {
        this.eventEmitter.emit('subscriberLimit', qualityLimit);
      };

      connection.addEventListener('closed', closeHandler);
      connection.addEventListener('subscriberstatechanged', changeHandler);
      connection.addEventListener('qualityLimit', limitHandler);

      connection.updateQualityTarget(this.currentTarget(mediaId));
      return connection;
    })().finally(() => {
      const subscriber = this.subscribers.get(mediaId);
      if (subscriber !== undefined) {
        subscriber.action = undefined;
        this.subscribers.set(mediaId, subscriber);
      }
    });

    this.subscribers.set(mediaId, subscriber);

    return subscriber.action;
  }

  /**
   * Gets called with signals from the signaling server when the media state has changed or
   * the availability of a participant has changed.
   *
   * Will initiate a subscriber connection for new media a descriptors is available
   *
   * @param subscriberConfig
   */
  public updateMedia(subscriberConfig: SubscriberConfig) {
    const mediaId = idFromDescriptor(subscriberConfig);

    if (!this.subscribers.has(mediaId)) {
      this.subscribers.set(mediaId, { state: subscriberConfig });
    }

    const subscriber = this.subscribers.get(mediaId);
    if (subscriber === undefined) {
      throw 'subscriber not available when added just before';
    }

    if (subscriberConfig.audio && subscriber.connection === undefined) {
      (subscriber.action || this.createSubscriber(mediaId)).then((connection) => {
        connection.updateConfig(subscriberConfig);
      });
    } else {
      subscriber.connection?.updateConfig(subscriberConfig);
    }
    this.eventEmitter.emit('subscriberchanged', subscriberConfig);
  }

  public unsubscribe(descriptor: MediaDescriptor) {
    const mediaId = idFromDescriptor(descriptor);
    const subscriber = this.subscribers.get(mediaId);
    if (subscriber === undefined) {
      console.error(`unsubscribe: subscriber ${mediaId} not found`);
      return;
    }

    if (subscriber.action !== undefined) {
      console.error(`unsubscribe: will not close subscriber ${mediaId} while connecting`);
      return;
    }
    subscriber.connection?.close();
    this.eventEmitter.emit('removed', descriptor);
    subscriber.connection = undefined;
    this.subscribers.delete(mediaId);
  }

  public removeSubscriber(descriptor: MediaDescriptor) {
    const mediaId = idFromDescriptor(descriptor);
    const subscriber = this.subscribers.get(mediaId);
    if (subscriber === undefined) {
      return;
    }

    if (subscriber.action !== undefined) {
      console.warn(`removing subscriber ${mediaId} need to wait for connection process`, subscriber);
      subscriber.action.finally(() => this.unsubscribe(descriptor));
      return;
    }

    this.unsubscribe(descriptor);
  }

  public removeParticipant(id: ParticipantId) {
    const videoDescriptor = { participantId: id, mediaType: MediaSessionType.Video };
    const screenDescriptor = { participantId: id, mediaType: MediaSessionType.Screen };

    this.removeSubscriber(videoDescriptor);
    this.removeSubscriber(screenDescriptor);
  }

  public async createPublisher(descriptor: MediaDescriptor, stream: MediaStream, quality: VideoSetting) {
    const mediaId = idFromDescriptor(descriptor);
    // async work first to avoid races
    const iceServers = await this.turnProvider.get();
    const oldConnection = this.getPublisherConnection(descriptor);
    if (oldConnection !== undefined) {
      throw new Error(`republishing for ${descriptor.mediaType} - close old connection first`);
    }

    const connection = new PublisherConnection(
      iceServers,
      descriptor,
      this.signaling,
      stream,
      quality,
      this.maxVideoBandwidth
    );
    const videoCloseHandler = () => {
      this.publishers.delete(mediaId);
      connection.removeEventListener('closed', videoCloseHandler);
    };
    connection.addEventListener('closed', videoCloseHandler);
    this.publishers.set(mediaId, connection);

    connection.updateQualityLimit(this.publisherController.qualityLimit);

    return connection;
  }

  /**
   * This function cancels the connection to each subscriber in case of a shutdown.
   **/
  public close() {
    console.info('shutdown webRTC context');
    this.stopStats();

    this.publishers.forEach((publisher) => publisher.close());
    this.publishers.clear();

    this.subscribers.forEach(({ connection }) => connection?.close());
    this.subscribers.clear();

    this.eventEmitter.all.clear();
  }
}
