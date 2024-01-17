// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Container, Divider, Typography as MuiTypography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

const variantOptions: Array<Variant> = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'subtitle1',
  'subtitle2',
  'body1',
  'body2',
  'caption',
  'button',
  'overline',
];

const alignOptions: Array<'center' | 'inherit' | 'justify' | 'left' | 'right'> = [
  'center',
  'inherit',
  'justify',
  'left',
  'right',
];

export default {
  title: 'styleguide/Typography',
  component: MuiTypography,
  argTypes: {
    children: {
      type: { name: 'string', required: false },
      name: 'text',
      defaultValue:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam',
    },
    variant: {
      options: variantOptions,
      control: { type: 'select' },
      defaultValue: 'body1',
    },
    color: {
      options: ['primary', 'secondary', 'default'],
      control: { type: 'radio' },
      defaultValue: 'default',
    },
    align: {
      options: alignOptions,
      control: { type: 'select' },
      defaultValue: 'inherit',
    },
    gutterBottom: {
      options: [true, false],
      control: { type: 'radio' },
      defaultValue: false,
    },
    noWrap: {
      options: [true, false],
      control: { type: 'radio' },
      defaultValue: false,
    },
    paragraph: {
      options: [true, false],
      control: { type: 'radio' },
      defaultValue: false,
    },
  },
} as ComponentMeta<typeof MuiTypography>;

export const Typography: ComponentStory<typeof MuiTypography> = (props) => (
  <Container>
    <MuiTypography variant="h1">Headline 1</MuiTypography>
    <MuiTypography variant="h2">Headline 2</MuiTypography>
    <MuiTypography variant="body1">Body 1</MuiTypography>
    <MuiTypography variant="body2">Body 2</MuiTypography>
    <MuiTypography variant="caption">Caption</MuiTypography>
    <Divider sx={{ borderColor: 'white', my: 2 }} />
    <MuiTypography {...props} />
  </Container>
);
