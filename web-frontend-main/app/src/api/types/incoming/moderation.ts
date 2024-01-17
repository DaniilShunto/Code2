// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { BackendParticipant, NamespacedIncoming, ParticipantId } from '@opentalk/common';

export interface KickedParticipant {
  message: 'kicked';
}

export interface BannedParticipant {
  message: 'banned';
}

export interface InWaitingRoom {
  message: 'in_waiting_room';
}

export interface WaitingRoomEnabled {
  message: 'waiting_room_enabled';
}

export interface WaitingRoomDisabled {
  message: 'waiting_room_disabled';
  id: ParticipantId;
}

export interface AcceptedInMeeting {
  message: 'accepted';
}

export interface HandraisesReset {
  message: 'raised_hand_reset_by_moderator';
}
export interface HandraisesDisabled {
  message: 'raise_hands_disabled';
}
export interface HandraisesEnabled {
  message: 'raise_hands_enabled';
}

export interface DebriefStarted {
  message: 'debriefing_started';
}
export interface DebriefSessionEnded {
  message: 'session_ended';
}

/* MODERATOR ONLY */

// Signals to moderator that a participant has joined the waiting room.
export interface JoinedWaitingRoom extends BackendParticipant {
  message: 'joined_waiting_room';
}
// Signals to moderator that a participant has left the waiting room.
export interface leftWaitingRoom extends BackendParticipant {
  message: 'left_waiting_room';
  id: ParticipantId;
}

export type Message =
  | KickedParticipant
  | BannedParticipant
  | InWaitingRoom
  | WaitingRoomEnabled
  | WaitingRoomDisabled
  | AcceptedInMeeting
  | JoinedWaitingRoom
  | leftWaitingRoom
  | HandraisesReset
  | HandraisesDisabled
  | HandraisesEnabled
  | DebriefStarted
  | DebriefSessionEnded;

export type Moderation = NamespacedIncoming<Message, 'moderation'>;

export default Moderation;
