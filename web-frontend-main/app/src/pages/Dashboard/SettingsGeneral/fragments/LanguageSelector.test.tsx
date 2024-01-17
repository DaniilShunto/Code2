// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { cleanup, waitFor } from '@testing-library/react';
import React from 'react';

import { render, screen, configureStore, fireEvent } from '../../../../utils/testUtils';
import LanguageSelector from './LanguageSelector';

const mockUpdateMe = jest.fn();

jest.mock('../../../../api/rest', () => ({
  ...jest.requireActual('../../../../api/rest'),
  useGetMeQuery: () => ({
    data: {
      theme: 'light',
      language: 'en-US',
    },
  }),
  useUpdateMeMutation: () => [
    mockUpdateMe,
    {
      isLoading: false,
    },
  ],
}));

describe('LanguageSelector component', () => {
  const { store } = configureStore();
  afterEach(() => cleanup());
  test('render component without crashing', async () => {
    await render(<LanguageSelector />, store);

    expect(screen.getByDisplayValue('en-US')).toBeInTheDocument();
    expect(screen.getByTestId('languageSelect')).toBeInTheDocument();
    expect(screen.getByText('dashboard-settings-profile-button-save')).toBeInTheDocument();
    expect(screen.getByText('dashboard-settings-general-language')).toBeInTheDocument();
  });

  test('click on Save button should trigger mockUpdateMe', async () => {
    await render(<LanguageSelector />, store);

    const saveButton = screen.getByRole('button', { name: /dashboard-settings-profile-button-save/i });
    expect(saveButton).toBeInTheDocument();

    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(mockUpdateMe).toHaveBeenCalledTimes(1);
    });
  });

  test('successful UpdateMe should triggers a success notification', async () => {
    await render(<LanguageSelector />, store);

    const saveButton = screen.getByRole('button', { name: /dashboard-settings-profile-button-save/i });
    expect(saveButton).toBeInTheDocument();

    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByText('dashboard-settings-general-notification-save-success')).toBeInTheDocument();
    });
  });
});
