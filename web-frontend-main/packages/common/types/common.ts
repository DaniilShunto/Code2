// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Seconds } from '../utils';
import { TimerState } from './timer';

export type ParticipantId = string & { readonly __tag: unique symbol };
export type GroupId = string & { readonly __tag: unique symbol };
// (r.floren) Quick hack to fix issues regarding this new superfluous type.
export type UserId = (string & { readonly __tag: unique symbol }) | ParticipantId;
export type TargetId = GroupId | ParticipantId;

export type LegalVoteId = string & { readonly __tag: unique symbol };

export type PollId = string & { readonly __tag: unique symbol };
export type ChoiceId = number & { readonly __tag: unique symbol };

export type RoomId = string & { readonly __tag: unique symbol };

// (r.floren) Currently the Signaling API sends numbers as breakoutRoomIds.
// This is about to change in the near future.
export type BreakoutRoomId = string & { readonly __tag: unique symbol };

export type InviteCode = string & { readonly __tag: unique symbol };

export type Timestamp = string & { readonly __tag: unique symbol };

export type FetchRequestError = {
  status: number;
  statusText: string;
};

export type FetchRequestState = {
  error?: FetchRequestError;
  loading: boolean;
};

export enum MediaSessionType {
  Screen = 'screen',
  Video = 'video',
}

export enum VideoSetting {
  Off = -1,
  Low = 0,
  Medium = 1,
  High = 2,
}

export enum ParticipationKind {
  User = 'user',
  Guest = 'guest',
  Sip = 'sip',
}

export interface MediaSessionState {
  audio: boolean;
  video: boolean;
  videoSettings: VideoSetting;
}

export interface PresenterRoleState {
  isPresenter: boolean;
}

export interface ProtocolState {
  readonly: boolean;
}

export interface TrickleCandidate {
  sdpMid: string;
  sdpMLineIndex: number;
  candidate: string;
}

export type Namespaces =
  | 'automod'
  | 'breakout'
  | 'chat'
  | 'control'
  | 'ee_chat'
  | 'legal_vote'
  | 'polls'
  | 'media'
  | 'moderation'
  | 'protocol'
  | 'timer'
  | 'recording'
  | 'whiteboard'
  | 'shared_folder'
  | 'echo';

export interface Namespaced<P = void, T extends string = Namespaces> {
  namespace: T;
  payload: P;
}
export interface NamespacedIncoming<P = void, T extends string = Namespaces> extends Namespaced<P, T> {
  timestamp: Timestamp;
}

export interface IParticipantControl {
  displayName: string;
  avatarUrl?: string;
  handIsUp: boolean;
  joinedAt: string;
  leftAt: string | null;
  handUpdatedAt: string;
  participationKind: ParticipationKind;
  role?: Role;
}

export type ParticipantMediaState = PresenterRoleState & {
  screen?: MediaSessionState;
  video?: MediaSessionState;
};

type TimerIsReady = Pick<TimerState, 'readyStatus'>;

export interface BackendParticipant {
  id: ParticipantId;
  // Core fields are present in any case
  control: IParticipantControl;
  protocol?: ProtocolState;
  media: ParticipantMediaState;
  timer?: TimerIsReady;
}

export interface CommonPoll {
  topic: string;
  live: boolean;
  duration: Seconds;
}

export interface ErrorStruct<E extends string> {
  message: 'error';
  error: E;
}

export interface Command {
  action: string;
}

export enum Role {
  Guest = 'guest',
  User = 'user',
  Moderator = 'moderator',
}

export enum WaitingState {
  Joined = 'joined',
  Waiting = 'waiting',
  Approved = 'approved',
}

export type LibravatarDefaultImage = '404' | 'mm' | 'monsterid' | 'wavatar' | 'retro' | 'robohash' | 'pagan';

export enum RoomMode {
  CoffeeBreak = 'coffee-break',
  TalkingStick = 'talking-stick',
}

export enum KickScope {
  All = 'all',
  Guests = 'guests',
  UsersAndGuests = 'users_and_guests',
}
