// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { InitialAutomod } from '../automod';
import { InitialBreakout } from '../breakout';
import { ChatMessage, InitialChat } from '../chat';
import { BackendParticipant, GroupId, ParticipantId, ParticipantMediaState, Role, Timestamp } from '../common';
import { TimerState } from '../timer';
import { EventInfo } from '../eventInfo';
import { Participant } from '../participant';
import { InitialPoll } from '../poll';
import { SharedFolderData } from '../sharedFolder';
import { Tariff } from '../tariff';
import { WhiteboardState } from '../whiteboard';

export interface RecordingState {
  state: 'recording';
  recordingId?: string;
}

export interface JoinSuccessInternalState {
  participantId: ParticipantId;
  role: Role;
  avatarUrl?: string;
  chat: {
    enabled: boolean;
    roomHistory: ChatMessage[];
    lastSeenTimestampGlobal?: string;
    lastSeenTimestampsGroup?: Record<string, string>;
    lastSeenTimestampsPrivate?: Record<string, string>;
  };
  groups: GroupId[];
  automod?: InitialAutomod;
  breakout?: InitialBreakout;
  polls?: InitialPoll;
  participants: Participant[];
  moderation?: {
    raiseHandsEnabled: boolean;
    waitingRoomEnabled: boolean;
    waitingRoomParticipants: Array<BackendParticipant>;
  };
  isPresenter?: boolean;
  recording?: null | RecordingState;
  serverTimeOffset: number;
  tariff: Tariff;
  timer?: TimerState;
  sharedFolder: SharedFolderData;
  eventInfo?: EventInfo;
  participantsReady: ParticipantId[],
}

export interface JoinSuccessIncoming {
  message: 'join_success';
  id: ParticipantId;
  role: Role;
  avatarUrl?: string;
  participants: Array<BackendParticipant>;
  chat: InitialChat;
  automod?: InitialAutomod;
  breakout?: InitialBreakout;
  polls: InitialPoll;
  whiteboard?: WhiteboardState;
  moderation?: {
    raiseHandsEnabled: boolean;
    waitingRoomParticipants: Array<BackendParticipant>;
    waitingRoomEnabled: boolean;
  };
  media?: ParticipantMediaState;
  recording: null | RecordingState;
  timer?: TimerState;
  tariff: Tariff;
  closesAt: Timestamp;
  sharedFolder: SharedFolderData;
  eventInfo?: EventInfo;
}
