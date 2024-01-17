// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, styled, Tooltip, Link as MuiLink } from '@mui/material';
import { FavoriteIcon as Favorite } from '@opentalk/common';
import { RoomId } from '@opentalk/rest-api-rtk-query';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import getReferrerRouterState from '../../utils/getReferrerRouterState';

const FavoritesWrapper = styled(Box)(({ theme }) => ({
  background: theme.palette.secondary.main,
  borderRadius: theme.borderRadius.medium,
  position: 'relative',
  padding: theme.spacing(3.5, 0, 1, 3),
  height: '100%',
  minHeight: '5rem',
  maxHeight: '13rem',

  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2.5, 0, 1, 2),
  },
}));

const FavoritesContainer = styled('div')(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  overflow: 'auto',
  paddingRight: theme.spacing(3),
}));

const FavoriteIcon = styled(Favorite)(({ theme }) => ({
  position: 'absolute',
  top: -2,
  fill: theme.palette.secondary.contrastText,
  width: theme.typography.pxToRem(20),
  height: theme.typography.pxToRem(20),
  right: theme.spacing(3),

  [theme.breakpoints.down('md')]: {
    width: theme.typography.pxToRem(16),
    height: theme.typography.pxToRem(16),
    right: theme.spacing(2),
  },
}));

const FavoriteEntry = styled(Link)(({ theme }) => ({
  color: theme.palette.secondary.contrastText,
  textDecoration: 'none',
  paddingBottom: theme.spacing(2),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: `0 0 auto`,

  '&:not(:last-child)': {
    borderBottom: `1px solid ${theme.palette.secondary.contrastText}`,
  },
}));

const EmptyEntry = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.secondary.contrastText,
}));

// todo Define what the link should do. Currently it is undefined whether the link should lead to the room or to the meeting overview of the meeting. The naming defines if we call this roomId or meetingId
export interface FavoriteMeetingProps {
  subject: string;
  roomId: RoomId;
}

const FavoriteMeetingsCard = ({ meetings }: { meetings: Array<FavoriteMeetingProps> }) => {
  const sortedMeetings = _.sortBy(meetings, ['subject']);
  const { t } = useTranslation();

  const renderFavorites = () => {
    if (sortedMeetings.length > 0) {
      return sortedMeetings.map(({ subject, roomId }, index) => (
        <FavoriteEntry data-testid="favorite-entry" to={`/room/${roomId}`} target="_blank" key={index}>
          {subject}
        </FavoriteEntry>
      ));
    }

    return (
      <Tooltip title={t('tooltip-empty-favourites') || ''}>
        <MuiLink
          component={Link}
          sx={{ textDecoration: 'none' }}
          to={'/dashboard/meetings'}
          state={{ ...getReferrerRouterState(window.location) }}
        >
          <EmptyEntry data-testid="empty-entry">{t('no-favorite-meetings')}</EmptyEntry>
        </MuiLink>
      </Tooltip>
    );
  };

  return (
    <FavoritesWrapper>
      <FavoriteIcon />
      <FavoritesContainer>{renderFavorites()}</FavoritesContainer>
    </FavoritesWrapper>
  );
};

export default FavoriteMeetingsCard;
