// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
//! Incoming Breakout Room related messages
import {
  BreakoutRoom,
  BreakoutRoomId,
  ErrorStruct,
  isEnumErrorStruct,
  NamespacedIncoming,
  ParticipantId,
  ParticipantInOtherRoom,
} from '@opentalk/common';

export interface AssocParticipantInOtherRoom {
  // BreakoutRoomId or null, null means the participant was in the parent room.
  breakoutRoom: BreakoutRoomId | null;
  id: ParticipantId;
}

export interface Started {
  message: 'started';
  rooms: Array<BreakoutRoom>;
  assignment: BreakoutRoomId | null;
  expires?: string;
}

export interface Stopped {
  message: 'stopped';
}

export interface Expired {
  message: 'expired';
}

export interface Joined extends ParticipantInOtherRoom {
  message: 'joined';
}

export interface Left extends AssocParticipantInOtherRoom {
  message: 'left';
}

export enum BreakoutError {
  InsufficientPermissions = 'insufficient_permissions',
}

export const isError = isEnumErrorStruct(BreakoutError);

export type Message = Started | Stopped | Expired | Joined | Left | ErrorStruct<BreakoutError>;
export type Breakout = NamespacedIncoming<Message, 'breakout'>;

export default Breakout;
