// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { MediaSessionType, VideoSetting } from '@opentalk/common';

import { BaseEventEmitter } from '../EventListener';
import { ConferenceRoom } from '../WebRTC';
import { PublisherConnection } from '../WebRTC/PublisherConnection';

export type LocalScreenEvent = {
  stopped: void;
};

export class LocalScreen extends BaseEventEmitter<LocalScreenEvent> {
  private static instance?: LocalScreen;
  static getInstance() {
    if (!LocalScreen.instance) {
      LocalScreen.instance = new LocalScreen();
    }
    return LocalScreen.instance;
  }

  private constructor() {
    super();
  }

  private qualityCap: VideoSetting = VideoSetting.High;

  public readonly stream = new MediaStream();

  private conference?: ConferenceRoom;
  private connection?: PublisherConnection;

  private readonly shutdownHandler = () => {
    this.conference?.removeEventListener('shutdown', this.shutdownHandler);
    this.conference = undefined;
  };

  public updateConferenceContext = async (conference: ConferenceRoom) => {
    this.conference = conference;
    this.conference.addEventListener('shutdown', this.shutdownHandler);

    if (this.isEnabled()) {
      await this.publishIfOnline();
    }
  };

  public isEnabled() {
    return this.stream.getVideoTracks().find((t) => t.enabled && t.readyState === 'live') !== undefined;
  }

  private stoppedHandler = () => {
    this.release();
  };

  private getShareScreenStream = async () => {
    return navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
  };

  public start = async () => {
    if (this.isEnabled()) {
      throw new Error('screen share already started');
    }
    const stream = await this.getShareScreenStream();
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack !== undefined) {
      videoTrack.addEventListener('ended', this.stoppedHandler);
      await this.replaceTrack(videoTrack);
    }

    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack !== undefined) {
      await this.replaceTrack(audioTrack);
    }

    await this.publishIfOnline();
  };

  private publishIfOnline = async () => {
    if (this.conference === undefined || this.connection !== undefined) {
      return;
    }

    this.connection = await this.conference.createPublisher(MediaSessionType.Screen, this.stream, this.qualityCap);
    this.connection.addEventListener('closed', () => {
      this.connection = undefined;
    });
  };

  private replaceTrack = async (track: MediaStreamTrack) => {
    const oldTracks = this.stream.getTracks().filter((t) => t.kind === track.kind);
    oldTracks.forEach((t) => {
      this.stream.removeTrack(t);
      t.stop();
    });
    this.stream.addTrack(track);

    await this.connection?.replacedTrack(track.id);
  };

  public setQuality(qualityCap: VideoSetting) {
    this.qualityCap = qualityCap;
    this.connection?.requestQuality(qualityCap);
  }

  public release() {
    this.connection?.close();
    this.connection = undefined;
    this.stream.getTracks().forEach((t) => {
      t.removeEventListener('ended', this.stoppedHandler);
      this.stream.removeTrack(t);
      t.stop();
    });
    this.eventEmitter.emit('stopped');
  }
}

const localScreenContext = LocalScreen.getInstance();
export default localScreenContext;
