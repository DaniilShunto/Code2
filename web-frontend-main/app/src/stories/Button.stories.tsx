// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import { HomeIcon, CameraOnIcon } from '@opentalk/common';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

export default {
  title: 'components/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

export const Basic: ComponentStory<typeof Button> = () => (
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Normal</TableCell>
          <TableCell>Disabled</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>
            <Button>{`Contained Primary`}</Button>
          </TableCell>
          <TableCell>
            <Button disabled>{`Contained Primary`}</Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Button size={'large'} startIcon={<CameraOnIcon />}>
              {`Contained Primary`}
            </Button>
          </TableCell>
          <TableCell>
            <Button size={'large'} startIcon={<CameraOnIcon />} disabled>
              {`Contained Primary`}
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Button color={'secondary'}>{`Contained Secondary`}</Button>
          </TableCell>
          <TableCell>
            <Button color={'secondary'} disabled>{`Contained Secondary`}</Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Button color={'secondary'} size={'large'} startIcon={<HomeIcon />}>
              {`Contained Secondary`}
            </Button>
          </TableCell>
          <TableCell>
            <Button color={'secondary'} size={'large'} startIcon={<HomeIcon />} disabled>
              {`Contained Secondary`}
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Button variant={'outlined'} color={'secondary'}>{`Outlined Secondary`}</Button>
          </TableCell>
          <TableCell>
            <Button variant={'outlined'} color={'secondary'} disabled>{`Outlined Secondary`}</Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Button variant={'text'} color={'secondary'}>{`Text Secondary`}</Button>
          </TableCell>
          <TableCell>
            <Button variant={'text'} color={'secondary'} disabled>{`Text Secondary`}</Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <IconButton color={'primary'}>
              <HomeIcon />
            </IconButton>
          </TableCell>
          <TableCell>
            <IconButton color={'primary'} disabled>
              <HomeIcon />
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <IconButton color={'secondary'}>
              <HomeIcon />
            </IconButton>
          </TableCell>
          <TableCell>
            <IconButton color={'secondary'} disabled>
              <HomeIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);
