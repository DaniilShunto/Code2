// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
// import { avatarColorTable } from '../assets/themes/opentalk/palette';
import { useTheme } from '@mui/material';

// derived from https://de.wikipedia.org/wiki/Fletcher%E2%80%99s_Checksum
const fletcher = (str: string): number => {
  let h = 0;
  let sum1 = 0;
  let sum2 = 0;
  for (let i = 0; i < str.length; i++) {
    h = str.charCodeAt(i);
    sum1 = (sum1 + h) % 0xf;
    sum2 = (sum2 + sum1) % 0xf;
  }
  const csum = (sum2 << 4) | sum1;

  const f0 = csum & 0xf;
  const f1 = (csum >> 4) & 0xf;
  const c0 = 0xf - ((f0 + f1) % 0xf);
  const c1 = 0xf - ((f0 + c0) % 0xf);

  return c1;
};

export const convertStringToColorHex = (str: string) => {
  const theme = useTheme();
  const hash = fletcher(str);
  const avatarColorTable = theme.palette.avatar.colorTable;
  return avatarColorTable[hash];
};
