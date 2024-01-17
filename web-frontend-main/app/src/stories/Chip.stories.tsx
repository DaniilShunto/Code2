// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Avatar, Chip, Container } from '@mui/material';
import { CloseIcon } from '@opentalk/common';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import hansolo from '../assets/logo.svg';

export default {
  title: 'components/Chip',
  component: Chip,
} as ComponentMeta<typeof Chip>;

export const Basic: ComponentStory<typeof Chip> = () => (
  <Container>
    <Chip
      label={'Luisa Grauweiler'}
      onDelete={() => alert('delete')}
      deleteIcon={<CloseIcon />}
      avatar={<Avatar src={hansolo} />}
    />
  </Container>
);
