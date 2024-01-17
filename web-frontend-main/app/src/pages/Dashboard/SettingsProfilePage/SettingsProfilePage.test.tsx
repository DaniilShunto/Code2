// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import React from 'react';

import { render, screen, configureStore } from '../../../utils/testUtils';
import SettingsProfilePage from './SettingsProfilePage';

const mockUpdateMe = jest.fn();

jest.mock('../../../api/rest', () => ({
  ...jest.requireActual('../../../api/rest'),
  useGetMeQuery: () => ({
    data: {
      displayName: 'Test User',
      avatarUrl: 'TestURL',
    },
  }),
  useUpdateMeMutation: () => [
    mockUpdateMe,
    {
      isLoading: false,
    },
  ],
}));

describe('SettingsProfilePage', () => {
  test('page will not crash', async () => {
    const { store } = configureStore();
    await render(<SettingsProfilePage />, store);

    expect(screen.getByText('dashboard-settings-profile-picture')).toBeInTheDocument();
  });
});
