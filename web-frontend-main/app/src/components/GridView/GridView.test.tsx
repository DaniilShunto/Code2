// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import React from 'react';

import { render, screen, mockStore } from '../../utils/testUtils';
import GridView from './GridView';

describe('GridView', () => {
  test('render 8 cinemaCell inside GridView', async () => {
    const { store } = mockStore(8, {});
    await render(<GridView />, store);
    expect(screen.getAllByTestId('cinemaCell')).toHaveLength(8);
  });

  test('If there is more than 9 participants in meeting, GridView should render max of 9 cinemaCell per page', async () => {
    const { store } = mockStore(18, {});
    await render(<GridView />, store);
    expect(screen.getAllByTestId('cinemaCell')).toHaveLength(9);
  });
});
