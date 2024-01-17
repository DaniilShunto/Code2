// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { CreateEventPayload, CursorPaginated, Event, EventException } from '@opentalk/rest-api-rtk-query';
import { CursorPaginationParams } from '@opentalk/rest-api-rtk-query/src/endpoints/common';
import { TimeRangeQueryParams, EventQueryParams } from '@opentalk/rest-api-rtk-query/src/endpoints/events';
import snakecaseKeys from 'snakecase-keys';

import { api } from '../app/api';

export const eventsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<
      CursorPaginated<Event | EventException>,
      CursorPaginationParams & TimeRangeQueryParams & EventQueryParams
    >({
      query: (params) => ({
        url: 'events',
        params,
      }),
      providesTags: (result) =>
        result ? [...result.data.map(({ id }) => ({ type: 'Events' as const, id: id }))] : ['Events'],
    }),
    createEvent: builder.mutation<Event, CreateEventPayload>({
      query: ({ ...payload }) => ({
        url: 'events',
        method: 'POST',
        body: snakecaseKeys(payload, { deep: true }),
      }),
      invalidatesTags: ['Events'],
    }),
  }),
});

export const { useGetEventsQuery, useCreateEventMutation } = eventsApi;
