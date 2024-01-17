// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { DateTime } from '@opentalk/rest-api-rtk-query';
import React from 'react';

import { configureStore, render, screen, fireEvent } from '../../../../utils/testUtils';
import { TimeFilter } from './EventsPageHeader';
import EventsPageHeader from './EventsPageHeader';

describe('Events Page Header tests', () => {
  const onFilterChange = jest.fn();

  const filter = {
    timePeriod: TimeFilter.Month,
    timeMin: new Date().toTimeString() as DateTime,
    openInvitedMeeting: false,
    favoriteMeetings: false,
  };
  test('page will not crash', async () => {
    const { store } = configureStore();
    await render(<EventsPageHeader onFilterChange={onFilterChange} filter={filter} />, store);
    expect(screen.getAllByRole('button')).toHaveLength(6);
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  test('click on filter will call onFilterChange function', async () => {
    const { store } = configureStore();
    await render(<EventsPageHeader onFilterChange={onFilterChange} filter={filter} />, store);
    const favoriteMeeting = screen.getByTestId('favoriteMeeting');
    expect(favoriteMeeting).toBeInTheDocument();
    fireEvent.click(favoriteMeeting);
    expect(onFilterChange).toBeCalledTimes(1);
  });
});
