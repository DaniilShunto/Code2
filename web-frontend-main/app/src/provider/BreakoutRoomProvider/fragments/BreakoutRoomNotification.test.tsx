// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { notifications } from '@opentalk/common';
import { cleanup } from '@testing-library/react';
import React from 'react';

import { ReactComponent as BreakoutRoomIcon } from '../../../assets/images/subroom-illustration.svg';
import { fireEvent, render, screen, configureStore, waitFor } from '../../../utils/testUtils';
import BreakoutRoomNotification, { Action } from './BreakoutRoomNotification';

const actionFn = jest.fn();

const SNACKBAR_KEY = 'test';
const ACTIONS: Array<Action> = [
  {
    text: 'TestButton',
    onClick: actionFn,
  },
  {
    text: 'TestButton2',
    onClick: actionFn,
  },
];
const MESSAGE = 'testMessage';

describe('BreakoutRoomNotification', () => {
  afterEach(() => cleanup());
  test('render all items', async () => {
    const { store } = configureStore();
    await render(
      <BreakoutRoomNotification
        snackbarKey={SNACKBAR_KEY}
        actions={ACTIONS}
        message={MESSAGE}
        iconComponent={BreakoutRoomIcon}
      />,
      store
    );
    await waitFor(() => {
      expect(screen.getByText(MESSAGE)).toBeInTheDocument();
    });
    expect(screen.getByText(ACTIONS[0].text)).toBeInTheDocument();
    expect(screen.getByText(ACTIONS[1].text)).toBeInTheDocument();
  });

  test('action called once', async () => {
    const { store } = configureStore();
    await render(
      <BreakoutRoomNotification
        snackbarKey={SNACKBAR_KEY}
        actions={ACTIONS}
        message={MESSAGE}
        iconComponent={BreakoutRoomIcon}
      />,
      store
    );
    await waitFor(() => {
      expect(screen.getByText(MESSAGE)).toBeInTheDocument();
    });

    expect(actionFn).toHaveBeenCalledTimes(0);

    fireEvent.click(screen.getByText(ACTIONS[0].text));
    fireEvent.click(screen.getByText(ACTIONS[0].text));

    expect(actionFn).toHaveBeenCalledTimes(1);
  });

  test('close after click on an action', async () => {
    const { store } = configureStore();
    await render(
      <BreakoutRoomNotification
        snackbarKey={SNACKBAR_KEY}
        actions={ACTIONS}
        message={MESSAGE}
        iconComponent={BreakoutRoomIcon}
      />,
      store
    );
    const spyClose = jest.spyOn(notifications, 'close');

    await waitFor(() => {
      expect(screen.getByText(MESSAGE)).toBeInTheDocument();
    });

    expect(spyClose).toHaveBeenCalledTimes(0);

    fireEvent.click(screen.getByText(ACTIONS[0].text));

    expect(spyClose).toHaveBeenCalledTimes(1);
  });
});
