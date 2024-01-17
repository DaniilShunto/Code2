// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { StatisticsIcon, FaqIcon, HomeIcon, MeetingsIcon, RecordingsIcon, SettingsIcon } from '@opentalk/common';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import DashboardNavigation from './DashboardNavigation';

const routes = [
  {
    icon: <HomeIcon />,
    path: 'dashboard',
    name: 'dashboard-home',
  },
  {
    icon: <MeetingsIcon />,
    path: 'meetings',
    name: 'dashboard-meetings',
  },
  {
    icon: <StatisticsIcon />,
    path: 'statistics',
    name: 'dashboard-statistics',
  },
  {
    icon: <RecordingsIcon />,
    path: 'recordings',
    name: 'dashboard-recordings',
  },
  {
    icon: <SettingsIcon />,
    path: 'settings',
    name: 'dashboard-settings',
    childRoutes: [
      {
        path: '',
        name: 'dashboard-settings-general',
      },
      {
        path: 'account',
        name: 'dashboard-settings-account',
      },
      {
        path: 'profile',
        name: 'dashboard-settings-profile',
      },
      {
        path: 'video',
        name: 'dashboard-settings-video',
      },
      {
        path: 'audio',
        name: 'dashboard-settings-audio',
      },
      {
        path: 'recordings',
        name: 'dashboard-recordings',
      },
      {
        path: 'statistics',
        name: 'dashboard-statistics',
      },
      {
        path: 'accessibility',
        name: 'dashboard-settings-accessibility',
      },
    ],
  },
  {
    icon: <FaqIcon />,
    path: 'faq',
    name: 'dashboard-faq',
  },
];

export default {
  title: 'components/DashboardNavigation',
  component: DashboardNavigation,
} as ComponentMeta<typeof DashboardNavigation>;

export const Basic: ComponentStory<typeof DashboardNavigation> = () => (
  <MemoryRouter initialEntries={['/']}>
    <DashboardNavigation routes={routes} />
  </MemoryRouter>
);
