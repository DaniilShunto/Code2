// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import SpeakerView from '.';
import { render, screen, cleanup, mockStore, mockedParticipant } from '../../utils/testUtils';

describe('speaker view', () => {
  afterEach(cleanup);
  const participant = mockedParticipant(0);

  test('SpeakerView is rendered with zero participants', async () => {
    const { store } = mockStore(0);
    await render(<SpeakerView />, store);

    // Initial elements appear
    expect(screen.getByTestId('SpeakerView-Container')).toBeInTheDocument();
    expect(screen.getByTestId('ThumbsHolder')).toBeInTheDocument();
    expect(screen.queryByTestId('ParticipantWindow')).not.toBeInTheDocument();
  });

  test('SpeakerView is rendered with one participant', async () => {
    const { store } = mockStore(1);
    await render(<SpeakerView />, store);

    expect(screen.getByTestId(`thumbsVideo-${participant.id}`)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'navigate-to-right' })).not.toBeInTheDocument();
  });

  test('SpeakerView is rendered with 2 participants', async () => {
    const { store } = mockStore(2);
    await render(<SpeakerView />, store);

    expect(screen.getByTestId(`thumbsVideo-${participant.id}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'navigate-to-right' })).toBeInTheDocument();
  });
});
