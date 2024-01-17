// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { fireEvent, waitFor, cleanup } from '@testing-library/react';

import { render, screen, createStore } from '../../../utils/testUtils';
import HandraiseButton from './HandraiseButton';

describe('<HandraiseButton />', () => {
  afterEach(() => cleanup());
  const { store, dispatch } = createStore();

  test('should render HandraiseButton component', async () => {
    await render(<HandraiseButton />, store);
    expect(screen.getByTestId('toolbarHandraiseButton')).toBeInTheDocument();
  });

  test('should dispatch raise_hand by clicking on HandraiseButton', async () => {
    await render(<HandraiseButton />, store);
    const endButton = screen.getByTestId('toolbarHandraiseButton');
    expect(endButton).toBeInTheDocument();

    fireEvent.click(endButton);

    await waitFor(() => {
      expect(dispatch.mock.calls).toContainEqual([{ payload: undefined, type: 'signaling/control/raise_hand' }]);
    });
  });
});
