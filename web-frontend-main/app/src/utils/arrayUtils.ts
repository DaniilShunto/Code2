// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

export const spliceIntoChunks = <T>(array: Array<T>, splitSize: number): Array<T[]> => {
  const chunkedArray: Array<T[]> = [];
  const chunkSize = Math.floor(array.length / splitSize);
  while (array.length > 0) {
    const chunk = array.length - chunkSize >= chunkSize ? array.splice(0, chunkSize) : array.splice(0);
    chunkedArray.push(chunk);
  }
  return chunkedArray;
};
