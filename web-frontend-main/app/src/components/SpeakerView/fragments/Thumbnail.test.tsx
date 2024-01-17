// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ParticipantId } from '@opentalk/common';

import { render, screen, cleanup, mockStore } from '../../../utils/testUtils';
import Thumbnail from './Thumbnail';

afterEach(() => {
  cleanup();
});

describe('Thumbnail', () => {
  test('ThumbnailContainer rendered width one participant', async () => {
    const { store } = mockStore(1);

    const ids = store.getState().participants.ids;
    const participantId = ids[0] as ParticipantId;

    await render(<Thumbnail participantId={participantId} width={0} index={0} />, store);

    // Initial ThumbnailContainer appears
    expect(screen.getByTestId(`thumbsVideo-${participantId}`)).toBeInTheDocument();
  });
});
