// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render } from '../../utils/testUtils';
import QuickStart, { OPEN_QUICK_START_LABEL, CLOSE_QUICK_START_LABEL } from './QuickStart';

// Only 'lobby' varaint is being tested here.
// Functionalweise is totally equal to 'room'.
// The only difference is the appearance of the anchor element

describe('<QuickStart />', () => {
  it('should toggle the button label and the popper on button click ', async () => {
    await render(<QuickStart variant="lobby" />);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    const quickStartButton = screen.getByRole('button', { name: 'conference-quick-start-open' });
    expect(quickStartButton).toBeInTheDocument();
    expect(screen.getByText(OPEN_QUICK_START_LABEL)).toBeInTheDocument();

    await userEvent.click(quickStartButton);
    expect(quickStartButton.getAttribute('aria-label')).toEqual('conference-quick-start-close');
    expect(screen.queryByText(OPEN_QUICK_START_LABEL)).not.toBeInTheDocument();
    expect(screen.getByText(CLOSE_QUICK_START_LABEL)).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await userEvent.click(quickStartButton);
    expect(quickStartButton.getAttribute('aria-label')).toEqual('conference-quick-start-open');
    expect(screen.queryByText(CLOSE_QUICK_START_LABEL)).not.toBeInTheDocument();
    expect(screen.getByText(OPEN_QUICK_START_LABEL)).toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('should show only loading window on image loading', async () => {
    await render(<QuickStart variant="lobby" />);
    const quickStartButton = screen.getByRole('button', { name: 'conference-quick-start-open' });

    await userEvent.click(quickStartButton);
    expect(screen.getByText('quick-start-loading')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText('quick-start-error')).not.toBeInTheDocument();
    expect(screen.getByAltText('conference-quick-start-title')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should show only loaded image on succesfull image load', async () => {
    await render(<QuickStart variant="lobby" />);
    const quickStartButton = screen.getByRole('button', { name: 'conference-quick-start-open' });

    await userEvent.click(quickStartButton);
    const image = screen.getByAltText('conference-quick-start-title');

    fireEvent.load(image);
    expect(screen.queryByText('quick-start-loading')).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.queryByText('quick-start-error')).not.toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('should show only error message on image load error', async () => {
    await render(<QuickStart variant="lobby" />);
    const quickStartButton = screen.getByRole('button', { name: 'conference-quick-start-open' });

    await userEvent.click(quickStartButton);
    const image = screen.getByAltText('conference-quick-start-title');

    fireEvent.error(image);
    expect(screen.queryByText('quick-start-loading')).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.getByText('quick-start-error')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
