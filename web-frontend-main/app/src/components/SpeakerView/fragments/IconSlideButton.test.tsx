// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { render, screen, cleanup, fireEvent } from '../../../utils/testUtils';
import IconSlideButton from './IconSlideButton';

afterEach(() => {
  cleanup();
});

describe('IconSlideButton', () => {
  test('right IconSlideButton is rendered', async () => {
    const slideRight = jest.fn();

    await render(<IconSlideButton direction="right" onClick={slideRight} />);

    const navRightButton = screen.getByLabelText('navigate-to-right');
    expect(navRightButton).toBeInTheDocument();

    fireEvent.click(navRightButton);

    expect(slideRight).toHaveBeenCalled();
  });

  test('left IconSlideButton is rendered', async () => {
    const slideLeft = jest.fn();

    await render(<IconSlideButton direction="left" onClick={slideLeft} />);

    const navLeftButton = screen.getByLabelText('navigate-to-left');

    expect(navLeftButton).toBeInTheDocument();

    fireEvent.click(navLeftButton);

    expect(slideLeft).toHaveBeenCalled();
  });
});
