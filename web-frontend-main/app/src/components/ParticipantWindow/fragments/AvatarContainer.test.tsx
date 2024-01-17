// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { getInitials } from '../../../utils/stringUtils';
import { mockedParticipant, mockStore, render, screen } from '../../../utils/testUtils';
import { AvatarContainer } from './AvatarContainer';

describe('render <AvatarContainer />', () => {
  const participant = mockedParticipant(0);
  const initials = getInitials(participant.displayName, 3);

  test('should render AvatarContainer component with initial', async () => {
    const { store } = mockStore(1);
    await render(<AvatarContainer participantId={participant.id} />, store);
    expect(screen.getByTestId('avatarContainer')).toBeInTheDocument();
    expect(screen.getByTestId('participantAvatar')).toBeInTheDocument();
    expect(screen.getByText(initials)).toBeInTheDocument();
  });

  test('render with isSipParticipant flag should not render initials', async () => {
    const { store } = mockStore(1, { sip: true });
    await render(<AvatarContainer participantId={participant.id} />, store);
    expect(screen.getByTestId('avatarContainer')).toBeInTheDocument();
    expect(screen.getByTestId('participantAvatar')).toBeInTheDocument();
    expect(screen.queryByTestId('avatarIcon')).not.toBeInTheDocument();
    expect(screen.queryByText(initials)).not.toBeInTheDocument();
  });
});
