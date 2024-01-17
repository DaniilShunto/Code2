// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import TextField from '../../commonComponents/TextField/index';
import { render, screen, configureStore } from '../../utils/testUtils';
import SelfTest from './SelfTest';

describe('SelfTest', () => {
  const { store } = configureStore();

  test('render SelfTest component without crashing', async () => {
    await render(
      <SelfTest>
        <TextField color={'secondary'} placeholder={'joinform-enter-name'} />
      </SelfTest>,
      store
    );

    expect(screen.getByText('selftest-body')).toBeInTheDocument();
    expect(screen.getByText('selftest-header')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('joinform-enter-name')).toBeInTheDocument();

    expect(screen.getByLabelText('speed-meter-button')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'speed-meter-button' })).toBeInTheDocument();

    expect(screen.getByTestId('toolbarAudioButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarVideoButton')).toBeInTheDocument();
    expect(screen.queryByTestId('toolbarBlurScreenButton')).not.toBeInTheDocument();
    expect(screen.queryByTestId('toolbarHandraiseButton')).not.toBeInTheDocument();
    expect(screen.queryByTestId('toolbarMenuButton')).not.toBeInTheDocument();
    expect(screen.queryByTestId('toolbarEndCallButton')).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'conference-quick-start-open' })).toBeInTheDocument();
  });
});
