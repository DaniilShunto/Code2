// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { formatDuration, intervalToDuration } from 'date-fns';

export const getISOStringWithoutMilliseconds = (date: Date) => date.toISOString().split('.')[0] + 'Z';

export const getIntervalToDurationString = (interval: Interval) => {
  const duration = intervalToDuration(interval);

  const zeroPad = (number: number) => String(number).padStart(2, '0');

  return formatDuration(duration, {
    format: [duration.hours ? 'hours' : '', 'minutes', 'seconds'],
    zero: true,
    delimiter: ' : ',
    locale: {
      formatDistance: (_token, count) => zeroPad(count),
    },
  });
};

export const getRemainingTimeForInterval = (interval: Interval) => ({
  duration: intervalToDuration(interval),
  durationString: getIntervalToDurationString(interval),
});

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
