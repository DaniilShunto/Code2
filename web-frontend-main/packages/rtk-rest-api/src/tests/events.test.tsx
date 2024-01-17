// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { setupServer } from 'msw/node';

import { createOpenTalkApiWithReactHooks } from '../endpoints';
import fetchQuery from '../fetchQuery';
import { EventId } from '../types';
import { camelcaseKeysDeep } from '../types/utils';
import { setupApiStore } from './helpers';
import { eventHandlers, generateMockEvent, userHandlers } from './mocks/server';

// This configures a request mocking server with the given request handlers.
const server = setupServer(...eventHandlers, ...userHandlers);
const api = createOpenTalkApiWithReactHooks(fetchQuery({ baseUrl: 'v1/' }));
const storeRef = setupApiStore(api);
const { useGetEventsQuery, useDeleteEventMutation } = api;

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

describe('Event Endpoints', () => {
  describe('GET', () => {
    test('should return multiple events', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useGetEventsQuery({}), {
        wrapper: storeRef.wrapper,
      });
      await waitForNextUpdate();
      const { data: event } = result.current;
      expect(event?.data).toContainEqual(camelcaseKeysDeep(generateMockEvent(1, 'untimed')));
    });

    test('should be paginated', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useGetEventsQuery({}), {
        wrapper: storeRef.wrapper,
      });
      await waitForNextUpdate();
      const { data: events } = result.current;
      expect(events?.after).toBeDefined();
    });

    test('should accept after cursor', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useGetEventsQuery({ after: '1' }), {
        wrapper: storeRef.wrapper,
      });

      await waitForNextUpdate();
      const { data: events } = result.current;
      expect(events?.after).toBeDefined();
    });
  });

  describe('DELETE', () => {
    test('success useDeleteEventMutation', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useDeleteEventMutation(), {
        wrapper: storeRef.wrapper,
      });
      const [deleteEvent] = result.current;

      act(() => {
        deleteEvent('SUCCESS' as EventId);
      });

      await waitForNextUpdate();
      const [, data] = result.current;

      expect(data.isSuccess).toBeTruthy();
      expect(data.isError).toBeFalsy();
      expect(data.endpointName).toEqual('deleteEvent');
    });

    test('failing useDeleteEventMutation', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useDeleteEventMutation(), {
        wrapper: storeRef.wrapper,
      });
      const [deleteEvent] = result.current;

      act(() => {
        deleteEvent('NOT_FOUND' as EventId);
      });

      await waitForNextUpdate();
      const [, data] = result.current;

      expect(data.isSuccess).toBeFalsy();
      expect(data.isError).toBeTruthy();
      expect(data.endpointName).toEqual('deleteEvent');
      expect(data.error).toEqual({ status: 404, data: null });
    });
  });
});
