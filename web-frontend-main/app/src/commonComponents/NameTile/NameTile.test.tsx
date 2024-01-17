// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { render, screen, configureStore } from '../../utils/testUtils';
import NameTile from './NameTile';

describe('render <NameTile />', () => {
  const { store } = configureStore();
  const displayName = 'Test User Name';

  test('render NameTile component with audio on', async () => {
    await render(<NameTile audioOn={true} displayName={displayName} />, store);

    expect(screen.getByTestId('nameTile')).toBeInTheDocument();
    expect(screen.getByText(displayName)).toBeInTheDocument();
    expect(screen.queryByTestId('micOff')).not.toBeInTheDocument();
  });

  test('render NameTile component with audio off', async () => {
    await render(<NameTile audioOn={false} displayName={displayName} />, store);

    expect(screen.getByTestId('nameTile')).toBeInTheDocument();
    expect(screen.getByText(displayName)).toBeInTheDocument();
    expect(screen.getByTestId('micOff')).toBeInTheDocument();
  });
});
