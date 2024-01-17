// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Typography } from '@mui/material';
import { useDateFormat } from '@opentalk/common';
import { isSameDay } from 'date-fns';

interface EventTimePreviewProps {
  startDate: Date;
  endDate: Date;
}

const EventTimePreview = (props: EventTimePreviewProps) => {
  const { startDate, endDate } = props;
  const formattedStartDate = useDateFormat(startDate, 'date');
  const formattedStartTime = useDateFormat(startDate, 'time');
  const formattedEndTime = useDateFormat(endDate, 'time');

  const isInTheSameDay = isSameDay(startDate, endDate);

  return (
    <Typography variant={'body1'} fontWeight={400}>
      {isInTheSameDay ? formattedStartDate : null} {formattedStartTime}
      {' - '}
      {formattedEndTime}
    </Typography>
  );
};

export default EventTimePreview;
