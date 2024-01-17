// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Typography } from '@mui/material';
import { AuthCallbackComponent, selectAuthIsPending } from '@opentalk/redux-oidc';
import { useAuthContext, selectIsAuthenticated } from '@opentalk/redux-oidc';
import i18next from 'i18next';
import React, { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { To, RouteObject, useNavigate, Outlet, useParams } from 'react-router-dom';

import { useAppSelector } from '../hooks';
import { useInviteCode } from '../hooks/useInviteCode';
import {
  SettingsProfilePage,
  SettingsGeneralPage,
  SettingsAccountPage,
  CreateEventsPage,
  EditEventsPage,
  Home,
  CreateDirectMeeting,
  EventsOverviewPage,
  EventDetailsPage,
  DocumentationPage,
} from '../pages/Dashboard';
import RoomPage from '../pages/RoomPage';
import DashboardSettingsTemplate from '../templates/DashboardSettingsTemplate';
import DashboardTemplate from '../templates/DashboardTemplate';
import LobbyTemplate from '../templates/LobbyTemplate';

const InvitePage = React.lazy(() => import('../pages/InvitePage'));

type RouteValue = {
  path: string;
  children?: Routes;
};

export type Routes = {
  [key: string]: RouteValue;
};

const AuthRedirect = ({ label }: { label: string }) => {
  return (
    <AuthCallbackComponent>
      <p>{label}</p>
    </AuthCallbackComponent>
  );
};

const RouteNotFound = () => {
  const { t } = useTranslation();
  return (
    <Box display={'flex'} margin={'auto'}>
      <Typography variant="h5" component={'h1'} color={'white'}>
        {t('route-not-found')}
      </Typography>
    </Box>
  );
};

const Redirect = ({ to }: { to: To }) => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  useEffect(() => {
    roomId ? navigate(`${to}/${roomId}`) : navigate(to);
  }, [navigate, to, roomId]);
  return null;
};

const ProtectedRoute = ({ children }: { children?: ReactNode }) => {
  const auth = useAuthContext();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAuthPending = useAppSelector(selectAuthIsPending);
  const inviteCode = useInviteCode();

  if (!isAuthenticated && !inviteCode && !isAuthPending) {
    auth?.signIn();
    return null;
  }

  if (isAuthPending) {
    return null;
  }

  if (children !== undefined) {
    return <>{children}</>;
  }
  return <Outlet />;
};

type CreateRoutes = (redirectUri: string, popUpRedirect: string) => RouteObject[];

const routes: CreateRoutes = (redirectUri: string, popUpRedirect: string) => [
  {
    path: '/',
    key: 'home',
    element: <LobbyTemplate />,
    children: [
      { index: true, element: <Redirect to={'/dashboard'} /> },
      {
        path: '/lobby/:roomId',
        key: 'lobby',
        element: <Redirect to={'/room'} />,
      },
      {
        path: '/waiting/:roomId',
        key: 'waiting',
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <Redirect to={'/room'} /> },
          { path: ':breakoutRoomId', element: <Redirect to={'/room'} />, key: 'breakoutRoom' },
        ],
      },
      {
        path: '/room/:roomId',
        key: 'room',
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <RoomPage /> },
          { path: ':breakoutRoomId', element: <RoomPage />, key: 'breakoutRoom' },
        ],
      },
    ],
  },

  {
    path: '/invite/:inviteCode',
    element: <LobbyTemplate />,
    children: [{ index: true, element: <InvitePage /> }],
    key: 'invite',
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardTemplate />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'settings',
        element: <DashboardSettingsTemplate />,
        children: [
          { path: 'general', element: <SettingsGeneralPage /> },
          { path: 'account', element: <SettingsAccountPage /> },
          { path: 'profile', element: <SettingsProfilePage /> },
        ],
      },
      {
        path: 'legal',
        element: <></>,
        children: [
          { path: 'imprint', element: <></> },
          { path: 'data-protection', element: <></> },
        ],
      },
      {
        path: 'meetings',
        children: [
          { element: <EventsOverviewPage />, index: true },
          { path: 'meet-now', element: <CreateDirectMeeting /> },
          { path: 'create', element: <CreateEventsPage /> },
          { path: 'update/:eventId/:formStep', element: <EditEventsPage /> },
          { path: ':eventId', element: <EventDetailsPage /> },
        ],
      },
      {
        path: 'help',
        children: [
          { path: 'documentation', element: <DocumentationPage /> },
          { path: 'support', element: <></> },
        ],
      },
    ],
  },
  {
    path: redirectUri,
    key: 'redirectUri',
    element: <AuthRedirect label={i18next.t('auth-redirect-message')} />,
  },
  {
    path: popUpRedirect,
    key: 'popUpRedirect',
    element: <AuthRedirect label={i18next.t('auth-popup-closes-message')} />,
  },
  {
    path: '*',
    element: <RouteNotFound />,
  },
];

export default routes;
