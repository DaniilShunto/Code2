// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Stack } from '@mui/material';
import {
  DateTime,
  Email,
  EventId,
  InviteStatus,
  UserId,
  TimelessEvent,
  RoomId,
  Event,
} from '@opentalk/rest-api-rtk-query';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import OverviewCard from './OverviewCard';

export default {
  title: 'components/MeetingOverviewCard',
  component: OverviewCard,
} as ComponentMeta<typeof OverviewCard>;

const timeDependentMeeting = {
  id: uuidv4(),
  createdAt: '2022-04-06T13:57:38.793602Z',
  isFavorite: true,
  inviteStatus: 'pending',
  isTimeIndependent: false,
  createdBy: {
    firstname: 'Mace',
    lastname: 'Windu',
    displayName: 'Mace Windu',
  },
  startsAt: {
    datetime: '2022-08-31T16:47+00:00',
  },
  endsAt: {
    datetime: '2022-08-31T16:47+00:00',
  },
  title: 'Here is a very long test title for the event',
  room: {
    id: uuidv4() as RoomId,
  },
};

const timeIndependentMeeting = {
  id: uuidv4() as EventId,
  createdAt: '2022-04-06T13:57:38.793602Z' as DateTime,
  inviteStatus: 'accepted' as InviteStatus,
  isTimeIndependent: true,
  isFavorite: false,
  createdBy: {
    id: '12345' as UserId,
    firstname: 'Mace',
    lastname: 'Windu',
    displayName: 'Mace Windu',
    email: 'someemail@mail.com' as Email,
    title: '',
  },
  title: 'Here is a very long test title for the event',
  room: {
    id: uuidv4() as RoomId,
  },
  type: '',
  description: '',
  updatedBy: {
    displayName: 'Diego Barrera',
    email: 'test@heinlein-video.de' as Email,
    firstname: 'FirstTest',
    id: '3645d74d-9a4b-4cd4-9d9f-f1871c970167' as UserId,
    lastname: 'LastTest',
    title: '',
  },
  updatedAt: '2022-04-06T13:57:38.793602Z' as DateTime,
};

export const Basic: ComponentStory<typeof OverviewCard> = () => (
  <BrowserRouter>
    {
      <Stack width={'100%'}>
        <OverviewCard isMeetingCreator={false} event={timeIndependentMeeting as TimelessEvent} />
        <OverviewCard isMeetingCreator={false} event={timeDependentMeeting as Event} />
      </Stack>
    }
  </BrowserRouter>
);
