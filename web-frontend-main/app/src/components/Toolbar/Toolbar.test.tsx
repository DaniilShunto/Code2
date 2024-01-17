// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Role } from '../../api/types/incoming/control';
import { render, screen, configureStore } from '../../utils/testUtils';
import Toolbar from './Toolbar';

jest.mock('../Toolbar/fragments/EndCallButton', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="toolbarEndCallButton"></div>,
  };
});

describe('render <Toolbar />', () => {
  test('render full-layout Toolbar component for modarator', () => {
    const { store } = configureStore({
      initialState: {
        user: { loggedIn: true, role: Role.Moderator },
      },
    });
    render(<Toolbar />, store);

    expect(screen.getByTestId('toolbarHandraiseButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarBlurScreenButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarAudioButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarVideoButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarMenuButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarEndCallButton')).toBeInTheDocument();
  });

  test('render full-layout Toolbar component for normal user', () => {
    const { store } = configureStore({
      initialState: {
        user: { loggedIn: true, role: Role.User },
      },
    });
    render(<Toolbar />, store);

    expect(screen.getByTestId('toolbarHandraiseButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarBlurScreenButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarAudioButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarVideoButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarMenuButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarEndCallButton')).toBeInTheDocument();
  });
});
