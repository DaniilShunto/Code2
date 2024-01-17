// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import {
  CloseIcon,
  FeedbackIcon,
  IconButton,
  SnackbarKey,
  closeSnackbar,
  MINUTE_MS,
  SnackbarContent,
  CustomContentProps,
  enqueueSnackbar,
} from '@opentalk/common';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

import { sleep } from '../../utils/timeUtils';
import AnimationTimerDown from './fragments/AnimationTimerDown';

const BoxContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  minHeight: '60px',
  padding: theme.spacing(1, 0.5, 1, 2),
  borderRadius: theme.borderRadius.medium,
  background: theme.palette.error.main,
}));

const BoxInteractive = styled(Box)({
  flex: '1',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

let showFirstNotificationTimer: ReturnType<typeof setTimeout>;
let triggerFollowingNotificationTimer: ReturnType<typeof setInterval>;

// How many minutes in advance before end of conference we shall start to notify user
// E.g. MINUTES_BEFORE_END = 5 -> first notification will be shown 5 minutes
// before conference will be ended
const MINUTES_BEFORE_CONFERENCE_END = 5;
const DELAY_BETWEEN_SNACKBARS = 1000; //ms

// This function is responsible to notify user, that the conference will end up soon.
// The first notification comes several minutes in advance, which is defined by MINUTES_BEFORE_CONFERENCE_END.
// After first notification has been shown, every minute a new notification shall appear, with a
// new minute number.
// User can close a notification manually, but a new one shall appear after current minute is over.
// Last minute notification shows running seconds and cannot be closed.
export const startTimeLimitNotification = (conferenceEndTimestamp: string) => {
  let remainingNotificationMinutes: number;
  let showFirstNotificationInMs: number;
  let timeLimitSnackBarKey: SnackbarKey;

  const updateNotification = async (minutes: number) => {
    if (timeLimitSnackBarKey) {
      closeSnackbar(timeLimitSnackBarKey);
      console.debug(`Closed snackbar ${timeLimitSnackBarKey}`);

      // we must wait between closing a snackbar and opening a new one
      // race condition in the notistack? Anyway, maybe even better from the UX point of view
      await sleep(DELAY_BETWEEN_SNACKBARS);
    }

    timeLimitSnackBarKey = enqueueSnackbar('', { variant: 'timeLimit', persist: true, minutes });
  };

  const handleMinutesUpdate = () => {
    if (remainingNotificationMinutes > 0) {
      --remainingNotificationMinutes;
      updateNotification(remainingNotificationMinutes);
    } else {
      stopTimeLimitNotification();
    }
  };

  const conferenceEndDate = new Date(conferenceEndTimestamp);
  const remainingTimeOfConferenceMs = conferenceEndDate.getTime() - Date.now();
  const remainingTimeOfConferenceMinutes = Math.ceil(remainingTimeOfConferenceMs / MINUTE_MS);
  const doesNotificationTimeslotAlreadyStarted = remainingTimeOfConferenceMinutes <= MINUTES_BEFORE_CONFERENCE_END;
  if (doesNotificationTimeslotAlreadyStarted) {
    remainingNotificationMinutes = remainingTimeOfConferenceMinutes;
    updateNotification(remainingTimeOfConferenceMinutes);
    showFirstNotificationInMs =
      remainingTimeOfConferenceMs - Math.floor(remainingTimeOfConferenceMs / MINUTE_MS) * MINUTE_MS;
  } else {
    remainingNotificationMinutes = MINUTES_BEFORE_CONFERENCE_END + 1;
    showFirstNotificationInMs = remainingTimeOfConferenceMs - MINUTES_BEFORE_CONFERENCE_END * MINUTE_MS;
  }

  showFirstNotificationTimer = setTimeout(() => {
    handleMinutesUpdate();
    triggerFollowingNotificationTimer = setInterval(() => {
      handleMinutesUpdate();
    }, MINUTE_MS);
  }, showFirstNotificationInMs);
};

export const stopTimeLimitNotification = () => {
  clearTimeout(showFirstNotificationTimer);
  clearTimeout(triggerFollowingNotificationTimer);
};

interface TimeLimitNotificationProps extends CustomContentProps {
  minutes: number;
}

export const TimeLimitNotification = forwardRef<HTMLDivElement, TimeLimitNotificationProps>((props, ref) => {
  const { t } = useTranslation();
  const { id, minutes } = props;

  const handleClose = () => {
    closeSnackbar(id);
  };

  return (
    <SnackbarContent ref={ref} role="alert">
      <BoxContent>
        <Box display="flex" alignItems="center">
          <FeedbackIcon />
        </Box>
        <BoxInteractive>
          {minutes > 1 && (
            <>
              <span>{t('time-limit-more-than-one-minute-remained', { minutes })}</span>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </>
          )}
          {minutes === 1 && (
            <>
              <span>{t('time-limit-less-than-one-minute-remained')}</span>
              <AnimationTimerDown />
            </>
          )}
        </BoxInteractive>
      </BoxContent>
    </SnackbarContent>
  );
});
