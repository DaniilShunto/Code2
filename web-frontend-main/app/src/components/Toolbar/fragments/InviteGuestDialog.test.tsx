// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { render, screen, configureStore } from '../../../utils/testUtils';
import InviteGuestDialog from './InviteGuestDialog';

describe('<InviteGuestDialog />', () => {
  const { store } = configureStore();

  test('render InviteGuestDialog component when flag open is true', async () => {
    await render(<InviteGuestDialog open />, store);
    expect(screen.getByText('dialog-invite-guest-title')).toBeInTheDocument();
    expect(screen.getByLabelText('close-button')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'close-button' })).toBeInTheDocument();

    expect(screen.getByPlaceholderText('dialog-invite-guest-no-expiration')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'dialog-invite-guest-button-submit' })).toBeInTheDocument();
  });

  test('with flag open={false} component should not be rendered', async () => {
    await render(<InviteGuestDialog open={false} />, store);
    expect(screen.queryByText('dialog-invite-guest-title')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'close-button' })).not.toBeInTheDocument();
  });
});
