// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  MediaSessionState,
  MediaSessionType,
  Namespaced,
  ParticipantId,
  TrickleCandidate,
  VideoSetting,
  createModule,
} from '@opentalk/common';

import { RootState } from '../../../store';
import { createSignalingApiCall } from '../../createSignalingApiCall';
import { sendMessage } from '../../index';

interface Target {
  target: ParticipantId;
  mediaSessionType: MediaSessionType;
}

interface TargetedSdp extends Target {
  sdp: string;
}

interface AssociatedMediaSession {
  mediaSessionType: MediaSessionType;
}

interface TargetedCandidate extends Target {
  candidate: TrickleCandidate;
}

export interface MediaSessionInfo {
  mediaSessionType: MediaSessionType;
  mediaSessionState: MediaSessionState;
}

export interface Publish extends TargetedSdp {
  action: 'publish';
}

export interface PublishComplete extends MediaSessionInfo {
  action: 'publish_complete';
}

export interface Unpublish extends AssociatedMediaSession {
  action: 'unpublish';
}

export interface UpdateMediaSession extends MediaSessionInfo {
  action: 'update_media_session';
}

export interface Subscribe extends Target {
  action: 'subscribe';
}

export interface Resubscribe extends Target {
  action: 'resubscribe';
}

export interface Configure extends Target {
  action: 'configure';
  configuration: Configuration;
}

export interface Configuration {
  video?: boolean;
  substream?: VideoSetting;
}

export interface SdpAnswer extends TargetedSdp {
  action: 'sdp_answer';
}

export interface SdpCandidate extends TargetedCandidate {
  action: 'sdp_candidate';
}

export interface SdpEndOfCandidates extends Target {
  action: 'sdp_end_of_candidates';
}

export interface ModeratorMute {
  action: 'moderator_mute';
  targets: Array<ParticipantId>;
  force: boolean;
}

export interface GrantPresenterRole {
  action: 'grant_presenter_role';
  participantIds: Array<ParticipantId>;
}

export interface RevokePresenterRole {
  action: 'revoke_presenter_role';
  participantIds: Array<ParticipantId>;
}

export type Action =
  | Publish
  | PublishComplete
  | Unpublish
  | UpdateMediaSession
  | SdpAnswer
  | Subscribe
  | Resubscribe
  | Configure
  | SdpCandidate
  | SdpEndOfCandidates
  | GrantPresenterRole
  | RevokePresenterRole
  | ModeratorMute;

export type Media = Namespaced<Action, 'media'>;

export const requestMute = createSignalingApiCall<ModeratorMute>('media', 'moderator_mute');
export const grantPresenterRole = createSignalingApiCall<GrantPresenterRole>('media', 'grant_presenter_role');
export const revokePresenterRole = createSignalingApiCall<RevokePresenterRole>('media', 'revoke_presenter_role');

export const handler = createModule<RootState>((builder) => {
  builder.addCase(requestMute.action, (_state, action) => {
    sendMessage(requestMute(action.payload));
  });
  builder.addCase(grantPresenterRole.action, (_state, action) => {
    sendMessage(grantPresenterRole(action.payload));
  });
  builder.addCase(revokePresenterRole.action, (_state, action) => {
    sendMessage(revokePresenterRole(action.payload));
  });
});

export default Media;
