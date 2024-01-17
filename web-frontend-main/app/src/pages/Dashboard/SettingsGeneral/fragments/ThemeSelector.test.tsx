// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { cleanup, waitFor } from '@testing-library/react';
import React from 'react';

import { render, screen, configureStore, fireEvent } from '../../../../utils/testUtils';
import ThemeSelector from './ThemeSelector';

const mockUpdateMe = jest.fn();

jest.mock('../../../../api/rest', () => ({
  ...jest.requireActual('../../../../api/rest'),
  useUpdateMeMutation: () => [
    mockUpdateMe,
    {
      isLoading: false,
    },
  ],
}));

describe('ThemeSelector component', () => {
  const { store } = configureStore();
  afterEach(() => cleanup());
  test('render component without crashing', async () => {
    await render(<ThemeSelector />, store);

    expect(screen.getByText('dashboard-settings-general-theme-light')).toBeInTheDocument();
    expect(screen.getByText('dashboard-settings-general-theme-dark')).toBeInTheDocument();
    expect(screen.getByText('dashboard-settings-general-theme-system')).toBeInTheDocument();
  });

  test('click on radio button should trigger mockUpdateMe', async () => {
    await render(<ThemeSelector />, store);

    const darkBtn = screen.getByDisplayValue('dark');
    const lightBtn = screen.getByDisplayValue('light');
    const systemBtn = screen.getByDisplayValue('system');
    expect(darkBtn).toBeInTheDocument();
    expect(lightBtn).toBeInTheDocument();
    expect(systemBtn).toBeInTheDocument();

    fireEvent.click(darkBtn);
    await waitFor(() => {
      expect(mockUpdateMe).toHaveBeenCalledTimes(1);
    });
  });

  test('click on theme button should mark theme as checked', async () => {
    await render(<ThemeSelector />, store);

    const allRadioBtn = screen.getAllByRole('radio');
    expect(allRadioBtn).toHaveLength(3);

    const labelBtnLight = screen.getByText('dashboard-settings-general-theme-light');
    const labelBtnDark = screen.getByText('dashboard-settings-general-theme-dark');
    const labelBtnSystem = screen.getByText('dashboard-settings-general-theme-system');

    expect(labelBtnLight).toBeInTheDocument();
    expect(labelBtnDark).toBeInTheDocument();
    expect(labelBtnSystem).toBeInTheDocument();

    const radioBtnLight = screen.getByDisplayValue('light');
    const radioBtnDark = screen.getByDisplayValue('dark');
    const radioBtnSystem = screen.getByDisplayValue('system');

    expect(radioBtnLight).toBeInTheDocument();
    expect(radioBtnDark).toBeInTheDocument();
    expect(radioBtnSystem).toBeInTheDocument();

    expect(radioBtnSystem).toBeChecked();
    expect(radioBtnLight).not.toBeChecked();
    expect(radioBtnDark).not.toBeChecked();

    fireEvent.click(radioBtnLight);
    await waitFor(() => {
      expect(radioBtnLight).toBeChecked();
    });

    fireEvent.click(radioBtnDark);
    await waitFor(() => {
      expect(radioBtnDark).toBeChecked();
    });

    fireEvent.click(radioBtnSystem);
    await waitFor(() => {
      expect(radioBtnSystem).toBeChecked();
    });
  });
});
