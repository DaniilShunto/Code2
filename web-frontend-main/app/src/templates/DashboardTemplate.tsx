// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Container as MuiContainer,
  Grid,
  Paper,
  Skeleton,
  Stack,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { HomeIcon, SettingsIcon, MeetingsIcon, MyAccountIcon, LegalLinksIcon, HelpIcon } from '@opentalk/common';
import { selectIsAuthenticated } from '@opentalk/redux-oidc';
import React, { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import { ReactComponent as Logo } from '../assets/images/logoGradient.svg';
import DashboardNavigation, { PrimaryRoute } from '../components/DashboardNavigation';
import { useAppSelector } from '../hooks';
import { selectIsProviderActive } from '../store/slices/configSlice';

const DashboardLogo = styled(Logo)({
  gridArea: 'Logo',
  height: '1.685em',
  width: '100%',
});

const Main = styled('main')(({ theme }) => ({
  height: '100%',
  flex: 1,
  padding: theme.spacing(3, 5),

  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3, 2),
  },
}));

const Container = styled(MuiContainer)(({ theme }) => ({
  background: theme.palette.common.white,
  width: '100%',
  '&::before': {
    position: 'absolute',
    inset: 0,
    content: "''",
    background: theme.palette.background?.defaultGradient || theme.palette.background?.default,
    backgroundColor: theme.palette.background?.defaultGradient || theme.palette.background?.default,
    pointerEvents: 'none',
  },
}));

const LoadingNavbarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  width: 256,
}));

type DashboardTemplateContext = {
  header: React.ReactNode;
  setHeader: (header: React.ReactNode) => void;
};

export const useHeader = () => {
  return useOutletContext<DashboardTemplateContext>();
};

const getRoutes = (useProviderSettings: boolean) => {
  const routes: Array<PrimaryRoute> = [
    {
      icon: <HomeIcon />,
      path: '/dashboard/',
      name: 'dashboard-home',
    },
    {
      icon: <MeetingsIcon />,
      path: 'meetings',
      name: 'dashboard-meetings',
    },
    {
      icon: <HelpIcon />,
      path: 'help',
      name: 'dashboard-help',
      childRoutes: [
        {
          path: 'documentation',
          name: 'dashboard-help-documentation',
        },
        {
          path: 'support',
          name: 'dashboard-help-support',
        },
      ],
    },
  ];

  if (useProviderSettings) {
    const providerMenu = {
      icon: <MyAccountIcon />,
      path: 'settings',
      name: 'dashboard-my-profile',
      childRoutes: [
        {
          path: 'profile',
          name: 'dashboard-settings-profile',
        },
      ],
    };
    routes.push(providerMenu);
  } else {
    const communityUsers = {
      icon: <SettingsIcon />,
      path: 'settings',
      name: 'dashboard-settings',
      childRoutes: [
        {
          path: 'general',
          name: 'dashboard-settings-general',
        },
        {
          path: 'profile',
          name: 'dashboard-settings-profile',
        },
        {
          path: 'account',
          name: 'dashboard-settings-account',
        },
      ],
    };
    routes.push(communityUsers);
  }

  const legalLinks = {
    icon: <LegalLinksIcon />,
    path: 'legal',
    name: 'dashboard-legal',
    childRoutes: [
      {
        path: 'imprint',
        name: 'dashboard-legal-imprint',
      },
      {
        path: 'data-protection',
        name: 'dashboard-legal-data-protection',
      },
    ],
  };
  routes.push(legalLinks);

  return routes;
};

const DashboardTemplate = () => {
  const [header, setHeader] = useState<React.ReactNode>();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isProviderActive = useAppSelector(selectIsProviderActive);

  if (!isAuthenticated) {
    return (
      <Container maxWidth={false} disableGutters>
        <Stack direction={{ xs: 'column', md: 'row' }} height={'100%'}>
          {isDesktop && (
            <LoadingNavbarContainer elevation={0}>
              <Stack spacing={12}>
                <Grid container spacing={1} alignItems={'center'}>
                  <Grid item>
                    <Skeleton variant="circular" width={40} height={40} />
                  </Grid>
                  <Grid item xs>
                    <Skeleton variant="text" />
                  </Grid>
                </Grid>
                <Stack spacing={1}>
                  <Skeleton variant="text" width={208} height={56} />
                  <Skeleton variant="text" width={208} height={56} />
                  <Skeleton variant="text" width={208} height={56} />
                  <Skeleton variant="text" width={208} height={56} />
                  <Skeleton variant="text" width={208} height={56} />
                  <Skeleton variant="text" width={208} height={56} />
                </Stack>
              </Stack>
            </LoadingNavbarContainer>
          )}
          <Main>
            <Grid container spacing={4}>
              <Grid item>
                <DashboardLogo />
              </Grid>
            </Grid>
            <div>
              <Stack spacing={2}>
                <Skeleton variant="text" />
                <Skeleton />
                <Skeleton variant="rectangular" width={'100%'} height={400} />
              </Stack>
            </div>
          </Main>
        </Stack>
      </Container>
    );
  }
  return (
    <Container maxWidth={false} disableGutters>
      <Stack direction={{ xs: 'column', md: 'row' }} height={'100%'}>
        <DashboardNavigation routes={getRoutes(isProviderActive)} />
        <Stack component={Main} spacing={{ xs: 2, md: 5 }} maxHeight={'100%'} height={{ xs: 0, sm: '100%' }}>
          <Grid spacing={2} container direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <Grid item alignSelf={'flex-end'}>
              <DashboardLogo />
            </Grid>
            <Grid item xs>
              {header}
            </Grid>
          </Grid>
          <Outlet context={{ setHeader }} />
        </Stack>
      </Stack>
    </Container>
  );
};

export default DashboardTemplate;
