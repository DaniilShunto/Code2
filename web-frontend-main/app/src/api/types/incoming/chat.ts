// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { NamespacedIncoming, ParticipantId, ChatBase } from '@opentalk/common';

interface MessageSent extends ChatBase {
  message: 'message_sent';
}

interface ChatEnabled {
  message: 'chat_enabled';
  id: ParticipantId;
}

interface ChatDisabled {
  message: 'chat_disabled';
  id: ParticipantId;
}

export interface ClearGlobalChat {
  message: 'history_cleared';
}

export type ChatMessage = MessageSent | ChatEnabled | ChatDisabled | ClearGlobalChat;

export type Chat = NamespacedIncoming<ChatMessage, 'chat'>;

export default Chat;
