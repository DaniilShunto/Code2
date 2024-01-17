// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { render, screen, configureStore, fireEvent } from '../../../utils/testUtils';
import MenuButton from './MoreButton';

describe('<MoreButton />', () => {
  const { store } = configureStore();

  test('render MoreMenuButton component', async () => {
    await render(<MenuButton />, store);
    expect(screen.getByTestId('toolbarMenuButton')).toBeInTheDocument();
    expect(screen.queryByTestId('moreMenu')).not.toBeInTheDocument();
  });

  test('render moreMenu after clicking on MoreMenuButton', async () => {
    await render(<MenuButton />, store);
    const button = screen.getByTestId('toolbarMenuButton');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByTestId('moreMenu')).toBeInTheDocument();
  });
});
