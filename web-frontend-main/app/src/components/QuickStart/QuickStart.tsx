// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Stack, Chip as MuiChip, IconButton } from '@mui/material';
import { t } from 'i18next';
import { useState, useEffect } from 'react';

import QuickStartPopper from './fragments/QuickStartPopper';

const RoomVariantContainer = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.video,
  justifyContent: 'center',
  alignItems: 'center',
}));

const RoomVariantButton = styled(IconButton)(() => ({
  fontSize: '1rem',
}));

const LobbyVariantChip = styled(MuiChip)(({ theme }) => ({
  zIndex: 1,
  width: '1.5rem',
  height: '1.5rem',
  marginTop: theme.spacing(1),
  marginRight: theme.spacing(1),
  borderColor: theme.palette.text.secondary,
  '& .MuiChip-label': {
    paddingRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  '&&:hover': {
    background: theme.palette.secondary.lightest,
    '& .MuiChip-label': {
      color: theme.palette.text.primary,
    },
  },
  '&&:focus': {
    background: theme.palette.secondary.light,
    '& .MuiChip-label': {
      color: theme.palette.text.secondary,
    },
  },
}));

export const OPEN_QUICK_START_LABEL = '?';
export const CLOSE_QUICK_START_LABEL = 'X';

type QuickStartVariant = 'lobby' | 'room';

interface QuickStartProps {
  variant: QuickStartVariant;
}

const QuickStart = (props: QuickStartProps) => {
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [label, setLabel] = useState(OPEN_QUICK_START_LABEL);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { variant } = props;

  // We want to close quick start always on pressing Escape key
  // even if the quick start button has lost the focus
  useEffect(() => {
    showQuickStart
      ? window.addEventListener('keydown', (event) => escapeKeyListener(event))
      : window.removeEventListener('keydown', escapeKeyListener);
    return window.removeEventListener('keydown', escapeKeyListener);
  }, [showQuickStart]);
  const escapeKeyListener = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeQuickStart();
    }
  };

  const openQuickStart = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setLabel(CLOSE_QUICK_START_LABEL);
    setShowQuickStart(true);
  };

  const closeQuickStart = () => {
    setLabel(OPEN_QUICK_START_LABEL);
    setShowQuickStart(false);
  };

  const handleKeys = (event: React.KeyboardEvent<HTMLDivElement | HTMLButtonElement>, variant: QuickStartVariant) => {
    // By default MUI Chip will loose focus on Escape key
    // Therefore we disable this behaviour and just close the popper
    if (event.key === 'Escape') {
      event.stopPropagation();
      closeQuickStart();
    }

    // We prevent reacting to Space key in the room, as we use Space key ONLY for the press to talk feature
    if (variant === 'room' && event.key === ' ') {
      event.preventDefault();
    }
  };

  switch (variant) {
    case 'room':
      return (
        <RoomVariantContainer>
          <RoomVariantButton
            onClick={showQuickStart ? closeQuickStart : openQuickStart}
            onKeyUpCapture={(event) => handleKeys(event, variant)}
            aria-label={showQuickStart ? t('conference-quick-start-close') : t('conference-quick-start-open')}
          >
            {label}
          </RoomVariantButton>
          {showQuickStart && <QuickStartPopper open={showQuickStart} anchorEl={anchorEl} />}
        </RoomVariantContainer>
      );

    case 'lobby':
      return (
        <>
          <LobbyVariantChip
            label={label}
            variant="outlined"
            onClick={showQuickStart ? closeQuickStart : openQuickStart}
            onKeyUpCapture={(event) => handleKeys(event, variant)}
            aria-label={showQuickStart ? t('conference-quick-start-close') : t('conference-quick-start-open')}
          />
          {showQuickStart && <QuickStartPopper open={showQuickStart} anchorEl={anchorEl} />}
        </>
      );

    default:
      return null;
  }
};

export default QuickStart;
