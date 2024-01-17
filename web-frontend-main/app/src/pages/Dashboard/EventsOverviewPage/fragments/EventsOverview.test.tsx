// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import React from 'react';

import { configureStore, eventMockedData, render, screen } from '../../../../utils/testUtils';
import { MeetingsProp } from '../EventsOverviewPage';
import EventsOverview from './EventsOverview';

const mockEvents = [
  {
    title: 'Time Independent Meetings',
    events: [{ ...eventMockedData }],
  },
];

describe('EventsOverview', () => {
  test('page will not crash', async () => {
    const { store } = configureStore();
    await render(<EventsOverview entries={mockEvents as MeetingsProp[]} expandAccordion={''} />, store);
    expect(screen.getAllByTestId('EventAccordion')).toHaveLength(1);
  });

  test('Accordion Title should be in the document', async () => {
    const { store } = configureStore();
    await render(<EventsOverview entries={mockEvents as MeetingsProp[]} expandAccordion={'false'} />, store);
    expect(screen.getByText('Time Independent Meetings')).toBeInTheDocument();
  });
});
