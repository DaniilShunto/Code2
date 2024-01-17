// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { GroupId, ParticipantId, TargetId, Timestamp } from './common';

export enum ChatScope {
  Global = 'global',
  Private = 'private',
  Group = 'group',
}

export type ChatMessage = {
  id: string;
  timestamp: string;
  source: ParticipantId;
  content: string;
  scope: ChatScope;
  group?: GroupId;
  target?: TargetId;
};

export interface ChatMessageBase {
  id: string;
  source: ParticipantId;
  content: string;
}

export interface BaseMessageWithTimestamp extends ChatMessageBase {
  timestamp: Timestamp;
}

export interface ChatBase extends ChatMessageBase {
  scope: ChatScope;
  target?: TargetId;
}

export type ChatMessageWithTimestamp = ChatBase & BaseMessageWithTimestamp;

export type InitialChatHistory = [{ history: Array<BaseMessageWithTimestamp>; name: GroupId }];

export interface InitialChat {
  enabled: boolean;
  lastSeenTimestampGlobal?: string;
  lastSeenTimestampsGroup?: Record<string, string>;
  lastSeenTimestampsPrivate?: Record<string, string>;
  roomHistory: Array<ChatMessageWithTimestamp>;
  groups: Array<GroupId>;
  groupsHistory: InitialChatHistory;
}
