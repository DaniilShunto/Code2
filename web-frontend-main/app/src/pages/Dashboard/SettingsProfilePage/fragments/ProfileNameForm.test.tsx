// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { waitFor } from '@testing-library/react';
import React from 'react';

import { configureStore, fireEvent, render, screen } from '../../../../utils/testUtils';
import ProfileNameForm from './ProfileNameForm';

const mockUpdateMe = jest.fn();

const DISPLAY_NAME = 'Test User';

jest.mock('../../../../api/rest', () => ({
  ...jest.requireActual('../../../../api/rest'),
  useGetMeQuery: () => ({
    data: {
      displayName: DISPLAY_NAME,
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

describe('ProfileNameForm', () => {
  beforeEach(() => {
    mockUpdateMe.mockReturnValue({
      unwrap: () => Promise.resolve(),
    });
  });

  test('page will not crash', async () => {
    const { store } = configureStore();
    await render(<ProfileNameForm />, store);

    expect(screen.getByText('dashboard-settings-profile-name')).toBeInTheDocument();
  });

  test('empty displayName will show error', async () => {
    const { store } = configureStore();
    await render(<ProfileNameForm />, store);

    expect(screen.queryByText('dashboard-settings-profile-input-required')).not.toBeInTheDocument();

    const input = screen.getByDisplayValue(DISPLAY_NAME);
    fireEvent.change(input, { target: { value: '' } });

    await waitFor(() => {
      expect(screen.getByText('dashboard-settings-profile-input-required')).toBeInTheDocument();
    });
  });

  test('click on submit button will trigger updateMe', async () => {
    const { store } = configureStore();
    await render(<ProfileNameForm />, store);

    expect(mockUpdateMe).toHaveBeenCalledTimes(0);

    const submitButton = screen.getByText('dashboard-settings-profile-button-save');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateMe).toHaveBeenCalledTimes(1);
    });
  });

  test('click on submit button will not trigger updateMe on invalid form input', async () => {
    const { store } = configureStore();
    await render(<ProfileNameForm />, store);

    expect(mockUpdateMe).toHaveBeenCalledTimes(0);

    const input = screen.getByDisplayValue(DISPLAY_NAME);
    const submitButton = screen.getByText('dashboard-settings-profile-button-save');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateMe).toHaveBeenCalledTimes(0);
    });
  });

  test('successful triggers a notification', async () => {
    const { store } = configureStore();
    await render(<ProfileNameForm />, store);

    const submitButton = screen.getByText('dashboard-settings-profile-button-save');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('dashboard-settings-general-notification-save-success')).toBeInTheDocument();
    });
  });

  test('triggers error notification on failure', async () => {
    mockUpdateMe.mockReturnValueOnce({
      unwrap: () => Promise.reject(),
    });

    const { store } = configureStore();
    await render(<ProfileNameForm />, store);

    const submitButton = screen.getByText('dashboard-settings-profile-button-save');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('dashboard-settings-general-notification-save-error')).toBeInTheDocument();
    });
  });
});
