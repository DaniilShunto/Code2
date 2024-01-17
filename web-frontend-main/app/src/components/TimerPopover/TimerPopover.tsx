// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { TimerStyle } from '@opentalk/common';

import { useAppSelector } from '../../hooks';
import { selectTimerStyle } from '../../store/slices/timerSlice';
import CoffeeBreakPopover from './fragments/CoffeeBreakPopover';
import NormalTimerPopover from './fragments/NormalTimerPopover';

const TimerPopover = ({ anchorEl }: { anchorEl: HTMLElement | null }) => {
  const timerStyle = useAppSelector(selectTimerStyle);

  if (!timerStyle) {
    return null;
  }

  return timerStyle === TimerStyle.CoffeeBreak ? (
    <CoffeeBreakPopover anchorEl={anchorEl} />
  ) : (
    <NormalTimerPopover anchorEl={anchorEl} />
  );
};

export default TimerPopover;
