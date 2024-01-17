// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Typography, Popover as MuiPopover, Box } from '@mui/material';
import { CoffeeBreakIcon as CoffeeBreakIconDefault } from '@opentalk/common';
import { TimerStyle } from '@opentalk/common';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectTimerActive } from '../../../store/slices/timerSlice';
import TimerDuration from '../../TimerTab/fragments/TimerDuration';

const Popover = styled(MuiPopover)(({ theme }) => ({
  pointerEvents: 'none',

  '& .MuiPaper-root': {
    padding: theme.spacing(2, 4),
    pointerEvents: 'all',
  },
}));

const Content = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
});

const CoffeeBreakIcon = styled(CoffeeBreakIconDefault)(({ theme }) => ({
  height: '4rem',
  width: 'auto',
  fill: theme.palette.secondary.light,
}));

const CoffeeBreakPopover = ({ anchorEl }: { anchorEl: HTMLElement | null }) => {
  const { t } = useTranslation();
  const timerActive = useAppSelector(selectTimerActive);

  return (
    <Popover
      anchorEl={anchorEl}
      open={Boolean(timerActive)}
      hideBackdrop
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      disableEnforceFocus
    >
      <Content>
        <Typography id="transition-modal-title" variant="h5" component="h2">
          {t('coffee-break-popover-title')}
        </Typography>

        <CoffeeBreakIcon />

        <TimerDuration alignItems="center" style={TimerStyle.CoffeeBreak} />
      </Content>
    </Popover>
  );
};

export default CoffeeBreakPopover;
