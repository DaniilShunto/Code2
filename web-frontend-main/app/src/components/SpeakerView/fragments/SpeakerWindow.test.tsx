// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { render, screen, cleanup, mockStore } from '../../../utils/testUtils';
import SpeakerWindow from './SpeakerWindow';

afterEach(() => {
  cleanup();
});

describe('SpeakerWindow', () => {
  test('SpeakerWindow is not rendered with zero participants', async () => {
    const { store } = mockStore(0);
    await render(<SpeakerWindow />, store);

    expect(screen.queryByTestId('ParticipantWindow')).not.toBeInTheDocument();
  });

  test('SpeakerWindow is rendered with one participant', async () => {
    const { store } = mockStore(1);
    await render(<SpeakerWindow />, store);

    expect(screen.getByTestId('ParticipantWindow')).toBeInTheDocument();
  });
});
