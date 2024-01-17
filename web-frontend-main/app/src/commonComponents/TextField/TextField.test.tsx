// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Store } from '@reduxjs/toolkit';
import { cleanup } from '@testing-library/react';
import React from 'react';

import TextField from '.';
import { createStore, fireEvent, render, screen } from '../../utils/testUtils';

describe('TextField', () => {
  let store: Store, dispatch: jest.Mock;
  afterEach(() => cleanup());
  beforeEach(() => {
    const createdStore = createStore();
    store = createdStore.store;
    dispatch = createdStore.dispatch;
  });

  test('render label', async () => {
    await render(<TextField label={'test'} />, store);

    expect(screen.getByText('test')).toBeInTheDocument();
  });

  test('render helper text on error', async () => {
    await render(<TextField label={'test'} error helperText={'test helper text'} />, store);

    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('test helper text')).toBeInTheDocument();
  });

  test('push2talk is deactivated when TextField is focused', async () => {
    await render(<TextField label={'test'} />, store);

    expect(screen.getByText('test')).toBeInTheDocument();

    const inputElement = screen.getByRole('textbox');
    fireEvent.focus(inputElement);

    expect(dispatch.mock.calls).toContainEqual([{ payload: false, type: 'hotkeys/setHotkeysEnabled' }]);
  });

  test('push2talk is activated when TextField is unfocused', async () => {
    await render(<TextField label={'test'} />, store);
    expect(screen.getByText('test')).toBeInTheDocument();

    const inputElement = screen.getByRole('textbox');
    fireEvent.focus(inputElement);
    fireEvent.blur(inputElement);

    expect(dispatch.mock.calls).toContainEqual([{ payload: true, type: 'hotkeys/setHotkeysEnabled' }]);
  });

  test('onFocus and onBlur are called', async () => {
    const onBlur = jest.fn();
    const onFocus = jest.fn();
    await render(<TextField label={'test'} onBlur={onBlur} onFocus={onFocus} />, store);

    expect(screen.getByText('test')).toBeInTheDocument();
    const inputElement = screen.getByRole('textbox');

    expect(onBlur).toHaveBeenCalledTimes(0);
    expect(onFocus).toHaveBeenCalledTimes(0);

    fireEvent.focus(inputElement);
    fireEvent.blur(inputElement);

    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onFocus).toHaveBeenCalledTimes(1);
  });
});
