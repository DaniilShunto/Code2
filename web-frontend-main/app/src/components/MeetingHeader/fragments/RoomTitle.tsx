// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Typography, styled, Tooltip, Stack } from '@mui/material';
import { truncate } from 'lodash';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectCurrentBreakoutRoom } from '../../../store/slices/breakoutSlice';
import { selectEventInfo } from '../../../store/slices/roomSlice';

export const ROOM_TITLE_MAX_LENGTH = 25;

//Container is needed in order to limit text from overflowing
const Container = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.video,
  borderRadius: '0.25rem',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}));

const RoomTitleTypograhy = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(0, 1),
  fontSize: theme.typography.pxToRem(14),
  maxWidth: '100%',
}));

const RoomTitle = () => {
  const { t } = useTranslation();
  const currentBreakoutRoom = useAppSelector(selectCurrentBreakoutRoom);
  const eventInfo = useAppSelector(selectEventInfo);

  const title = useMemo(() => {
    if (currentBreakoutRoom) {
      return currentBreakoutRoom.name;
    }

    if (eventInfo) {
      return eventInfo.title;
    }

    return t('fallback-room-title');
  }, [currentBreakoutRoom, eventInfo]);

  const truncatedTitle = truncate(title, { length: ROOM_TITLE_MAX_LENGTH });

  return (
    <Container>
      <Tooltip translate="no" title={title} describeChild>
        <RoomTitleTypograhy noWrap translate="no">
          {truncatedTitle}
        </RoomTitleTypograhy>
      </Tooltip>
    </Container>
  );
};

export default RoomTitle;
