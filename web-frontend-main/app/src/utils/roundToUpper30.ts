// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

export default function roundToUpper30(date = new Date()) {
  // Extract number of current minutes.
  const currentMinutes = date.getUTCMinutes();
  // Extract number of current hours.
  const currentHours = date.getUTCHours();
  // Let's determine whether we are dealing with the number under 30 or above.
  const isUnder30 = currentMinutes < 30;

  const outputDate = new Date(date);

  outputDate.setUTCMilliseconds(0);
  outputDate.setUTCSeconds(0);
  outputDate.setUTCMinutes(isUnder30 ? 30 : 0);
  outputDate.setUTCHours(isUnder30 ? currentHours : currentHours + 1);

  return outputDate;
}
