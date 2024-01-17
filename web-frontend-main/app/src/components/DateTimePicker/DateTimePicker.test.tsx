// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import DateFnsAdapter from '@date-io/date-fns';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';

import { render, screen, configureStore } from '../../utils/testUtils';
import DateTimePicker from './DateTimePicker';

const date = new Date();
const dateFns = new DateFnsAdapter();

const dateTimePickerProps = {
  ampm: false,
  value: date.toString(),
  onChange: jest.fn(),
};

const clearableDateTimePickerProps = {
  value: date.toString(),
  clearable: true,
  clearButtonLabel: 'Custom clear button text',
  placeholder: 'Cleared value',
  onChange: jest.fn(),
  ampm: false,
};

describe('render <DateTimePicker />', () => {
  const { store } = configureStore();
  i18n.changeLanguage('de');

  test('render DateTimePicker component with german localization', async () => {
    await render(<DateTimePicker {...dateTimePickerProps} />, store);
    const input: HTMLInputElement = screen.getByRole('textbox');
    const deFormattedDate = dateFns.formatByString(date, 'dd.MM.yyyy HH:mm');
    expect(input.value).toBe(deFormattedDate);
  });

  test('render DateTimePicker placeholer value on clear button click', async () => {
    await render(<DateTimePicker {...clearableDateTimePickerProps} />, store);

    const input: HTMLInputElement = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();

    const chooseDateButton = screen.getByRole('button', { name: /choose date/i });
    expect(chooseDateButton).toBeInTheDocument();
    await userEvent.click(chooseDateButton);

    const clearButton = screen.getByRole('button', { name: clearableDateTimePickerProps.clearButtonLabel });
    expect(clearButton).toBeInTheDocument();
  });
});
