// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { MicOnIcon } from '@opentalk/common';

import { render, screen, cleanup, fireEvent } from '../../../utils/testUtils';
import ToolbarButton from './ToolbarButton';

describe('<ToolbarButton />', () => {
  afterEach(() => cleanup());
  const handleClick = jest.fn();

  const ToolbarButtonProps = {
    hasContext: true,
    contextDisabled: false,
    contextTitle: 'toolbarToggleButton',
    tooltipTitle: 'toolbarMainButton',
    disabled: false,
    active: false,
    onClick: jest.fn(),
    openMenu: jest.fn(),
    children: <MicOnIcon data-testid="toolbarChildrenTest" />,
    isLobby: false,
  };

  test('render ToolbarButton with context and children', () => {
    render(<ToolbarButton {...ToolbarButtonProps} />);
    expect(screen.getByRole('button', { name: 'toolbarMainButton' })).toBeInTheDocument();
    expect(screen.getByTestId('toolbarChildrenTest')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'toolbarToggleButton' })).toBeInTheDocument();
  });

  test('render ToolbarButton without context', () => {
    render(<ToolbarButton {...ToolbarButtonProps} hasContext={false} />);
    expect(screen.getByRole('button', { name: 'toolbarMainButton' })).toBeInTheDocument();
    expect(screen.getByTestId('toolbarChildrenTest')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'toolbarToggleButton' })).not.toBeInTheDocument();
  });

  test('testing click on ToolbarButton', () => {
    render(<ToolbarButton {...ToolbarButtonProps} onClick={handleClick} />);
    const button = screen.getByRole('button', { name: 'toolbarMainButton' });

    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('testing click on disabled ToolbarButton', () => {
    render(<ToolbarButton {...ToolbarButtonProps} openMenu={handleClick} disabled />);
    const button = screen.getByRole('button', { name: 'toolbarMainButton' });

    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('testing click on ToggleToolbarButton', () => {
    render(<ToolbarButton {...ToolbarButtonProps} openMenu={handleClick} />);
    const toggleButton = screen.getByRole('button', { name: 'toolbarToggleButton' });
    expect(toggleButton).toBeInTheDocument();
    fireEvent.click(toggleButton);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
