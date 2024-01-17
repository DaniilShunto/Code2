// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, styled, Typography, BoxProps } from '@mui/material';
import { MicOffIcon } from '@opentalk/common';
import React from 'react';
import { useTranslation } from 'react-i18next';

const NameBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'nowrap',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: '80%',
  padding: theme.spacing(0.5, 1),
  background: theme.palette.background.secondaryOverlay,
  color: theme.palette.primary.contrastText,
  borderRadius: +theme.borderRadius.small * 2,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  '&.positionBottom': {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 'fit-content',
  },
}));

const MicBox = styled(Box)(({ theme }) => ({
  paddingRight: theme.spacing(0.5),
  '& svg': {
    fontSize: 'inherit',
  },
}));

const StyledMicOffIcon = styled(MicOffIcon)(({ theme }) => ({
  '& rect': {
    fill: theme.palette.primary.contrastText,
  },
}));

interface NameTileProps extends BoxProps {
  audioOn: boolean;
  displayName: string;
}

const NameTile = ({ audioOn, displayName, ...props }: NameTileProps) => {
  const { t } = useTranslation();
  return (
    <NameBox data-testid="nameTile" {...props}>
      {!audioOn && (
        <MicBox
          display={'flex'}
          aria-label={t('indicator-has-audio-off', {
            participantName: displayName,
          })}
        >
          <StyledMicOffIcon data-testid="micOff" />
        </MicBox>
      )}
      <Typography variant={'body2'} noWrap py={0} translate="no">
        {displayName}
      </Typography>
    </NameBox>
  );
};

export default React.memo(NameTile);
