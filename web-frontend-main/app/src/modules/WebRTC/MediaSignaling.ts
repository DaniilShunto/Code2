// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { VideoSetting } from '@opentalk/common';
import { isEmpty } from 'lodash';

import { MediaSessionInfo, Action, ModeratorMute } from '../../api/types/outgoing/media';
import { SignalingSocket } from './SignalingSocket';
import { MediaDescriptor } from './index';

export class MediaSignaling {
  private socket: SignalingSocket;

  constructor(socket: SignalingSocket) {
    this.socket = socket;
  }

  private startAction<A extends Exclude<Action, ModeratorMute>>(action: A) {
    if (!this.socket.isOpen()) {
      throw new Error(`start ${action} on closed signaling`);
    }
    this.socket.sendMessage({ namespace: 'media', payload: action });
  }

  public createIceCandidateHandler = (descriptor: MediaDescriptor) => (ev: RTCPeerConnectionIceEvent) => {
    // Send IceCandidates to Signaling
    if (ev.candidate == null) {
      this.startAction({
        action: 'sdp_end_of_candidates',
        target: descriptor.participantId,
        mediaSessionType: descriptor.mediaType,
      });
    } else {
      if (isEmpty(ev.candidate.candidate)) {
        // skipping empty candidates - end_of_candidates - for media streams
        // only ev.candidate === null is used as end_of_candidates
        return;
      }
      if (ev.candidate.sdpMid !== null && ev.candidate.sdpMLineIndex !== null) {
        this.startAction({
          action: 'sdp_candidate',
          target: descriptor.participantId,
          mediaSessionType: descriptor.mediaType,
          candidate: {
            sdpMid: ev.candidate.sdpMid,
            sdpMLineIndex: ev.candidate.sdpMLineIndex,
            candidate: ev.candidate.candidate,
          },
        });
      }
    }
  };

  public announcePublish(descriptor: MediaDescriptor, value: RTCSessionDescriptionInit) {
    if (value.sdp) {
      this.startAction({
        action: 'publish',
        target: descriptor.participantId,
        mediaSessionType: descriptor.mediaType,
        sdp: value.sdp,
      });
    } else {
      console.warn('ignoring publish with empty SDP message');
    }
  }

  public announcePublishComplete(session: MediaSessionInfo) {
    this.startAction({
      action: 'publish_complete',
      ...session,
    });
  }

  public announceUnpublish(descriptor: MediaDescriptor) {
    if (!this.socket.isOpen()) {
      console.warn('skip announceUnpublish for closed signaling');
      return;
    }
    this.startAction({
      action: 'unpublish',
      mediaSessionType: descriptor.mediaType,
    });
  }

  public updateMediaSession(session: MediaSessionInfo) {
    this.startAction({
      action: 'update_media_session',
      ...session,
    });
  }

  public sdpAnswer(sdp: string, descriptor: MediaDescriptor) {
    this.startAction({
      action: 'sdp_answer',
      target: descriptor.participantId,
      mediaSessionType: descriptor.mediaType,
      sdp: sdp,
    });
  }

  public requestOffer(descriptor: MediaDescriptor) {
    this.startAction({
      action: 'subscribe',
      target: descriptor.participantId,
      mediaSessionType: descriptor.mediaType,
    });
  }

  public resubscribe(descriptor: MediaDescriptor) {
    this.startAction({
      action: 'resubscribe',
      target: descriptor.participantId,
      mediaSessionType: descriptor.mediaType,
    });
  }

  public configureReceiver(descriptor: MediaDescriptor, videoSetting: VideoSetting) {
    if (!this.socket.isOpen()) {
      console.warn('skip configureReceiver for closed signaling');
      return;
    }

    let configuration;
    if (videoSetting === VideoSetting.Off) {
      configuration = {
        video: false,
      };
    } else {
      configuration = {
        video: true,
        substream: videoSetting,
      };
    }

    this.startAction({
      action: 'configure',
      target: descriptor.participantId,
      mediaSessionType: descriptor.mediaType,
      configuration,
    });
  }
}
