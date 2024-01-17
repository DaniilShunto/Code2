// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Event, InviteStatus, UserId, TimelessEvent } from '@opentalk/rest-api-rtk-query';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from '../../../store';
import { screen, render, fireEvent, eventMockedData } from '../../../utils/testUtils';
import OverviewCard from './OverviewCard';

const timeDependentMeeting = {
  ...eventMockedData,
  inviteStatus: InviteStatus.Pending,
  isTimeIndependent: false,
  startsAt: {
    datetime: '2022-08-31T16:47+00:00',
  },
  endsAt: {
    datetime: '2022-08-31T16:47+00:00',
  },
} as Event;

const mockedMeeting = { ...eventMockedData } as TimelessEvent;

const mockAcceptEventInvite = jest.fn();
const mockDeclineEventInvite = jest.fn();

jest.mock('../../../api/rest', () => ({
  ...jest.requireActual('../../../api/rest'),
  useMarkFavoriteEventMutation: () => [
    jest.fn(),
    {
      isLoading: false,
    },
  ],
  useUnmarkFavoriteEventMutation: () => [
    jest.fn(),
    {
      isLoading: false,
    },
  ],
  useDeleteEventMutation: () => [
    jest.fn(),
    {
      isLoading: false,
    },
  ],
  useAcceptEventInviteMutation: () => [
    mockAcceptEventInvite,
    {
      isLoading: false,
    },
  ],
  useDeclineEventInviteMutation: () => [
    mockDeclineEventInvite,
    {
      isLoading: false,
    },
  ],
  useGetMeQuery: () => ({
    data: {
      id: '3645d74d-9a4b-4cd4-9d9f-f1871c970167' as UserId,
    },
  }),
}));

describe('OverviewCard', () => {
  test('component is rendered without crashing', async () => {
    await render(
      <BrowserRouter>
        <Provider store={store}>
          <OverviewCard isMeetingCreator={false} event={mockedMeeting} />
        </Provider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('favorite-icon-visible')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'dashboard-home-join' })).toBeInTheDocument();
    expect(screen.getByLabelText('toolbar-button-more-tooltip-title')).toBeInTheDocument();
  });

  test('component is not marked as favorite', async () => {
    await render(
      <BrowserRouter>
        <Provider store={store}>
          <OverviewCard isMeetingCreator={false} event={{ ...mockedMeeting, isFavorite: false }} />
        </Provider>
      </BrowserRouter>
    );
    expect(screen.queryByTestId('favorite-icon-visible')).not.toBeInTheDocument();
  });

  test('pending invite displays right action buttons', async () => {
    await render(
      <BrowserRouter>
        <Provider store={store}>
          <OverviewCard isMeetingCreator={false} event={timeDependentMeeting} />
        </Provider>
      </BrowserRouter>
    );
    const acceptButton = screen.getByRole('button', { name: /global-accept/i });
    const declineButton = screen.getByRole('button', { name: /global-decline/i });
    expect(acceptButton).toBeInTheDocument();
    expect(declineButton).toBeInTheDocument();
  });

  test('click on pending invite accept button should triger right action', async () => {
    await render(
      <BrowserRouter>
        <Provider store={store}>
          <OverviewCard isMeetingCreator={false} event={timeDependentMeeting} />
        </Provider>
      </BrowserRouter>
    );
    const acceptButton = screen.getByRole('button', { name: /global-accept/i });
    expect(acceptButton).toBeInTheDocument();
    fireEvent.click(acceptButton);
    expect(mockAcceptEventInvite).toBeCalledTimes(1);
  });

  test('click on pending invite decline button should triger right action', async () => {
    await render(
      <BrowserRouter>
        <Provider store={store}>
          <OverviewCard isMeetingCreator={false} event={timeDependentMeeting} />
        </Provider>
      </BrowserRouter>
    );
    const declineButton = screen.getByRole('button', { name: /global-decline/i });
    expect(declineButton).toBeInTheDocument();
    fireEvent.click(declineButton);
    expect(mockDeclineEventInvite).toBeCalledTimes(1);
  });

  test('click on more menu should display popup with edit, fav and delete options for meeting creator', async () => {
    await render(
      <BrowserRouter>
        <Provider store={store}>
          <OverviewCard isMeetingCreator={true} event={mockedMeeting} />
        </Provider>
      </BrowserRouter>
    );
    const MoreMenu = screen.getByRole('button', { name: 'toolbar-button-more-tooltip-title' });
    expect(MoreMenu).toBeInTheDocument();
    fireEvent.mouseDown(MoreMenu);

    expect(screen.getByLabelText('dashboard-meeting-card-popover-update')).toBeInTheDocument();
    expect(screen.getByLabelText('dashboard-meeting-card-popover-remove')).toBeInTheDocument();
    expect(screen.queryByLabelText('dashboard-meeting-card-popover-add')).not.toBeInTheDocument();
    expect(screen.getByLabelText('dashboard-meeting-card-popover-delete')).toBeInTheDocument();
  });

  test('when user is not creator, meeting is marked as fav, click on more menu should display popup with remove favorite option', async () => {
    await render(
      <BrowserRouter>
        <Provider store={store}>
          <OverviewCard
            event={{ ...mockedMeeting, createdBy: { ...mockedMeeting.createdBy, id: '3645d74d' as UserId } }}
            isMeetingCreator={false}
          />
        </Provider>
      </BrowserRouter>
    );
    const MoreMenu = screen.getByRole('button', { name: 'toolbar-button-more-tooltip-title' });
    expect(MoreMenu).toBeInTheDocument();
    fireEvent.mouseDown(MoreMenu);

    expect(screen.getByLabelText('dashboard-meeting-card-popover-remove')).toBeInTheDocument();
    expect(screen.queryByLabelText('dashboard-meeting-card-popover-add')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('dashboard-meeting-card-popover-update')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('dashboard-meeting-card-popover-delete')).not.toBeInTheDocument();
  });
});
