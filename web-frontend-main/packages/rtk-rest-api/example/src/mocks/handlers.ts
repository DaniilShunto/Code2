// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { rest } from 'msw';

import { Event } from '../../../dist/esm';
import { addMeeting } from '../app/eventsSlice';
import { store } from '../app/store';

export const handlers = [
  rest.get('/events', (req, res, ctx) => {
    const storedEvents = store.getState().events;
    let data: Event[] = [];
    Object.entries(storedEvents.entities).forEach((event) => {
      data.push(event[1] as Event);
    });
    console.log('data', data);
    return res(ctx.json({ data }));
  }),

  rest.post('/events', (req, res, ctx) => {
    store.dispatch(addMeeting(req.body));
    return res(ctx.json({ message: 'success' }));
  }),
];
