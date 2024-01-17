// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Frequency, RRule } from '@heinlein-video/rrule';

const BI_WEEKLY_INTERVAL = 2;

/**
 * Returns the FREQ for the rrule depending on the interval
 *
 * @param {Frequency} frequency
 * @param {number} interval
 * @return {string}
 */
const getFrequency = (frequency?: string, interval?: number) => {
  let frequencyString = '';

  if (frequency === undefined) {
    return frequencyString;
  }

  frequencyString += `FREQ=${frequency}`;

  if (interval !== undefined) {
    frequencyString += `;INTERVAL=${interval}`;
  }

  return frequencyString;
};

export enum FrequencySelect {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BI-WEEKLY',
  MONTHLY = 'MONTHLY',
}

/**
 * Creates/Map the frequency select option to a rrule string
 *
 * @param {FrequencySelect} frequencySelect
 * @return {string}
 */
export const mapFrequencySelectToRRuleFrequency = (frequencySelect: FrequencySelect) => {
  switch (frequencySelect) {
    case FrequencySelect.DAILY:
      return getFrequency(Frequency[Frequency.DAILY]);
    case FrequencySelect.WEEKLY:
      return getFrequency(Frequency[Frequency.WEEKLY]);
    case FrequencySelect.MONTHLY:
      return getFrequency(Frequency[Frequency.MONTHLY]);
    case FrequencySelect.BIWEEKLY:
      return getFrequency(Frequency[Frequency.WEEKLY], BI_WEEKLY_INTERVAL);
    default:
      return '';
  }
};

/**
 * Maps a rrule string back to the specific frequency of the select option
 *
 * @param {string} value
 * @return {FrequencySelect}
 */
export const mapRRuleToFrequencySelect = (value: string) => {
  const rrule = RRule.parseString(value);

  if (rrule.interval === BI_WEEKLY_INTERVAL && rrule.freq === Frequency.WEEKLY) {
    return FrequencySelect.BIWEEKLY;
  }

  switch (rrule.freq) {
    case Frequency.DAILY:
      return FrequencySelect.DAILY;
    case Frequency.WEEKLY:
      return FrequencySelect.WEEKLY;
    case Frequency.MONTHLY:
      return FrequencySelect.MONTHLY;
    default:
      return FrequencySelect.NONE;
  }
};
