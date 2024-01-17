// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

const DEFAULT_MINUTES_DIFFERENCE = 30;
const GAP = 5;

export default function roundToNearest30(date = new Date()) {
  const ms = 1000 * 60 * DEFAULT_MINUTES_DIFFERENCE;
  let roundedDate = new Date(Math.ceil(date.getTime() / ms) * ms);
  if (roundedDate.getMinutes() - date.getMinutes() <= GAP) {
    date.setMinutes(date.getMinutes() + (GAP + 1));
    roundedDate = new Date(Math.ceil(date.getTime() / ms) * ms);
  }
  return roundedDate;
}
