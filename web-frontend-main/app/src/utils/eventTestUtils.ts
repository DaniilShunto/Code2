// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { DateTime, Email, EventId, EventType, InviteStatus, RoomId, UserId } from '@opentalk/rest-api-rtk-query';
import { v4 as uuidv4 } from 'uuid';

export function createMockEvent(isFavorite?: boolean) {
  const eventType = EventType.Single;
  const inviteStatus = InviteStatus.Accepted;
  const userId: UserId = uuidv4() as UserId;

  return {
    id: uuidv4() as EventId,
    createdBy: {
      id: userId,
      email: 'test@heinlein-video.de' as Email,
      title: '',
      firstname: 'Mic',
      lastname: 'T',
      displayName: 'Michael Test',
      avatarUrl: 'https://seccdn.libravatar.org/avatar/fb21b2d6d65c599a7c7a55b6abadc4cd',
    },
    createdAt: '2022-04-26T13:13:11.837055Z' as DateTime,
    updatedBy: {
      id: userId,
      email: 'test@heinlein-video.de' as Email,
      title: '',
      firstname: 'Mic',
      lastname: 'T',
      displayName: 'Michael Test',
      avatarUrl: 'https://seccdn.libravatar.org/avatar/fb21b2d6d65c599a7c7a55b6abadc4cd',
    },
    updatedAt: '2022-04-26T13:13:11.837055Z' as DateTime,
    title: 'test 2',
    description: '',
    room: {
      id: uuidv4() as RoomId,
      callIn: {
        tel: '030123456789',
        id: '0740685437',
        password: '1679386192',
      },
    },
    inviteesTruncated: true,
    invitees: [],
    isTimeIndependent: false,
    isAllDay: false,
    startsAt: {
      datetime: '2022-04-26T13:08:10Z',
      timezone: 'Europe/Berlin',
    },
    endsAt: {
      datetime: '2022-04-26T13:38:10Z',
      timezone: 'Europe/Berlin',
    },
    recurrencePattern: [],
    type: eventType,
    inviteStatus: inviteStatus,
    isFavorite: isFavorite || false,
  };
}
