// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { MediaSessionState, MediaSessionType, VideoSetting } from '@opentalk/common';
import { isEqual } from 'lodash';

import { MediaStatusChange } from '../../api/types/incoming/media';
import { MediaSessionInfo } from '../../api/types/outgoing/media';
import { blackTrack, getDimensions } from '../Media';
import { BaseWebRtcConnection } from './BaseWebRtcConnection';
import { MediaSignaling } from './MediaSignaling';
import { MediaDescriptor } from './WebRTC';

const bitrateFromSetting = (quality: VideoSetting, maxVideoBandwidth: number) => {
  switch (quality) {
    case VideoSetting.High:
      return maxVideoBandwidth;
    case VideoSetting.Medium:
      return Math.min(300000, maxVideoBandwidth / 3);
    case VideoSetting.Low:
    default:
      return 80_000;
  }
};

/* Note that `active` is only supported in Firefox v110
 * see https://bugzilla.mozilla.org/show_bug.cgi?id=1676855#c0
 * the workaround results in 3x5px videos.
 * We need to live with higher bandwidth usage on Firefox until v110
 */
const configFromSetting = (
  qualitySetting: VideoSetting,
  mediaType: MediaSessionType,
  active = true,
  maxVideoBandwidth: number
): RTCRtpEncodingParameters => {
  const maxBitrate = bitrateFromSetting(qualitySetting, maxVideoBandwidth);
  switch (qualitySetting) {
    case VideoSetting.High:
      return { rid: 'high', active, maxBitrate, scaleResolutionDownBy: 1 };
    case VideoSetting.Medium:
      return {
        rid: 'medium',
        active,
        maxBitrate,
        scaleResolutionDownBy: mediaType === MediaSessionType.Video ? 2 : 1,
      };
    case VideoSetting.Low:
    default:
      return { rid: 'low', active, maxBitrate, scaleResolutionDownBy: mediaType === MediaSessionType.Video ? 4 : 1 };
  }
};

const simulcastEncodings = (
  mediaType: MediaSessionType,
  quality: VideoSetting,
  maxVideoBandwidth: number
): RTCRtpEncodingParameters[] => {
  return [
    configFromSetting(VideoSetting.High, mediaType, quality >= VideoSetting.High, maxVideoBandwidth),
    configFromSetting(VideoSetting.Medium, mediaType, quality >= VideoSetting.Medium, maxVideoBandwidth),
    configFromSetting(VideoSetting.Low, mediaType, true, maxVideoBandwidth),
  ];
};

export class PublisherConnection extends BaseWebRtcConnection {
  private readonly stream: MediaStream;
  private announcedMediaState?: MediaSessionInfo;
  private maxVideoBandwidth: number;
  private parkedTrack?: string;

  private mediaStatus: Omit<MediaSessionState, 'videoSettings'> = { audio: false, video: false };
  private publishComplete = false;

  public updateMediaStatus({ kind, receiving }: MediaStatusChange) {
    this.mediaStatus[kind] = receiving;

    if (receiving && !this.publishComplete) {
      this.signaling.announcePublishComplete(this.computeMediaState());
      this.publishComplete = true;
    }
  }

  constructor(
    iceServers: RTCIceServer[],
    descriptor: MediaDescriptor,
    signaling: MediaSignaling,
    stream: MediaStream,
    quality: VideoSetting,
    maxVideoBandwidth: number
  ) {
    super(iceServers, descriptor, signaling, quality);
    this.maxVideoBandwidth = maxVideoBandwidth;
    this.stream = stream;
    this.peerConnection.addEventListener('negotiationneeded', async (ev) => {
      console.debug(`PublishingConnection ${this.descriptor.mediaType} negotiation needed -> re-offer/publish`, ev);
      const iceRestart = this.peerConnection.connectionState === 'failed';
      const initialSdp = await this.peerConnection.createOffer({ iceRestart });
      await this.peerConnection.setLocalDescription(initialSdp);
      this.signaling.announcePublish(this.descriptor, initialSdp);
    });

    this.peerConnection.addEventListener('iceconnectionstatechange', () => {
      const state = this.peerConnection.iceConnectionState;
      if (state === 'failed') {
        if (this.publishComplete) {
          this.publishComplete = true;
          console.warn('initiating ICE restart');
          this.peerConnection.restartIce();
        } else {
          console.error('ICE restart failed');
        }
      }
    });

    this.peerConnection.addEventListener('track', (ev) => {
      console.warn(`PublishingConnection ${this.descriptor.mediaType} unhanded local ontrack`, ev);
    });
    this.publish();
  }

  private publish() {
    if (this.peerConnection.getSenders().length > 0) {
      throw new Error(`Already published ${this.descriptor.mediaType} stream`);
    }

    if (this.stream.getVideoTracks().length !== 1) {
      throw new Error(
        `Expect to publish a stream with one video track. Got ${this.stream.getVideoTracks().length} tracks`
      );
    }

    if (this.descriptor.mediaType === 'video' && this.stream.getAudioTracks().length !== 1) {
      throw new Error(
        `Expect to publish a stream with one audio track. Got ${this.stream.getAudioTracks().length} tracks`
      );
    }

    if (this.stream.getAudioTracks().length > 1) {
      throw new Error(
        `Expect to publish a stream with only one audio track. Got ${this.stream.getAudioTracks().length} tracks`
      );
    }

    for (const track of this.stream.getTracks()) {
      this.setupSimulcastTrack(track);
    }
    this.announcedMediaState = this.computeMediaState();
  }

  private setupSimulcastTrack(track: MediaStreamTrack) {
    const trackConfig: RTCRtpTransceiverInit = {
      direction: 'sendonly',
      streams: [this.stream],
    };

    if (track.kind === 'video') {
      trackConfig.sendEncodings = simulcastEncodings(
        this.descriptor.mediaType,
        this.currentQuality,
        this.maxVideoBandwidth
      );

      if (this.currentQuality === VideoSetting.Off) {
        this.parkedTrack = track.id;
        console.warn('publishing video disabled video track due to quality limit');
        const dummyTrack = blackTrack(getDimensions(track));
        this.peerConnection.addTransceiver(dummyTrack, trackConfig);
        return;
      }
    }
    this.peerConnection.addTransceiver(track, trackConfig);
  }

  public replacedTrack = async (trackId: string) => {
    const track = this.stream.getTrackById(trackId);
    if (track === null) {
      throw new Error('Expected new track to be in the stream on notification');
    }

    if (track.kind === 'audio' || this.currentQuality > VideoSetting.Off) {
      const sender = this.peerConnection.getSenders().find((s) => s.track?.kind === track.kind);

      if (sender === undefined) {
        throw new Error('Expected a track to be published for this connection');
      }

      await sender.replaceTrack(track);
      this.trackUpdated();
    } else {
      this.parkedTrack = trackId;
    }
  };

  public trackUpdated() {
    const mediaState = this.computeMediaState();
    if (!isEqual(mediaState, this.announcedMediaState)) {
      this.signaling.updateMediaSession(mediaState);
      this.announcedMediaState = mediaState;
    }
  }

  private computeMediaState(): MediaSessionInfo {
    const senders = this.peerConnection.getSenders();
    const state: MediaSessionState = { audio: false, video: false, videoSettings: this.currentQuality };
    senders.forEach((s) => {
      if (s.track) {
        if (s.track.kind === 'audio') state.audio = s.track.enabled;
        if (s.track.kind === 'video') state.video = s.track.enabled;
      }
    });

    return {
      mediaSessionType: this.descriptor.mediaType,
      mediaSessionState: state,
    };
  }

  public requestQuality(quality: VideoSetting) {
    this.setQualityTarget(quality);
  }

  private async parkTrack(sender: RTCRtpSender) {
    const track = sender.track;
    if (track === null) {
      throw new Error('configuring sender without track - closed?');
    }

    if (this.parkedTrack !== undefined) {
      throw new Error('there is already parked track - multi track stream not implemented');
    }
    this.parkedTrack = track.id;

    const dummyTrack = blackTrack(getDimensions(track));
    await sender.replaceTrack(dummyTrack);
  }

  private async resumeTrack(sender: RTCRtpSender, quality: VideoSetting) {
    const track = sender.track;
    if (track === null) {
      throw new Error('configuring sender without track - closed?');
    }

    if (quality === VideoSetting.Off) {
      throw new Error('resume requires at least quality VideoSetting.Low');
    }

    if (!track.enabled && this.parkedTrack) {
      const videoTrack = this.stream.getTrackById(this.parkedTrack) || undefined;
      if (videoTrack === undefined) {
        throw new Error('parked track missing');
      }
      await sender.replaceTrack(videoTrack);
      this.parkedTrack = undefined;
    }

    const parameters = sender.getParameters();
    parameters.encodings = simulcastEncodings(this.descriptor.mediaType, quality, this.maxVideoBandwidth);
    await sender.setParameters(parameters);
  }

  protected async configureQuality(quality: VideoSetting) {
    const senders = this.peerConnection.getSenders();
    const videoSenders = senders.filter((s) => s.track?.kind === 'video');

    if (videoSenders.length === 0) {
      throw new Error('can not configureQuality when senders are online - unpublished or closed?');
    }

    //TODO: It would be easier to stop and recreate senders when needed
    //      but the backend does not support it yet. So we need to park the track instead.
    //      Using track.enable = false; would have side effects for the UI.
    for (const sender of videoSenders) {
      if (quality === VideoSetting.Off) {
        await this.parkTrack(sender);
      } else {
        await this.resumeTrack(sender, quality);
      }
    }

    this.trackUpdated();
  }

  public close() {
    this.signaling.announceUnpublish(this.descriptor);
    super.close();
  }

  public handleAnswer(sdp: string) {
    this.peerConnection.setRemoteDescription({ sdp: sdp, type: 'answer' }).catch((e) => {
      console.error('failed to set SDP remote description', e, this.descriptor, sdp);
      this.close();
    });
  }
}
