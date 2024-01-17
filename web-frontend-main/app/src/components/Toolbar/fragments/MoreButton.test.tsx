// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { render, screen, configureStore } from '../../../utils/testUtils';
import MoreButton from './MoreButton';

describe('<MoreButton />', () => {
  const { store } = configureStore();

  test('render MoreButton component', async () => {
    await render(<MoreButton />, store);
    expect(screen.getByTestId('toolbarMenuButton')).toBeInTheDocument();
  });
});
