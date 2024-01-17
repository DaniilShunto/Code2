// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import { Event } from '@opentalk/rest-api-rtk-query';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';

import { eventMockedData } from '../../../utils/testUtils';
import StandardCard from './StandardCard';

export default {
  title: 'components/MeetingCardStandard',
  component: StandardCard,
} as ComponentMeta<typeof StandardCard>;

const dummyMeetingData = {
  event: eventMockedData as Event,
  highlighted: false,
  isMeetingCreator: true,
};

const Container = styled('div')({
  display: 'grid',
  gap: '2rem',
  width: '100%',
  gridTemplateRows: 'repeat(4, auto)',
});

export const Basic: ComponentStory<typeof StandardCard> = () => (
  <BrowserRouter>
    <Container sx={{ overflow: 'auto' }}>
      <StandardCard {...dummyMeetingData} />
      <StandardCard {...dummyMeetingData} event={{ ...dummyMeetingData.event, isFavorite: true }} />
      <StandardCard {...dummyMeetingData} isMeetingCreator={false} />
      <StandardCard {...dummyMeetingData} highlighted={true} />
    </Container>
  </BrowserRouter>
);
