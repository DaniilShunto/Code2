// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

export * from './common';
export type { UserMe, BaseUser, UpdateMePayload, User, RegisteredUser } from './user';
export { UserRole } from './user';
export type {
  Event,
  TimelessEvent,
  SingleEvent,
  RecurringEvent,
  EventException,
  EventInstance,
  EventAndInstanceId,
  EventId,
  CreateEventPayload,
  CreateEventExceptionPayload,
  UpdateEventPayload,
  TimedEvent,
} from './event';
export type {
  RoomId,
  AssetId,
  PublicRoom,
  PrivateRoom,
  UpdateRoomPayload,
  CreateRoomPayload,
  RoomAssets,
  RoomInvite,
} from './room';
export type { EventInvite, CreateEventInvitePayload } from './eventInvite';
export {
  isTimelessEvent,
  isSingleEvent,
  isRecurringEvent,
  isEventException,
  isEventInstance,
  isEvent,
  EventType,
} from './event';
