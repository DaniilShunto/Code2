// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Table, TableCell, TableContainer, TableRow } from '@mui/material';
import { RoomId } from '@opentalk/rest-api-rtk-query';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';

import FavoriteMeetingsCard from './FavoriteMeetingsCard';

export default {
  title: 'components/FavoriteMeetingsCard',
  component: FavoriteMeetingsCard,
} as ComponentMeta<typeof FavoriteMeetingsCard>;

const dummyMeetings = [
  { subject: 'Lorem ipsum dolor sit.', roomId: '3445t-wre-gd-gtrgear-ggszr' as RoomId },
  { subject: 'Lorem ipsum dolor sit amet.', roomId: '3445twre-gtrfg566-7arggszr' as RoomId },
  { subject: 'Ipsum dolor.', roomId: '0000-00-00-0-0-5' as RoomId },
  { subject: 'Amet consectetur adipisicing.', roomId: '3445tw-gfd-regtrge-arggszr' as RoomId },
  { subject: 'Dolor Lorem, ipsum.', roomId: '344-5twregtr-gearggszr-4355' as RoomId },
  { subject: 'Ipsum dolor sit.', roomId: '9694-45twre-gtrgearg-gszr-ewds43' as RoomId },
];

export const Basic: ComponentStory<typeof FavoriteMeetingsCard> = () => (
  <BrowserRouter>
    <TableContainer>
      <Table>
        <TableRow>
          <TableCell>
            <FavoriteMeetingsCard meetings={dummyMeetings} />
          </TableCell>
          <TableCell>
            <FavoriteMeetingsCard meetings={[]} />
          </TableCell>
        </TableRow>
      </Table>
    </TableContainer>
  </BrowserRouter>
);
