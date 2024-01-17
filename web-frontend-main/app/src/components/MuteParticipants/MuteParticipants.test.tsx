// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { mockStore, render, screen, fireEvent, waitFor, mockedParticipant } from '../../utils/testUtils';
import MuteParticipants from './MuteParticipants';

const NUMBER_OF_PARTICIPANTS = 4;

describe('MuteParticipants', () => {
  const { store, dispatch } = mockStore(NUMBER_OF_PARTICIPANTS, { video: true, screen: true });
  const participantsIds = store.getState().participants.ids;
  const participant1 = mockedParticipant(1);
  const participant2 = mockedParticipant(2);

  test(`MuteParticipants component will render properly with list of ${NUMBER_OF_PARTICIPANTS} participants`, async () => {
    await render(<MuteParticipants />, store);

    const muteAllButton = screen.getByRole('button', { name: /mute-participants-button-all/i });
    const muteSelectedButton = screen.getByRole('button', { name: /mute-participants-button-selected/i });

    expect(muteAllButton).toBeInTheDocument();
    expect(muteSelectedButton).toBeInTheDocument();
    expect(screen.getByPlaceholderText('input-search-placehoder')).toBeInTheDocument();

    const participantsList = screen.getAllByRole('listitem');
    expect(participantsList).toHaveLength(NUMBER_OF_PARTICIPANTS);
  });

  test('click on muteAll button should dispatch moderator_mute action', async () => {
    await render(<MuteParticipants />, store);

    const muteAllButton = screen.getByRole('button', { name: /mute-participants-button-all/i });
    expect(muteAllButton).toBeInTheDocument();

    fireEvent.click(muteAllButton);

    await waitFor(() => {
      expect(dispatch.mock.calls).toContainEqual([
        {
          payload: { force: true, targets: [...participantsIds] },
          type: 'signaling/media/moderator_mute',
        },
      ]);
    });
  });

  test('click on muteSelected button should dispatch moderator_mute action only for selected participant', async () => {
    await render(<MuteParticipants />, store);

    const muteSelectedButton = screen.getByRole('button', { name: /mute-participants-button-selected/i });
    expect(muteSelectedButton).toBeInTheDocument();

    const checkbox1 = screen.getByRole('checkbox', { name: participant1.displayName });
    const checkbox2 = screen.getByRole('checkbox', { name: participant2.displayName });

    fireEvent.click(checkbox1);
    fireEvent.click(checkbox2);

    await waitFor(() => {
      expect(checkbox1).toBeChecked();
    });

    await waitFor(() => {
      expect(checkbox2).toBeChecked();
    });

    fireEvent.click(muteSelectedButton);

    await waitFor(() => {
      expect(dispatch.mock.calls).toContainEqual([
        {
          payload: { force: true, targets: [participant1.id, participant2.id] },
          type: 'signaling/media/moderator_mute',
        },
      ]);
    });
  });
});
