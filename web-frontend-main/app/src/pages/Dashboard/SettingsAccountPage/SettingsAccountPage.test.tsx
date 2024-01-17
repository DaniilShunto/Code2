// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import React from 'react';

import { configureStore, render, screen } from '../../../utils/testUtils';
import SettingsAccountPage from './SettingsAccountPage';

jest.mock('../../../api/rest', () => ({
  ...jest.requireActual('../../../api/rest'),
  useGetMeQuery: () => ({
    email: 'user@email.org',
    firstname: 'firstname',
    lastname: 'lastname',
  }),
}));

describe('SettingsAccountPage', () => {
  test('page will not crash', async () => {
    const { store } = configureStore();
    await render(<SettingsAccountPage />, store);

    expect(screen.getByText('dashboard-settings-account-title')).toBeInTheDocument();
  });
});
