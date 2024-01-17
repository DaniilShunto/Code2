// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, IconButton, Grid, styled, useMediaQuery, useTheme, Tooltip, Stack } from '@mui/material';
import { InviteIcon, FavoriteIcon, SearchIcon, AddIcon, Toggle } from '@opentalk/common';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import getReferrerRouterState from '../../../../utils/getReferrerRouterState';
import { DashboardEventsFilters } from '../EventsOverviewPage';

const IconButtonBig = styled(IconButton, { shouldForwardProp: (prop) => prop !== 'active' })<{ active?: boolean }>(
  ({ theme, active }) => ({
    color: active ? theme.palette.text.secondary : '',
    backgroundColor: active ? theme.palette.secondary.main : '',
    '.MuiSvgIcon-root': {
      fontSize: theme.typography.pxToRem(23),
    },
  })
);

export enum TimeFilter {
  Month = 'month',
  Week = 'week',
  Day = 'day',
}

interface ToggleOptionsProps {
  value: DashboardEventsFilters['timePeriod'];
  label: string;
}

interface EventsPageHeaderProps {
  filter: DashboardEventsFilters;
  onFilterChange: <K extends keyof DashboardEventsFilters>(key: K, value?: DashboardEventsFilters[K]) => void;
}

const EventsPageHeader = ({ onFilterChange, filter }: EventsPageHeaderProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const inviteButtonTooltip = t('dashboard-events-filter-by-invites');
  const favoriteButtonTooltip = t('dashboard-events-filter-by-favorites');
  const toggleOptions: ToggleOptionsProps[] = [
    {
      value: TimeFilter.Month,
      label: t('global-month'),
    },
    {
      value: TimeFilter.Week,
      label: t('global-week'),
    },
    {
      value: TimeFilter.Day,
      label: t('global-day'),
    },
  ];

  return (
    <Grid container direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
      <Grid
        item
        container
        lg={8}
        md={10}
        direction={{ xs: 'column-reverse', sm: 'row' }}
        spacing={2}
        justifyContent={'flex-end'}
      >
        <Grid item>
          <Stack spacing={2} direction={'row'}>
            <Tooltip placement="top" title={inviteButtonTooltip}>
              <IconButtonBig
                color={'secondary'}
                active={filter.openInvitedMeeting}
                size={'large'}
                onClick={() => onFilterChange('openInvitedMeeting')}
              >
                <InviteIcon />
              </IconButtonBig>
            </Tooltip>
            <Tooltip placement="top" title={favoriteButtonTooltip}>
              <IconButtonBig
                data-testid="favoriteMeeting"
                active={filter.favoriteMeetings}
                color={'secondary'}
                size={'large'}
                onClick={() => onFilterChange('favoriteMeetings')}
              >
                <FavoriteIcon />
              </IconButtonBig>
            </Tooltip>
            {!isDesktop && (
              <>
                <IconButtonBig color={'secondary'} size={'large'} disabled>
                  <SearchIcon />
                </IconButtonBig>

                <Button
                  color={'secondary'}
                  component={Link}
                  to={'/dashboard/meetings/create'}
                  state={{ ...getReferrerRouterState(window.location) }}
                >
                  <AddIcon />
                </Button>
              </>
            )}
          </Stack>
        </Grid>
        <Grid item>
          <Toggle
            options={toggleOptions}
            onChange={(timePeriod: DashboardEventsFilters['timePeriod']) => {
              onFilterChange('timePeriod', timePeriod);
            }}
          />
        </Grid>
      </Grid>

      {isDesktop && (
        <Grid item lg={4} md={2} textAlign={'end'}>
          <Button
            color={'secondary'}
            component={Link}
            to={'/dashboard/meetings/create'}
            size={'large'}
            startIcon={<AddIcon />}
            state={{
              ...getReferrerRouterState(window.location),
            }}
          >
            {t('dashboard-plan-new-meeting')}
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default EventsPageHeader;
