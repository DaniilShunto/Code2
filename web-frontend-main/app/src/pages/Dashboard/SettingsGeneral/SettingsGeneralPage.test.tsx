// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import React from 'react';

import { render, screen, configureStore } from '../../../utils/testUtils';
import SettingsGeneralPage from './SettingsGeneralPage';

jest.mock('../../../api/rest', () => ({
  ...jest.requireActual('../../../api/rest'),
  useGetMeQuery: () => ({
    data: {
      theme: 'light',
      language: 'de-DE',
    },
  }),
}));

describe('Dashboard SettingsGeneralPage', () => {
  test('render page without crashing', async () => {
    const { store } = configureStore();
    await render(<SettingsGeneralPage />, store);

    expect(screen.getByTestId('dashboardSettingsGeneral')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dashboard-settings-profile-button-save/i })).toBeInTheDocument();
    expect(screen.getByText('dashboard-settings-general-language')).toBeInTheDocument();
    //TODO currently ThemeSelector is removed since has only presentation function
    // expect(screen.getByText('dashboard-settings-general-appearance')).toBeInTheDocument();
    expect(screen.getByText('dashboard-settings-profile-button-save')).toBeInTheDocument();
  });
});
