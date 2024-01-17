// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { BreakoutRoomId, GroupId, ParticipantId, ParticipationKind, Role, WaitingState } from './common';

export interface Participant {
  id: ParticipantId;
  breakoutRoomId: BreakoutRoomId | null;
  displayName: string;
  avatarUrl?: string;
  handIsUp: boolean;
  joinedAt: string;
  leftAt: string | null;
  handUpdatedAt?: string;
  groups: GroupId[];
  participationKind: ParticipationKind;
  lastActive: string;
  role?: Role;
  waitingState: WaitingState;
  protocolAccess: ProtocolAccess;
  isPresenter: boolean;
}

export enum ProtocolAccess {
  Read = 'read',
  Write = 'write',
  None = 'none',
}

export type FilterableParticipant = Pick<Participant, 'displayName'>;
