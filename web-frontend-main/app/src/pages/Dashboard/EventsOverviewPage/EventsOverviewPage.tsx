// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { IconButton, Skeleton, Stack, styled, Typography } from '@mui/material';
import { ArrowDownIcon, formatDate, Toggle, ToggleOptions } from '@opentalk/common';
import {
  CursorPaginated,
  DateTime,
  Event,
  EventException,
  InviteStatus,
  isTimelessEvent,
} from '@opentalk/rest-api-rtk-query';
import { endOfISOWeek, formatRFC3339, getWeek, startOfISOWeek } from 'date-fns';
import i18n, { t } from 'i18next';
import { groupBy } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetEventsQuery } from '../../../api/rest';
import { useHeader } from '../../../templates/DashboardTemplate';
import { appendRecurrenceEventInstances, SortDirection, orderEventsByDate } from '../../../utils/eventUtils';
import EventsOverview from './fragments/EventsOverview';
import EventsPageHeader, { TimeFilter } from './fragments/EventsPageHeader';

export interface MeetingsProp {
  title: string;
  events: Array<Event | EventException>;
}
interface MeetingsPageProps {
  header?: React.ReactNode;
}

export interface DashboardEventsFilters {
  timePeriod: TimeFilter;
  timeMin?: DateTime;
  timeMax?: DateTime;
  openInvitedMeeting?: boolean;
  favoriteMeetings?: boolean;
}

const ArrowDownButton = styled(IconButton, { shouldForwardProp: (prop) => prop !== 'active' })<{
  active?: boolean;
}>(({ active }) => ({
  background: 'transparent',
  svg: {
    width: 40,
    height: 24,
    transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    transform: active ? 'rotate(180deg)' : 'none',
  },
  '&:hover': {
    background: 'transparent',
  },
}));

export const filterByTimePeriod = (timePeriod: DashboardEventsFilters['timePeriod'], date: DateTime) => {
  const createDate = new Date(date);

  switch (timePeriod) {
    case TimeFilter.Month:
      return new Intl.DateTimeFormat(i18n.language, { month: 'long', year: 'numeric' }).format(createDate);
    case TimeFilter.Day:
      return new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }).format(
        createDate
      );
    case TimeFilter.Week:
    default: {
      //Gets the week number with weeks starting on a Monday (1) as ISO standard, since every first week contains a Thursday (4)
      const weekNumber = getWeek(createDate, { weekStartsOn: 1, firstWeekContainsDate: 4 });

      const startDate = formatDate(startOfISOWeek(createDate)).getDateString();
      const endDate = formatDate(endOfISOWeek(createDate)).getDateString();

      return `${t('global-calendar-week')}: ${weekNumber} (${startDate} - ${endDate})`;
    }
  }
};

export enum TimePerspectiveFilter {
  TimeIndependent = 'timeindependent',
  Future = 'future',
  Past = 'past',
}

const EVENTS_PER_REQUEST = 100;

const EventsOverviewPage = ({ header }: MeetingsPageProps) => {
  const [expandAccordion, setExpandAccordion] = useState<string>('');
  const [filter, setFilter] = useState<DashboardEventsFilters>({
    timePeriod: TimeFilter.Month,
    timeMin: new Date().toTimeString() as DateTime,
    openInvitedMeeting: false,
    favoriteMeetings: false,
  });

  const [timePeriodFilter, setTimePeriodFilter] = useState<TimePerspectiveFilter>(
    TimePerspectiveFilter.TimeIndependent
  );

  const { t } = useTranslation();
  const toggleOptions: Array<ToggleOptions<TimePerspectiveFilter>> = [
    {
      value: TimePerspectiveFilter.TimeIndependent,
      label: t('dashboard-meeting-details-page-time-independent'),
    },
    {
      value: TimePerspectiveFilter.Future,
      label: t('dashboard-meeting-details-page-future'),
    },
    {
      value: TimePerspectiveFilter.Past,
      label: t('dashboard-meeting-details-page-past'),
    },
  ];

  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader(
      <EventsPageHeader
        filter={filter}
        onFilterChange={(key, value) =>
          setFilter((prevFilters) => ({ ...prevFilters, [key]: value ? value : !prevFilters[key] }))
        }
      />
    );
    return () => {
      setHeader(undefined);
    };
  }, [header, setHeader, filter]);

  const formatEventsByHeaderChange = useCallback(
    (events: Array<Event>) => {
      if (filter.favoriteMeetings) {
        return events.filter((event) => event.isFavorite);
      }
      if (filter.openInvitedMeeting) {
        return events.filter((event) => event.inviteStatus !== InviteStatus.Accepted);
      }
      return events;
    },
    [filter.favoriteMeetings, filter.openInvitedMeeting]
  );

  const timeMinFilter = useMemo(() => {
    if (timePeriodFilter === TimePerspectiveFilter.Future) {
      // setSecond to 0 to optimize the request and not ask data on every second when switching timePeriodFilter
      return formatRFC3339(new Date().setSeconds(0, 0)) as DateTime;
    }
  }, [timePeriodFilter]);

  const timeMaxFilter = useMemo(() => {
    if (timePeriodFilter === TimePerspectiveFilter.Past) {
      // setSecond to 0 to optimize the request and not ask data on every second when switching timePeriodFilter
      return formatRFC3339(new Date().setSeconds(0, 0)) as DateTime;
    }
  }, [timePeriodFilter]);

  /**
   * Returns memorized function to optimize the performance (acts like memorized selector)
   **/
  const selectAndTransformToMeetingProps = (
    data: CursorPaginated<Event | EventException> | undefined,
    timePerspectiveFilter: TimePerspectiveFilter
  ) =>
    useMemo(() => {
      if (!data) {
        return [];
      }
      const eventsWithEventInstances = appendRecurrenceEventInstances(
        data.data,
        true,
        undefined,
        timePerspectiveFilter
      );

      const orderedEventsWithRecurrenceInstances = orderEventsByDate(
        formatEventsByHeaderChange(eventsWithEventInstances),
        timePerspectiveFilter === TimePerspectiveFilter.Future ? SortDirection.ASC : SortDirection.DESC
      );

      if (timePerspectiveFilter === TimePerspectiveFilter.TimeIndependent) {
        const constructMeetingProp = {
          title: t('dashboard-meeting-details-page-time-independent'),
          events: orderedEventsWithRecurrenceInstances,
        };
        setExpandAccordion('all');
        return [constructMeetingProp];
      }
      const eventsGroupedByTimeFilter = groupBy(orderedEventsWithRecurrenceInstances, (event) =>
        filterByTimePeriod(
          filter.timePeriod,
          isTimelessEvent(event) ? event.createdAt : (event.startsAt?.datetime as DateTime)
        )
      );
      const eventsTransformedAsMeetingProp = Object.entries(eventsGroupedByTimeFilter).map(([title, events]) => ({
        title,
        events,
      }));
      if (eventsTransformedAsMeetingProp.length > 0) {
        setExpandAccordion(eventsTransformedAsMeetingProp[0].title);
      }
      return [...eventsTransformedAsMeetingProp];
    }, [timePerspectiveFilter, filter, data]);

  const { events, isLoading, isFetching } = useGetEventsQuery(
    {
      favorites: filter.favoriteMeetings,
      perPage: EVENTS_PER_REQUEST,
      adhoc: false,
      timeIndependent: timePeriodFilter === TimePerspectiveFilter.TimeIndependent,
      timeMin: timeMinFilter,
      timeMax: timeMaxFilter,
    },
    {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        events: selectAndTransformToMeetingProps(data, timePeriodFilter),
        isLoading,
        isFetching,
      }),
    }
  );

  if (isLoading) {
    return (
      <Stack spacing={3}>
        <Skeleton variant="text" width={'20%'} height={40} />
        <Skeleton variant="rectangular" height={50} />
        <Skeleton variant="rectangular" height={50} />
        <Skeleton variant="rectangular" height={50} />
      </Stack>
    );
  }
  return (
    <Stack spacing={3} height={'100%'}>
      <Stack direction={'row'} flex={'0 1 auto'} spacing={3} justifyContent={'space-between'} alignItems="flex-end">
        <Typography variant={'h1'} component={'h2'}>
          {t('dashboard-events-my-meetings')}
        </Typography>
        <Toggle options={toggleOptions} onChange={setTimePeriodFilter} />
        <ArrowDownButton
          active={expandAccordion === 'all'}
          onClick={() => setExpandAccordion((prev) => (prev === 'all' ? '' : 'all'))}
        >
          <ArrowDownIcon color="secondary" />
        </ArrowDownButton>
      </Stack>

      {isFetching ? (
        <Stack spacing={3}>
          <Skeleton variant="rectangular" height={50} />
          <Skeleton variant="rectangular" height={50} />
          <Skeleton variant="rectangular" height={50} />
        </Stack>
      ) : (
        <EventsOverview entries={events || []} expandAccordion={expandAccordion} />
      )}
    </Stack>
  );
};

export default EventsOverviewPage;
