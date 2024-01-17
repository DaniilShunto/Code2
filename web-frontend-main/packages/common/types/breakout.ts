// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { BreakoutRoomId, ParticipantId, ParticipationKind } from './common';

export interface BreakoutRoom {
  id: BreakoutRoomId;
  name: string;
}

export interface ParticipantInOtherRoom {
  // BreakoutRoomId or null, null means the participant is in the parent room.
  breakoutRoom: BreakoutRoomId | null;
  id: ParticipantId;
  displayName: string;
  avatarUrl?: string;
  leftAt: string | null;
  participationKind: ParticipationKind;
}

export interface InitialBreakout {
  participants: Array<ParticipantInOtherRoom>;
  rooms: Array<BreakoutRoom>;
  // ISO timestamp or null, null means the room won't expire.
  expires: string | null;
  // BreakoutRoomId or null, null means the participant is in the parent room.
  current: BreakoutRoomId | null;
}
