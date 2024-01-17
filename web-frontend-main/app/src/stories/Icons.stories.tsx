// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Typography, SvgIcon, Grid as MuiGrid, styled, Container } from '@mui/material';
import * as openTalkIcons from '@opentalk/common/assets/icons';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

const Grid = styled(MuiGrid)({
  overflow: 'auto',
  alignItems: 'center',
  justifyContent: 'flex-start',
});

const Item = styled('div')(({ theme }) => ({
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '8.25rem',
  margin: theme.spacing(2),
  padding: theme.spacing(2.5, 2.5, 0),
  border: `1px solid ${theme.palette.secondary.light}`,
  borderRadius: theme.spacing(2),
}));

const NoLabelItem = styled(Item)(({ theme }) => ({
  width: '4.75rem',
  margin: theme.spacing(1.25),
  padding: theme.spacing(2.5),
}));

const TypographyContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(1.25, 0, 2.5),
}));

const colorOptions: Array<
  'inherit' | 'action' | 'disabled' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
> = ['inherit', 'action', 'disabled', 'primary', 'secondary', 'error', 'info', 'success', 'warning'];

export default {
  title: 'styleguide/Icons',
  component: SvgIcon,
  argTypes: {
    color: {
      options: colorOptions,
      control: { type: 'select' },
      defaultValue: 'default',
    },
  },
} as ComponentMeta<typeof SvgIcon>;

const IconNames = Object.keys(openTalkIcons).map((icon) => icon.replace('Icon', ''));

const IconsWithLabel: ComponentStory<typeof SvgIcon> = (props) => (
  <Container>
    {Object.values(openTalkIcons).map((Icon, index) => (
      <Item>
        <Icon key={index} {...props} />
        <TypographyContainer>
          <Typography variant="caption">{IconNames[index]}</Typography>
        </TypographyContainer>
      </Item>
    ))}
  </Container>
);

const Icons: ComponentStory<typeof SvgIcon> = (props) => (
  <Container>
    {Object.values(openTalkIcons).map((Icon, index) => (
      <NoLabelItem>
        <Icon key={index} {...props} />
      </NoLabelItem>
    ))}
  </Container>
);

export const Labels: ComponentStory<typeof SvgIcon> = (props) => (
  <Grid container>
    <IconsWithLabel {...props} />
  </Grid>
);
export const NoLabels: ComponentStory<typeof SvgIcon> = (props) => (
  <Grid container>
    <Icons {...props} />
  </Grid>
);
