// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { TrickleCandidate, VideoSetting } from '@opentalk/common';

import { BaseEventEmitter } from '../EventListener';
import { MediaSignaling } from './MediaSignaling';
import ConnectionStats, { StatsEvent } from './Statistics/ConnectionStats';
import { idFromDescriptor, MediaDescriptor, QualityLimit, SubscriberStateChanged } from './WebRTC';

export type ConnectionEvent = {
  closed: void;
  up: void;
  down: void;
  subscriberstatechanged: SubscriberStateChanged;
  qualityLimit: QualityLimit;
};

export abstract class BaseWebRtcConnection extends BaseEventEmitter<ConnectionEvent> {
  protected stats?: ConnectionStats;
  protected readonly peerConnection: RTCPeerConnection;
  public readonly descriptor: MediaDescriptor;
  protected readonly signaling: MediaSignaling;
  protected qualityLimit: VideoSetting = VideoSetting.High;
  protected qualityTarget: VideoSetting;
  protected currentQuality: VideoSetting;

  private _up = false;

  public set up(value: boolean) {
    this._up = value;
    this.eventEmitter.emit(value ? 'up' : 'down');
  }

  public get up(): boolean {
    return this._up;
  }

  protected abstract configureQuality(quality: VideoSetting): void;

  public updateQuality() {
    const quality = Math.min(this.qualityTarget, this.qualityLimit);
    if (this.currentQuality === quality) {
      return;
    }
    this.currentQuality = quality;
    this.configureQuality(this.currentQuality);
  }

  protected setQualityTarget(quality: VideoSetting) {
    this.qualityTarget = quality;
    this.updateQuality();
  }

  public updateQualityLimit(limit: VideoSetting) {
    this.qualityLimit = limit;
    this.updateQuality();
  }

  protected isConnected = () => this.peerConnection.connectionState === 'connected';

  protected constructor(
    iceServers: RTCIceServer[],
    descriptor: MediaDescriptor,
    signaling: MediaSignaling,
    qualityTarget: VideoSetting
  ) {
    super();

    this.descriptor = descriptor;
    this.signaling = signaling;
    this.qualityTarget = qualityTarget;
    this.currentQuality = qualityTarget;
    this.updateQuality();

    this.peerConnection = new RTCPeerConnection({ iceServers: iceServers });
    this.peerConnection.addEventListener('icecandidate', signaling.createIceCandidateHandler(descriptor));
    /* only needed to debug webrtc signaling issues
    this.peerConnection.addEventListener('signalingstatechange', (ev) => {
      console.debug(
        `Signaling state for ${idFromDescriptor(descriptor)} changed to ${this.peerConnection.signalingState}`
      );
    });
     */
    this.peerConnection.addEventListener('iceconnectionstatechange', () => {
      console.debug(
        `ICE connection state for ${idFromDescriptor(descriptor)} changed to '${
          this.peerConnection.iceConnectionState
        }'`
      );
    });
    /* only needed to debug webrtc ICE discovery issues
    this.peerConnection.addEventListener('icegatheringstatechange', () => {
      console.debug(
        `ICE gathering state for ${idFromDescriptor(descriptor)} changed to '${this.peerConnection.iceGatheringState}'`
      );
    });
    */
  }

  public handleSdpCandidate(candidate?: TrickleCandidate) {
    return this.peerConnection.addIceCandidate(candidate);
  }

  public close() {
    const connectionState = this.peerConnection.connectionState;
    if (connectionState === 'closed') {
      console.warn('called close on a closed connection', this.descriptor);
    }
    this.up = false;
    this.peerConnection.close();
    this.eventEmitter.emit('closed');
    this.eventEmitter.all.clear();
  }

  public async updateStats(): Promise<StatsEvent | undefined> {
    const report = await this.peerConnection.getStats();
    if (report === undefined) {
      console.warn('no stats update for connection:', this);
      return;
    }

    if (this.stats === undefined) {
      this.stats = new ConnectionStats(report);
      return;
    }

    return this.stats.update(report);
  }
}
