// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { rest } from 'msw';
import { v5 as uuidv5 } from 'uuid';

import { CallIn } from '../../types';

type User = {
  id: string;
  display_name: string;
  email: string;
  title: string;
  firstname: string;
  lastname: string;
};

type Event = {
  id: string;
  title: string;
  description: string;
  created_by: User;
  created_at: string;
  updated_by: User;
  updated_at: string;
  room: {
    id: string;
    password?: string;
    call_in?: CallIn;
  };
  is_time_independent: boolean;
  invitees_truncated: boolean;
  invitees: Array<{ profile: User; status: string }>;
  invite_status: string;
  is_all_day?: boolean;
  status: string;
  type: string;
  starts_at?: {
    datetime: string;
    timezone: string;
  };
  ends_at?: {
    datetime: string;
    timezone: string;
  };
  recurrence_pattern?: string;
  recurring_event_id?: string;
  instance_id?: string;
  original_starts_at?: {
    datetime: string;
    timezone: string;
  };
  isAdhoc?: boolean;
};

const USER_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

export const generateMockUserId = (id: number) => {
  return uuidv5(id.toString(), USER_NAMESPACE);
};

export const generateMockUser = (id: number): User => ({
  id: generateMockUserId(id),
  display_name: `I am number ${id}`,
  email: `user-${id}@example.com`,
  title: id % 2 === 0 ? '0' : '1',
  firstname: `Firstname ${id}`,
  lastname: `Lastname ${id}`,
});

const EVENT_NAMESPACE = 'f38574e2-5732-437b-a71c-83df1a2fea61';
export const generateMockEventId = (id: number) => {
  return uuidv5(id.toString(), EVENT_NAMESPACE);
};

export const generateMockEvent = (
  id: number,
  type: 'untimed' | 'single' | 'recurring' | 'exception',
  overwrites?: Partial<Event>
): Event => ({
  id: generateMockEventId(id),
  title: 'string',
  description: 'string',
  room: {
    id: 'string',
    password: 'string',
    call_in: {
      id: 'string',
      password: 'string',
      tel: 'string',
    },
  },
  invitees_truncated: true,
  invitees: [
    {
      profile: generateMockUser(2),
      status: 'accepted',
    },
  ],
  invite_status: 'pending',
  created_by: generateMockUser(1),
  created_at: '2019-08-24T14:15:22Z',
  updated_by: generateMockUser(1),
  updated_at: '2019-08-24T14:15:22Z',
  is_time_independent: type === 'untimed',
  type: type === 'untimed' ? 'single' : type,
  status: 'ok',
  ...overwrites,
});
export const generateMockException = (id: number, when: number, overwrites?: Partial<Event>): Event => {
  return generateMockEvent(id, 'exception', { original_starts_at: generateTimeWithTZ(when), ...overwrites });
};

export const generateTimeWithTZ = (when: number, where = 'Europe/Berlin') => ({
  datetime: new Date(86400000 + when * 1000).toISOString(),
  timezone: where,
});

const events: Array<Event> = [
  generateMockEvent(1, 'untimed'),
  generateMockEvent(1, 'recurring', {
    is_all_day: true,
    recurrence_pattern: 'FREQ=DAILY;INTERVAL=1',
    starts_at: generateTimeWithTZ(2),
    ends_at: generateTimeWithTZ(3),
  }),
  generateMockException(1, 2, {
    starts_at: generateTimeWithTZ(3),
    ends_at: generateTimeWithTZ(4),
  }),
  generateMockEvent(1, 'single', {
    starts_at: generateTimeWithTZ(10),
    ends_at: generateTimeWithTZ(14),
  }),
];

export const eventHandlers = [
  // Handles a POST /events request

  rest.post<Event, never, Event>('/v1/events', (req, res, ctx) => {
    let newEvent;
    if (typeof req.body === 'string') {
      newEvent = JSON.parse(req.body);
    }
    return res(ctx.json({ ...events[0], ...newEvent }));
  }),

  // Handles a GET /events request
  rest.get('/v1/events', (req, res, ctx) => {
    const perPage = req.url.searchParams.get('per_page') || 30;
    // Simple integer based cursor, mock implementation detail
    const after = parseInt(req.url.searchParams.get('after') as string) || 1;
    return res(
      ctx.json(events),
      ctx.set({
        Link: [`<http://localhost/v1/events?per_page=${perPage}&after=${after + 1}>; rel="after"`],
      })
    );
  }),

  // Handles a GET /v1/events/:id request
  rest.get<never, { eventId: string }, Event>('/v1/events/:eventId', (req, res, ctx) => {
    const event = events.find((x) => x.id === req.params.eventId);
    if (!event) {
      return res(ctx.status(404));
    }
    return res(ctx.json(event));
  }),

  // Handles a DELETE /v1/events/:id request
  rest.delete<never, { eventId: string }, undefined>('/v1/events/:eventId', (req, res, ctx) => {
    switch (req.params.eventId) {
      case 'NOT_FOUND':
        return res(ctx.status(404));
      case 'SUCCESS':
      default:
        return res(ctx.status(204));
    }
  }),
];

const users: Array<User> = [generateMockUser(1), generateMockUser(2), generateMockUser(3)];
export const userHandlers = [
  // Handles a GET /v1/users/me request
  rest.get<never, never, User & { theme: string; language: string }>('/v1/users/me', (req, res, ctx) => {
    return res(
      ctx.json({
        ...users[0],
        theme: 'string',
        language: 'string',
      })
    );
  }),
  // Handles a GET /v1/users/find?q= request
  // The filtering is mocked. The server impl is smarter with filtering
  rest.get<never, never, Array<User>>('/v1/users/find', (req, res, ctx) => {
    const q = req.url.searchParams.get('q')?.toLowerCase() || '';
    const filtered = users.filter((x) => {
      return (
        x.display_name.toLowerCase().includes(q) ||
        x.firstname.toLowerCase().includes(q) ||
        x.lastname.toLowerCase().includes(q)
      );
    });

    return res(ctx.json(filtered));
  }),

  // Handles a PUT users/event_favorites/${eventId}
  // marks an event as favorite for the user
  rest.put<never, { eventId: string }, undefined>('/v1/users/me/event_favorites/:eventId', (req, res, ctx) => {
    switch (req.params.eventId) {
      case 'NOT_FOUND':
        return res(ctx.status(404));
      case 'SUCCESS':
      default:
        return res(ctx.status(201));
    }
  }),

  // Handles a PUT users/event_favorites/${eventId}
  // unmark an event as favorite for the user
  rest.delete<never, { eventId: string }, undefined>('/v1/users/me/event_favorites/:eventId', (req, res, ctx) => {
    switch (req.params.eventId) {
      case 'NOT_FOUND':
        return res(ctx.status(404));
      case 'SUCCESS':
      default:
        return res(ctx.status(204));
    }
  }),
];

export const baseQueryHandlers = [
  rest.get('http://example.com/success', (_, res, ctx) => res(ctx.json({ value: 'success' }))),
  rest.post('http://example.com/success', (_, res, ctx) => res(ctx.json({ value: 'success' }))),
];
