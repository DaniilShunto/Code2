// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Popover } from '@mui/material';
import { ConnectionGoodIcon, ConnectionMediumIcon } from '@opentalk/common';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { MediaDescriptor } from '../../../modules/WebRTC';
import { selectStatsPacketLossByDescriptor } from '../../../store/slices/connectionStatsSlice';
import { selectIsSubscriberOnlineByDescriptor } from '../../../store/slices/mediaSubscriberSlice';
import { StatisticsContent } from './StatisticsContent';
import { OverlayIconButton } from './VideoOverlay';

const Statistics = ({
  descriptor,
  disablePopoverPortal,
}: {
  descriptor: MediaDescriptor;
  disablePopoverPortal?: boolean | undefined;
}) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const isOnline = useAppSelector(selectIsSubscriberOnlineByDescriptor(descriptor));
  const hasPaketLoss = useAppSelector(selectStatsPacketLossByDescriptor(descriptor));

  const handleClose = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  }, []);

  const toggleStats = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }, []);

  if (!isOnline) {
    return null;
  }

  return (
    <>
      <OverlayIconButton onClick={toggleStats} size="large" color="secondary" aria-label={t('statistics-video')}>
        {hasPaketLoss ? <ConnectionMediumIcon color="error" /> : <ConnectionGoodIcon />}
      </OverlayIconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        disablePortal={disablePopoverPortal}
        keepMounted={false}
      >
        <StatisticsContent descriptor={descriptor} />
      </Popover>
    </>
  );
};

export default Statistics;
