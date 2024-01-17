// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import React from 'react';

import { render, screen, configureStore, fireEvent } from '../../utils/testUtils';
import NumberInput from './NumberInput';

const inputProps: {
  min: number;
  max: number;
} = {
  min: 2,
  max: 10,
};

describe('custom number input', () => {
  const mockOnChange = jest.fn();
  test('render all elements', async () => {
    const { store } = configureStore();
    await render(<NumberInput inputProps={inputProps} onChange={mockOnChange} />, store);

    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    expect(screen.getByTestId('incButton')).toBeInTheDocument();
    expect(screen.getByTestId('decButton')).toBeInTheDocument();
  });

  test('change input value', async () => {
    const { store } = configureStore();
    await render(<NumberInput inputProps={inputProps} onChange={mockOnChange} />, store);
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();

    const input = screen.getByDisplayValue('2');
    fireEvent.change(input, { target: { value: 4 } });

    expect(mockOnChange).toBeCalledTimes(1);
    expect(input).toHaveValue(4);
  });

  test('exceed max input value', async () => {
    const { store } = configureStore();
    await render(<NumberInput inputProps={inputProps} onChange={mockOnChange} />, store);

    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    const input = screen.getByDisplayValue('2');

    fireEvent.change(input, { target: { value: inputProps.max + 1 } });
    fireEvent.blur(input);

    expect(mockOnChange).toBeCalledTimes(1);
    expect(input).toHaveValue(inputProps.max);
  });

  test('fall below min input value', async () => {
    const { store } = configureStore();
    await render(<NumberInput inputProps={inputProps} onChange={mockOnChange} />, store);

    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    const input = screen.getByDisplayValue('2');

    fireEvent.change(input, { target: { value: inputProps.min - 1 } });
    fireEvent.blur(input);
    expect(mockOnChange).toBeCalledTimes(1);
    expect(input).toHaveValue(inputProps.min);
  });

  test('buttons clicked', async () => {
    const { store } = configureStore();
    await render(<NumberInput inputProps={inputProps} onChange={mockOnChange} />, store);

    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    const input = screen.getByDisplayValue('2');

    expect(screen.getByTestId('incButton')).toBeInTheDocument();
    expect(screen.getByTestId('decButton')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('incButton'));
    expect(mockOnChange).toBeCalledTimes(1);
    expect(input).toHaveValue(3);

    fireEvent.click(screen.getByTestId('decButton'));
    expect(mockOnChange).toBeCalledTimes(2);
    expect(input).toHaveValue(2);
  });

  test('exceed min button click', async () => {
    const { store } = configureStore();
    await render(<NumberInput inputProps={inputProps} onChange={mockOnChange} />, store);

    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    const input = screen.getByDisplayValue('2');

    expect(screen.getByTestId('incButton')).toBeInTheDocument();
    expect(screen.getByTestId('decButton')).toBeInTheDocument();

    // set value to minimum
    fireEvent.change(input, { target: { value: inputProps.min } });
    fireEvent.blur(input);
    expect(mockOnChange).toBeCalledTimes(1);
    expect(input).toHaveValue(inputProps.min);

    // click decrement button
    fireEvent.click(screen.getByTestId('decButton'));
    // expect minimum value
    expect(input).toHaveValue(inputProps.min);
  });

  test('exceed max button click', async () => {
    const { store } = configureStore();
    await render(<NumberInput inputProps={inputProps} onChange={mockOnChange} />, store);

    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    const input = screen.getByDisplayValue('2');

    expect(screen.getByTestId('incButton')).toBeInTheDocument();
    expect(screen.getByTestId('decButton')).toBeInTheDocument();

    // set value to maximum
    fireEvent.change(input, { target: { value: inputProps.max } });
    expect(mockOnChange).toBeCalledTimes(1);
    fireEvent.blur(input);
    expect(input).toHaveValue(inputProps.max);

    // click increment button
    fireEvent.click(screen.getByTestId('incButton'));
    // expect maximum value
    expect(input).toHaveValue(inputProps.max);
  });
});
