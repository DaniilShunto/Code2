// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createModule, KickScope, Namespaced, ParticipantId } from '@opentalk/common';

import { RootState } from '../../../store';
import { createSignalingApiCall } from '../../createSignalingApiCall';
import { sendMessage } from '../../index';

export interface KickParticipant {
  action: 'kick';
  target: ParticipantId;
}
export interface BanParticipant {
  action: 'ban';
  target: ParticipantId;
}
export interface EnableWaitingRoom {
  action: 'enable_waiting_room';
}

export interface DisableWaitingRoom {
  action: 'disable_waiting_room';
}

export interface AcceptParticipantFromWaitingRoomToRoom {
  action: 'accept';
  target: ParticipantId;
}
export interface EnableRaiseHands {
  action: 'enable_raise_hands';
}

export interface DisableRaiseHands {
  action: 'disable_raise_hands';
}

export interface ResetRaisedHands {
  action: 'reset_raised_hands';
}

export interface Debrief {
  action: 'debrief';
  kickScope: KickScope;
}

export type Action =
  | KickParticipant
  | BanParticipant
  | EnableWaitingRoom
  | DisableWaitingRoom
  | AcceptParticipantFromWaitingRoomToRoom
  | ResetRaisedHands
  | EnableRaiseHands
  | DisableRaiseHands
  | Debrief;

export type Moderation = Namespaced<Action, 'moderation'>;

export const kickParticipant = createSignalingApiCall<KickParticipant>('moderation', 'kick');
export const banParticipant = createSignalingApiCall<BanParticipant>('moderation', 'ban');
export const enableWaitingRoom = createSignalingApiCall<EnableWaitingRoom>('moderation', 'enable_waiting_room');
export const disableWaitingRoom = createSignalingApiCall<DisableWaitingRoom>('moderation', 'disable_waiting_room');
export const acceptParticipantFromWaitingRoomToRoom = createSignalingApiCall<AcceptParticipantFromWaitingRoomToRoom>(
  'moderation',
  'accept'
);
export const resetRaisedHands = createSignalingApiCall<ResetRaisedHands>('moderation', 'reset_raised_hands');
export const enableRaiseHands = createSignalingApiCall<EnableRaiseHands>('moderation', 'enable_raise_hands');
export const disableRaiseHands = createSignalingApiCall<DisableRaiseHands>('moderation', 'disable_raise_hands');
export const debrief = createSignalingApiCall<Debrief>('moderation', 'debrief');

export const handler = createModule<RootState>((builder) => {
  builder
    .addCase(kickParticipant.action, (_state, action) => {
      sendMessage(kickParticipant(action.payload));
    })
    .addCase(banParticipant.action, (_state, action) => {
      sendMessage(banParticipant(action.payload));
    })
    .addCase(enableWaitingRoom.action, () => {
      sendMessage(enableWaitingRoom());
    })
    .addCase(disableWaitingRoom.action, () => {
      sendMessage(disableWaitingRoom());
    })
    .addCase(acceptParticipantFromWaitingRoomToRoom.action, (_state, action) => {
      sendMessage(acceptParticipantFromWaitingRoomToRoom(action.payload));
    })
    .addCase(resetRaisedHands.action, () => {
      sendMessage(resetRaisedHands());
    })
    .addCase(enableRaiseHands.action, () => {
      sendMessage(enableRaiseHands());
    })
    .addCase(disableRaiseHands.action, () => {
      sendMessage(disableRaiseHands());
    })
    .addCase(debrief.action, (_state, action) => {
      sendMessage(debrief(action.payload));
    });
});

export default Moderation;
