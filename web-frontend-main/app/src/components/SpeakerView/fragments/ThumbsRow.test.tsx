// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { render, screen, cleanup, mockStore, fireEvent } from '../../../utils/testUtils';
import ThumbsRow from './ThumbsRow';

afterEach(() => {
  cleanup();
});

describe('ThumbsRow', () => {
  test('ThumbsRow - zero participants', async () => {
    const { store } = mockStore(0);
    await render(<ThumbsRow thumbsPerWindow={5} thumbWidth={340} />, store);

    // Initial elements appear
    expect(screen.getByTestId('ThumbsHolder')).toBeInTheDocument();

    // arrows don't appear
    expect(screen.queryByLabelText('navigate-to-left')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('navigate-to-right')).not.toBeInTheDocument();
  });

  test('ThumbsRow - one participant', async () => {
    const { store } = mockStore(1);
    const ids = store.getState().participants.ids;

    await render(<ThumbsRow thumbsPerWindow={1} thumbWidth={340} />, store);

    // Initial elements appear
    expect(screen.getByTestId('ThumbsHolder')).toBeInTheDocument();

    // one participant appears
    expect(screen.getByTestId(`thumbsVideo-${ids[0]}`)).toBeInTheDocument();

    // arrows don't appear
    expect(screen.queryByLabelText('navigate-to-left')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('navigate-to-right')).not.toBeInTheDocument();
  });

  test('ThumbsRow - twelve participants - appearance', async () => {
    const { store } = mockStore(12);

    // 12 participants but 5 thumbs per window
    // navigate-to-right appears
    await render(<ThumbsRow thumbsPerWindow={5} thumbWidth={340} />, store);

    expect(screen.getByLabelText('navigate-to-right')).toBeInTheDocument();

    // shows the next row of thumbs
    // creat's the navigate-to-left
    fireEvent.click(screen.getByLabelText('navigate-to-right'));

    // we are in the middle (thumbs index 5 - 10 is shown)
    // left- and navigate-to-right appear
    expect(screen.getByLabelText('navigate-to-left')).toBeInTheDocument();
    expect(screen.getByLabelText('navigate-to-right')).toBeInTheDocument();

    // we are on the end of the thumbs (thumbs index 7 - 12 is shown)
    // navigate-to-left appears, navigate-to-right disappears
    fireEvent.click(screen.getByLabelText('navigate-to-right'));
    expect(screen.getByLabelText('navigate-to-left')).toBeInTheDocument();
    expect(screen.queryByLabelText('navigate-to-right')).not.toBeInTheDocument();

    // we are in the middle (thumbs index 5 - 10 is shown)
    // left- and navigate-to-right appear
    fireEvent.click(screen.getByLabelText('navigate-to-left'));
    expect(screen.getByLabelText('navigate-to-left')).toBeInTheDocument();
    expect(screen.getByLabelText('navigate-to-right')).toBeInTheDocument();

    // we are in the beginning (thumbs index 0 - 5 is shown)
    // navigate-to-left disappear, navigate-to-right appears
    fireEvent.click(screen.getByLabelText('navigate-to-left'));
    expect(screen.queryByLabelText('navigate-to-left')).not.toBeInTheDocument();
    expect(screen.getByLabelText('navigate-to-right')).toBeInTheDocument();
  });

  test('ThumbsRow - five participants - clicks', async () => {
    const { store } = await mockStore(5);
    const ids = store.getState().participants.ids;

    // 5 participants but 2 thumbs per window
    // navigate-to-right appears
    await render(<ThumbsRow thumbsPerWindow={2} thumbWidth={340} />, store);

    expect(screen.getByLabelText('navigate-to-right')).toBeInTheDocument();

    // default appearance
    expect(screen.getByTestId(`thumbsVideo-${ids[0]}`)).toBeInTheDocument();
    expect(screen.getByTestId(`thumbsVideo-${ids[1]}`)).toBeInTheDocument();
    expect(screen.queryByTestId(`thumbsVideo-${ids[2]}`)).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('navigate-to-right'));

    expect(screen.queryByTestId(`thumbsVideo-${ids[1]}`)).not.toBeInTheDocument();
    expect(screen.getByTestId(`thumbsVideo-${ids[2]}`)).toBeInTheDocument();
    expect(screen.getByTestId(`thumbsVideo-${ids[3]}`)).toBeInTheDocument();
    expect(screen.queryByTestId(`thumbsVideo-${ids[4]}`)).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('navigate-to-right'));

    expect(screen.queryByTestId(`thumbsVideo-${ids[2]}`)).not.toBeInTheDocument();
    expect(screen.getByTestId(`thumbsVideo-${ids[3]}`)).toBeInTheDocument();
    expect(screen.getByTestId(`thumbsVideo-${ids[4]}`)).toBeInTheDocument();
    expect(screen.queryByTestId(`thumbsVideo-${ids[5]}`)).not.toBeInTheDocument();
  });
});
