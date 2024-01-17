// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  BackendParticipant,
  ErrorStruct,
  isErrorStruct,
  NamespacedIncoming,
  ParticipantId,
  JoinSuccessIncoming,
} from '@opentalk/common';

interface AssociatedParticipant {
  id: ParticipantId;
}

export enum Role {
  Guest = 'guest',
  User = 'user',
  Moderator = 'moderator',
}

export interface JoinBlocked {
  message: 'join_blocked';
  reason: 'participant-limit-reached';
}

export interface Joined extends BackendParticipant {
  message: 'joined';
}

export interface Left extends AssociatedParticipant {
  message: 'left';
}

export interface Update extends BackendParticipant {
  message: 'update';
}

export interface TimeLimitQuotaElapsed {
  message: 'time_limit_quota_elapsed';
}

export interface RoleUpdated {
  message: 'role_updated';
  newRole: Role;
}

// Currently this is a string
export type ControlError = string;

export const isError = isErrorStruct;

export type Message =
  | JoinSuccessIncoming
  | JoinBlocked
  | Update
  | Joined
  | Left
  | RoleUpdated
  | TimeLimitQuotaElapsed
  | ErrorStruct<ControlError>;
export type Control = NamespacedIncoming<Message, 'control'>;

export default Control;
