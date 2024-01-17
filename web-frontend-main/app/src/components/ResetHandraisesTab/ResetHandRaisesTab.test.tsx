// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createStore, fireEvent, render, screen, waitFor } from '../../utils/testUtils';
import ResetHandraisesTab from './ResetHandraisesTab';

describe('Reset all raised hands', () => {
  const { store, dispatch } = createStore();

  test('MuteParticipants component will render properly', async () => {
    await render(<ResetHandraisesTab />, store);

    const resetButton = screen.getByRole('button', { name: /reset-handraises-button/i });

    expect(resetButton).toBeInTheDocument();
  });

  test('ResetButton triggers api Call', async () => {
    await render(<ResetHandraisesTab />, store);

    const resetButton = screen.getByRole('button', { name: /reset-handraises-button/i });

    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(dispatch.mock.calls).toContainEqual([
        { payload: undefined, type: 'signaling/moderation/reset_raised_hands' },
      ]);
    });
  });
});
