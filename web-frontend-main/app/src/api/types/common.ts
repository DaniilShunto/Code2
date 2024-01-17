// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { LegalVoteId, ParticipantId } from '@opentalk/common';

export declare enum VoteCancelReasonType {
  InitiatorLeft = 'initiator_left',
  RoomDestroyed = 'room_destroyed',
  Custom = 'custom',
}
export interface VoteCanceledInitiatorLeft {
  message: 'canceled';
  legalVoteId: LegalVoteId;
  reason: VoteCancelReasonType.InitiatorLeft;
}
export interface CanceledRoomDestroyed {
  message: 'canceled';
  legalVoteId: LegalVoteId;
  reason: VoteCancelReasonType.RoomDestroyed;
}
export interface VoteCanceledCustom {
  message: 'canceled';
  legalVoteId: LegalVoteId;
  reason: VoteCancelReasonType.Custom;
  custom: string;
}
export type VoteCanceled = VoteCanceledInitiatorLeft | CanceledRoomDestroyed | VoteCanceledCustom;
export declare enum LegalVoteError {
  VoteAlreadyActive = 'vote_already_active',
  NoVoteActive = 'no_vote_active',
  InvalidVoteId = 'invalid_vote_id',
  Ineligible = 'ineligible',
  Internal = 'internal',
}

export interface VoteParameters {
  name: string;
  topic: string;
  allowedParticipants: Array<ParticipantId>;
  enableAbstain: boolean;
  autoStop: boolean;
  duration: number | null;
  subtitle: string;
  createPdf: boolean;
}
export type VoteOption = 'yes' | 'no' | 'abstain';
export declare const isVoteOption: (option: string) => option is VoteOption;
export interface LegalVoteFormValues {
  id?: number;
  duration: number | string;
  enableAbstain: boolean;
  autoStop: boolean;
  name: string;
  topic: string;
  subtitle?: string;
}
export interface LegalVoteType {
  id: LegalVoteId;
  startTime: string;
  localStartTime: string;
  localStopTime?: string;
  state: 'active' | 'finished' | 'canceled';
  name: string;
  topic: string;
  allowedParticipants: Array<ParticipantId>;
  enableAbstain: boolean;
  autoStop: boolean;
  duration: number | null;
  subtitle?: string;
  votes: Record<VoteOption, number>;
  voters?: Record<ParticipantId, VoteOption>;
  cancelReason?: VoteCancelReasonType;
  customCancelReason?: string;
  voted: boolean;
}
