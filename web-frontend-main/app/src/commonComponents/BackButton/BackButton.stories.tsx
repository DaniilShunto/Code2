// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Container } from '@mui/material';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import BackButton from './BackButton';

const colorOptions: Array<'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | undefined> = [
  undefined,
  'primary',
  'secondary',
  'success',
  'error',
  'info',
  'warning',
];

export default {
  title: 'components/BackButton',
  component: BackButton,
  parameters: {
    docs: {
      description: {
        component:
          'Icons and variants cannot be set on BackButton, all other props can be found in the Mui-Documentation -> https://mui.com/api/button/',
      },
    },
    controls: { include: ['children', 'onClick', 'color', 'disabled', 'fullWidth', 'size'] },
  },
  argTypes: {
    children: {
      type: { name: 'string' },
      defaultValue: 'Lorem ipsum',
    },
    onClick: {
      action: 'clicked',
      table: {
        disable: true,
      },
    },
    color: {
      options: colorOptions,
      control: { type: 'select' },
      defaultValue: undefined,
    },
    disabled: {
      options: [true, false],
      control: { type: 'radio' },
      defaultValue: false,
    },
    fullWidth: {
      options: [true, false],
      control: { type: 'radio' },
      defaultValue: false,
    },
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
      defaultValue: 'medium',
    },
  },
} as ComponentMeta<typeof BackButton>;

export const Basic: ComponentStory<typeof BackButton> = ({ children, onClick, color, disabled, fullWidth, size }) => (
  <Container>
    <BackButton color={color} onClick={onClick} size={size} disabled={disabled} fullWidth={fullWidth}>
      {children}
    </BackButton>
  </Container>
);
