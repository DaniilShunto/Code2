// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { LegalVoteMessage, AutomodEvent } from '@opentalk/components';

import BreakoutMessage from './breakout';
import ChatMessage from './chat';
import ControlMessage from './control';
import MediaMessage from './media';
import ModerationMessage from './moderation';
import PollMessage from './poll';
import ProtocolMessage from './protocol';
import RecordingMessage from './recording';
import SharedFolderMessage from './sharedFolder';
import TimerMessage from './timer';
import WhiteboardMessage from './whiteboard';

export * as breakout from './breakout';
export * as control from './control';
export * as chat from './chat';
export * as moderation from './moderation';
export * as poll from './poll';
export * as protocol from './protocol';
export * as timer from './timer';
export * as whiteboard from './whiteboard';
export * as media from './media';
export * as recording from './recording';
export * as sharedFolder from './sharedFolder';

export type Message =
  | AutomodEvent
  | BreakoutMessage
  | ChatMessage
  | ControlMessage
  | LegalVoteMessage
  | MediaMessage
  | PollMessage
  | ModerationMessage
  | ProtocolMessage
  | TimerMessage
  | WhiteboardMessage
  | RecordingMessage
  | SharedFolderMessage;
