// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ChatMessage } from '@opentalk/common';
import { User } from '@opentalk/rest-api-rtk-query';
import { RegisteredUser } from '@opentalk/rest-api-rtk-query';

import { RoomEvent } from '../store/slices/eventSlice';

export const isEventMessage = (message: ChatMessage | RoomEvent): message is RoomEvent => {
  return (message as RoomEvent).event !== undefined;
};

export const isInvalidDate = (date: Date) => {
  return date instanceof Date && isNaN(date as unknown as number);
};

export const isRegisteredUser = (user: User): user is RegisteredUser => {
  return (user as RegisteredUser).id !== undefined;
};
