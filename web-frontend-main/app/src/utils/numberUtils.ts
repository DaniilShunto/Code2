// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

export const getRandomNumber = (max = 1) => {
  return Math.round(Math.random() * max);
};

export const formatBitRate = (bitRate?: number): string => {
  if (bitRate === undefined) return '-';

  if (bitRate > 1000000) {
    const mRate = bitRate / 1000000;
    return `${mRate.toPrecision(3)} Mbit/s`;
  } else {
    const kRate = bitRate / 1000;
    return `${kRate.toPrecision(3)} kbit/s`;
  }
};
