// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

export const eventMockedData = {
  id: '123',
  createdAt: '2022-04-06T13:57:38.793602Z',
  inviteStatus: 'accepted',
  isTimeIndependent: true,
  isFavorite: true,
  createdBy: {
    displayName: 'Test User',
    email: 'test@heinlein-video.de',
    firstname: 'FirstTest',
    id: '3645d74d-9a4b-4cd4-9d9f-f1871c970167',
    lastname: 'LastTest',
    title: '',
  },
  title: 'Here is a very long test title for the event',
  description: 'Here is a description for the event',
  room: {
    id: '1111',
  },
  type: 'single',
  status: 'ok',
  updatedBy: {
    displayName: 'Test User',
    email: 'test@heinlein-video.de',
    firstname: 'FirstTest',
    id: '3645d74d-9a4b-4cd4-9d9f-f1871c970167',
    lastname: 'LastTest',
    title: '',
  },
  updatedAt: '2022-04-06T13:57:38.793602Z',
};

export const pagintedMockData = {
  data: [{ ...eventMockedData }],
};
