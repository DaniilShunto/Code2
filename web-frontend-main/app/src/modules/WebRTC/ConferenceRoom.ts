// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { BackendParticipant, MediaSessionType, ParticipantId, Timestamp, VideoSetting } from '@opentalk/common';
import { isEmpty } from 'lodash';
import convertToSnakeCase from 'snakecase-keys';

import { MediaDescriptor, setCurrentConferenceRoom, SubscriberConfig } from '.';
import { ApiErrorWithBody, StartRoomError } from '../../api/rest';
import { Message as IncomingMessage } from '../../api/types/incoming';
import { Message as ControlMessage } from '../../api/types/incoming/control';
import {
  MediaStatus,
  SdpAnswer,
  SdpCandidate,
  SdpEndOfCandidates,
  SdpOffer,
  WebRtcDown,
  WebRtcSlow,
  WebRtcUp,
} from '../../api/types/incoming/media';
import { Message as OutgoingMessage } from '../../api/types/outgoing';
import { RoomCredentials } from '../../store/commonActions';
import { ConfigState } from '../../store/slices/configSlice';
import { fetchWithAuth, getControllerBaseUrl, getSignalingUrl } from '../../utils/apiUtils';
import { BaseEventEmitter } from '../EventListener';
import { MediaSignaling } from './MediaSignaling';
import { SignalingSocket, SignalingState } from './SignalingSocket';
import { TurnProvider } from './TurnProvider';
import { WebRtc } from './WebRTC';

const REJOIN_ON_BLOCKED_CONNECTION_TIME = 10000;

export type ConferenceEvent = {
  connected: void;
  // A 'shutdown' event is sent after the whole WebRTC context has been terminated and all connections are closed.
  shutdown: { error?: number };
  message: IncomingMessage;
};

export const startRoom = async (credentials: RoomCredentials, config: ConfigState, resumptionToken?: string) => {
  const roomPath = `v1/rooms/${credentials.roomId}`;

  let authUrl: URL;
  if (credentials.inviteCode !== undefined) {
    authUrl = new URL(`${roomPath}/start_invited`, getControllerBaseUrl(config));
  } else {
    authUrl = new URL(`${roomPath}/start`, getControllerBaseUrl(config));
  }

  const { breakoutRoomId, inviteCode, password } = credentials;
  const body = JSON.stringify(
    convertToSnakeCase({
      breakoutRoom: breakoutRoomId,
      inviteCode,
      password: !isEmpty(password) ? password : undefined,
      resumption: resumptionToken,
    })
  );

  const response = await fetchWithAuth(authUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  if (!response.ok) {
    if (response.status === 403) {
      const error = { status: response.status, code: StartRoomError.Forbidden };
      throw error;
    }
    if (response.status === 404) {
      const error = { status: response.status, code: StartRoomError.NotFound };
      throw error;
    }
    const { code, message }: ApiErrorWithBody<StartRoomError> = await response.json();
    const error = { status: response.status, code, message };
    throw error;
  }
  const { ticket, resumption }: { ticket: string; resumption: string } = await response.json();

  return { ticket, resumption };
};

/**
 * Transforms the participants Publishing object from Record<MediaSessionType, MediaSessionState> to and array SubscriberState descriptions.
 * @param {Participant} participant to get the media session state from
 * @returns {Array<SubscriberConfig>} for this participant as stored in redux
 */

const subscriberListFromParticipant = (participant: BackendParticipant): Array<SubscriberConfig> => {
  const list = new Array<SubscriberConfig>();
  if (participant.media?.video !== undefined) {
    list.push({ participantId: participant.id, mediaType: MediaSessionType.Video, ...participant.media.video });
  }
  if (participant.media?.screen !== undefined) {
    list.push({ participantId: participant.id, mediaType: MediaSessionType.Screen, ...participant.media.screen });
  }
  return list;
};

type WebRtcMessage =
  | SdpAnswer
  | SdpOffer
  | SdpCandidate
  | SdpEndOfCandidates
  | WebRtcUp
  | WebRtcDown
  | WebRtcSlow
  | MediaStatus;

export class ConferenceRoom extends BaseEventEmitter<ConferenceEvent> {
  private readonly signaling: SignalingSocket;
  public readonly webRtc: WebRtc;
  public readonly roomCredentials: RoomCredentials;
  private participantId?: ParticipantId;
  private participantName?: string;
  private rejoinTimer?: ReturnType<typeof window.setTimeout>;

  public static async create(
    roomCredentials: RoomCredentials,
    config: ConfigState,
    resumptionToken?: string
  ): Promise<{ conferenceContext: ConferenceRoom; resumption: string }> {
    console.debug('connect to room', roomCredentials, resumptionToken);
    const { ticket, resumption } = await startRoom(roomCredentials, config, resumptionToken);
    const signaling = new SignalingSocket(getSignalingUrl(config), ticket);
    const conferenceContext = new ConferenceRoom(roomCredentials, signaling, config);
    setCurrentConferenceRoom(conferenceContext);
    return { conferenceContext, resumption };
  }

  private constructor(roomCredentials: RoomCredentials, signaling: SignalingSocket, config: ConfigState) {
    super();

    this.roomCredentials = roomCredentials;
    this.signaling = signaling;
    this.signaling.addEventListener('connectionstatechange', this.signalingStateHandler);
    this.signaling.addEventListener('message', this.signalingMessageHandler);
    this.webRtc = new WebRtc(
      new MediaSignaling(signaling),
      new TurnProvider(config, roomCredentials.inviteCode),
      config.maxVideoBandwidth
    );
  }

  public join(displayName: string) {
    if (!this.signaling.isOpen()) {
      throw new Error('can not join room when not connected');
    }
    if (isEmpty(displayName)) {
      throw new Error('displayName must be not empty');
    }
    this.signaling.sendMessage({
      namespace: 'control',
      payload: { action: 'join', displayName },
    });
    this.participantName = displayName;
  }

  public createPublisher(mediaType: MediaSessionType, stream: MediaStream, quality: VideoSetting) {
    if (this.participantId === undefined) {
      throw new Error('conference not joined at publish');
    }
    return this.webRtc.createPublisher({ mediaType, participantId: this.participantId }, stream, quality);
  }

  private async handleWebRtcSignaling(message: WebRtcMessage, timestamp: Timestamp) {
    const descriptor = {
      participantId: message.source,
      mediaType: message.mediaSessionType,
    };

    switch (message.message) {
      case 'sdp_answer':
        await this.webRtc.handleSdpAnswer(descriptor, message.sdp);
        break;
      case 'sdp_offer':
        await this.webRtc.handleSdpOffer(descriptor, message.sdp);
        break;
      case 'webrtc_up':
        await this.webRtc.setConnectionState(descriptor, true);
        break;
      case 'webrtc_down':
        await this.webRtc.setConnectionState(descriptor, false);
        break;
      case 'webrtc_slow':
        await this.webRtc.handleSlowNotification(descriptor, message.direction, timestamp);
        break;
      case 'sdp_candidate':
        await this.webRtc.handleSdpCandidate(descriptor, message.candidate);
        break;
      case 'sdp_end_of_candidates':
        await this.webRtc.handleEndOfSdpCandidates(descriptor);
        break;
      case 'media_status':
        await this.webRtc.handleMediaStatus(descriptor, message);
        break;
      default: {
        const dataString = JSON.stringify(message, null, 2);
        console.error(`Unknown media message type: ${dataString}`);
        throw new Error(`Unknown message type: ${dataString}`);
      }
    }
  }

  private async handleControlMessage(message: ControlMessage) {
    switch (message.message) {
      case 'join_success': {
        this.participantId = message.id;

        message.participants
          .flatMap(subscriberListFromParticipant)
          .forEach((subscriber) => this.webRtc.updateMedia(subscriber));
        break;
      }
      case 'join_blocked':
        // try to automatically rejoin a blocked room
        this.rejoinTimer = setTimeout(() => {
          this.join(this.participantName ?? '');
        }, REJOIN_ON_BLOCKED_CONNECTION_TIME);
        break;
      case 'joined': {
        const subscribers = subscriberListFromParticipant(message);
        subscribers.forEach((subscriber) => this.webRtc.updateMedia(subscriber));
        break;
      }
      case 'update': {
        const participantId = message.id;

        const videoDescriptor: MediaDescriptor = { participantId, mediaType: MediaSessionType.Video };
        const screenDescriptor: MediaDescriptor = { participantId, mediaType: MediaSessionType.Screen };
        if (message.media?.video !== undefined) {
          this.webRtc.updateMedia({ ...videoDescriptor, ...message.media.video });
        } else {
          this.webRtc.removeSubscriber(videoDescriptor);
        }

        if (message.media?.screen !== undefined) {
          this.webRtc.updateMedia({ ...screenDescriptor, ...message.media.screen });
        } else {
          this.webRtc.removeSubscriber(screenDescriptor);
        }

        break;
      }
      case 'left': {
        this.webRtc.removeParticipant(message.id);
        break;
      }
    }
  }

  private signalingMessageHandler = (message: IncomingMessage) => {
    // TODO consume media messages
    // inspect join_success for participantId

    const { namespace, payload, timestamp } = message;
    switch (namespace) {
      case 'media': {
        const subType = payload.message;
        // TODO: Theses are actually a control messages -- talk to the backend
        if (
          subType === 'error' ||
          subType === 'request_mute' ||
          subType === 'focus_update' ||
          subType === 'presenter_granted' ||
          subType === 'presenter_revoked'
        ) {
          break;
        } else {
          this.handleWebRtcSignaling(payload, timestamp).catch((e) =>
            console.error('failed to handle signaling message for WebRTC', e, payload)
          );
          // do not propagate WebRTC messages
          return;
        }
      }
      case 'control':
        this.handleControlMessage(payload);
        break;
      default:
        //let the react app take care
        break;
    }
    this.eventEmitter.emit('message', message);
  };

  private signalingStateHandler = async (state: SignalingState) => {
    switch (state) {
      case 'connected':
        console.debug('signaling connected');
        this.eventEmitter.emit('connected');
        break;
      case 'disconnected':
        console.error('signaling disconnected abnormally');

        // TODO reconnect
        this.eventEmitter.emit('shutdown', { error: 9999 });
        return this.webRtc.close();
      case 'closed':
        // TODO: clearResumptionToken(credentials)
        this.eventEmitter.emit('shutdown', {});
        return this.webRtc.close();
    }
  };

  public sendMessage(message: OutgoingMessage) {
    this.signaling.sendMessage(message);
  }

  public shutdown() {
    console.info('shutdown conference context');
    this.webRtc.close();
    this.signaling.removeEventListener('message', this.signalingMessageHandler);
    this.signaling.removeEventListener('connectionstatechange', this.signalingStateHandler);

    this.signaling.disconnect();
    this.eventEmitter.emit('shutdown', {});
    this.eventEmitter.all.clear();
    this.rejoinTimer && clearTimeout(this.rejoinTimer);
  }
}
