// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Stack, Typography, styled } from '@mui/material';
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { useAppSelector } from '../../../hooks';
import { selectJoinedFirstTimestamp } from '../../../store/selectors';
import { getIntervalToDurationString } from '../../../utils/timeUtils';

const Container = styled(Stack)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  //For mobile MeetingTimer is used on it is own so the background color and rounding is handled here.
  [theme.breakpoints.down('sm')]: {
    background: theme.palette.background.video,
    borderRadius: '0.25rem',
    '& .MuiTypography-root': {
      textAlign: 'center',
    },
  },
}));

const MeetingTimer = () => {
  const [meetingTime, setMeetingTime] = useState<string>('00 : 00');
  const meetingStartPoint = useAppSelector(selectJoinedFirstTimestamp);
  const startTime = useMemo(() => (meetingStartPoint ? new Date(meetingStartPoint) : new Date()), [meetingStartPoint]);

  const getDuration = useCallback(() => {
    setMeetingTime(
      getIntervalToDurationString({
        start: startTime,
        end: new Date(),
      })
    );
  }, [startTime]);

  useEffect(() => {
    const interval = setInterval(() => getDuration(), 1000);
    return () => clearInterval(interval);
  }, [getDuration, meetingTime]);

  return (
    <Container>
      <Typography variant={'body2'} minWidth="4em">
        {meetingTime}
      </Typography>
    </Container>
  );
};

export default MeetingTimer;
