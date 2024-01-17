// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { RRule } from '@heinlein-video/rrule';
import {
  Event,
  EventException,
  InviteStatus,
  isEvent,
  isRecurringEvent,
  isTimelessEvent,
  RecurringEvent,
} from '@opentalk/rest-api-rtk-query';
import { addMonths, subMonths } from 'date-fns';
import { cloneDeep, orderBy } from 'lodash';

import { TimePerspectiveFilter } from '../pages/Dashboard/EventsOverviewPage/EventsOverviewPage';
import { getISOStringWithoutMilliseconds } from './timeUtils';

const DEFAULT_MONTHS_CONSIDERED = 3;

const mapDateToRecurringEvent = (recurrenceDate: Date, initialEvent: RecurringEvent) => {
  const recurringEvent = cloneDeep(initialEvent);
  const recurrenceStartDate = new Date(initialEvent.startsAt.datetime);
  const recurrenceEndDate = new Date(initialEvent.endsAt.datetime);

  const startDate = new Date(recurrenceStartDate);
  startDate.setDate(recurrenceDate.getDate());
  startDate.setMonth(recurrenceDate.getMonth());
  startDate.setUTCFullYear(recurrenceDate.getUTCFullYear());
  recurringEvent.startsAt = {
    datetime: getISOStringWithoutMilliseconds(startDate),
    timezone: initialEvent.startsAt.timezone,
  };

  const endDate = new Date(recurrenceEndDate);
  endDate.setDate(recurrenceDate.getDate());
  endDate.setMonth(recurrenceDate.getMonth());
  endDate.setUTCFullYear(recurrenceDate.getUTCFullYear());
  recurringEvent.endsAt = {
    datetime: getISOStringWithoutMilliseconds(endDate),
    timezone: initialEvent.endsAt.timezone,
  };

  return recurringEvent;
};

const createRecurrenceEventInstances = (
  event: RecurringEvent,
  maxMonths: number = DEFAULT_MONTHS_CONSIDERED,
  filter?: TimePerspectiveFilter
) => {
  const today = new Date();
  const recurrenceStartDate = new Date(event.startsAt.datetime);

  let windowStartOffset = 0;
  let windowEndOffset = maxMonths;

  if (filter === TimePerspectiveFilter.Past) {
    windowStartOffset = maxMonths;
    windowEndOffset = 0;
  }

  const windowStartDate = subMonths(today, windowStartOffset);
  const windowEndDate = addMonths(today, windowEndOffset);

  const partialRule = RRule.parseString(event.recurrencePattern[0]);

  partialRule.dtstart = recurrenceStartDate;
  partialRule.until = windowEndDate;

  const rule = new RRule({
    ...partialRule,
  });

  const generatedRecurrenceDates = rule.between(windowStartDate, windowEndDate, true);

  return generatedRecurrenceDates.map((generatedRecurrenceDate) =>
    mapDateToRecurringEvent(generatedRecurrenceDate, event)
  );
};

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export const orderEventsByDate = (events: Event[], sortDirection: SortDirection = SortDirection.ASC) =>
  orderBy(
    events,
    [
      (event: Event) => {
        if (isTimelessEvent(event)) {
          return new Date(event.createdAt);
        }
        return new Date(event.startsAt.datetime);
      },
    ],
    [sortDirection]
  );

export const appendRecurrenceEventInstances = (
  eventList: (EventException | Event)[],
  filterDeclined?: boolean,
  maxMonths?: number,
  filter?: TimePerspectiveFilter
): Event[] => {
  const events = Array<Event>();

  eventList
    .filter((event): event is Event => isEvent(event))
    .filter((event) => (filterDeclined ? event.inviteStatus !== InviteStatus.Declined : true))
    .forEach((event) => {
      if (!isTimelessEvent(event) && isRecurringEvent(event)) {
        createRecurrenceEventInstances(event, maxMonths, filter).forEach((event) => {
          events.push(event);
        });
      } else {
        events.push(event);
      }
    });
  return events;
};
