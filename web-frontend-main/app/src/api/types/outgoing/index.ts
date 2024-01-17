// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { AutomodCommand, AutomodCommandType, LegalVoteAction, LegalVoteMessage } from '@opentalk/components';

import * as breakout from './breakout';
import BreakoutMessage from './breakout';
import * as chat from './chat';
import ChatMessage from './chat';
import * as control from './control';
import ControlMessage from './control';
import * as media from './media';
import MediaMessage from './media';
import * as moderation from './moderation';
import ModerationMessage from './moderation';
import * as poll from './poll';
import PollMessage from './poll';
import * as protocol from './protocol';
import ProtocolMessage from './protocol';
import * as recording from './recording';
import RecordingMessage from './recording';
import * as timer from './timer';
import TimerMessage from './timer';
import * as whiteboard from './whiteboard';
import WhiteboardMessage from './whiteboard';

export { default as automod } from './automod';
export { default as legalVote } from './legal-vote';
export * as breakout from './breakout';
export * as control from './control';
export * as moderation from './moderation';
export * as chat from './chat';
export * as poll from './poll';
export * as media from './media';
export * as protocol from './protocol';
export * as timer from './timer';
export * as whiteboard from './whiteboard';
export * as recording from './recording';

export type Action =
  | AutomodCommandType
  | breakout.Action
  | chat.Action
  | control.Action
  | moderation.Action
  | LegalVoteAction
  | media.Action
  | poll.Action
  | protocol.Action
  | timer.Action
  | whiteboard.Action
  | recording.Action;

export type Message =
  | AutomodCommand
  | BreakoutMessage
  | ChatMessage
  | ControlMessage
  | ModerationMessage
  | LegalVoteMessage
  | MediaMessage
  | PollMessage
  | ProtocolMessage
  | TimerMessage
  | WhiteboardMessage
  | RecordingMessage;
