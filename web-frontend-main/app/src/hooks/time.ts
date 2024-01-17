// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { useRef } from 'react';
import { OnComplete, useElapsedTime } from 'use-elapsed-time';

export const useCountdown = ({
  isPlaying,
  initialTime,
  duration: initDuration,
  onComplete,
}: {
  isPlaying: boolean;
  duration: number;
  initialTime?: number;
  onComplete?: (totalElapsedTime: number) => OnComplete | void;
}) => {
  const { duration, startAt } = useRef({
    duration: initDuration,
    startAt: initialTime ? (Date.now() - initialTime > -(initDuration * 1000) ? Date.now() - initialTime : 0) : 0,
  }).current;

  const { elapsedTime } = useElapsedTime({
    isPlaying,
    duration,
    startAt: startAt / 1000,
    updateInterval: 1,
    onComplete: onComplete,
  });

  return {
    remainingTime: Math.ceil(duration - elapsedTime),
    elapsedTime,
  };
};
export default useCountdown;
