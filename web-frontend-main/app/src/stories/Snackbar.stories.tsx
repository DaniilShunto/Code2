// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Container, Divider } from '@mui/material';
import { notifications, ISnackActionsProps, notificationAction, VariantType } from '@opentalk/common';
import { SnackbarProvider } from '@opentalk/common';
import { ComponentMeta } from '@storybook/react';
import React from 'react';

const variantOptions: Array<VariantType> = ['error', 'success', 'warning', 'info'];

export default {
  title: 'components/Snackbar',
  component: Button,
  argTypes: {
    msg: {
      type: { name: 'string', required: false },
      defaultValue: 'Custom messsage, set actionBtnText / cancelBtnText to display btns',
    },
    variant: {
      options: variantOptions,
      control: { type: 'select' },
      defaultValue: 'inherit',
    },
    actionBtnText: {
      type: { name: 'string', required: false },
      defaultValue: '',
    },
    cancelBtnText: {
      type: { name: 'string', required: false },
      defaultValue: '',
    },
  },
} as ComponentMeta<typeof SnackbarProvider>;

export const Basic = ({ msg, variant, actionBtnText, cancelBtnText }: ISnackActionsProps) => (
  <SnackbarProvider>
    <Container>
      <Button
        variant={'contained'}
        onClick={() => {
          notificationAction({
            msg: msg,
            variant: variant,
            actionBtnText: actionBtnText,
            cancelBtnText: cancelBtnText,
            onAction: () => alert('Callback fnc to handle click, User Agree'),
            onCancel: () => alert('Callback fnc to handle click, User Dismissed'),
          });
        }}
      >
        Custom Action Notification
      </Button>
      <Divider sx={{ borderColor: 'white', my: 2 }} />
      <Button
        variant={'contained'}
        color={'error'}
        onClick={() => {
          notifications.error(`Test error context: ${new Error('Test Error')}`);
        }}
      >
        Show Error Notifications
      </Button>
      <Divider sx={{ borderColor: 'white', my: 2 }} />
      <Button
        variant={'contained'}
        color={'warning'}
        onClick={() => {
          notifications.warning(`Ooops...you just triggered a warning.`);
        }}
      >
        Show Warning Notifications
      </Button>
      <Divider sx={{ borderColor: 'white', my: 2 }} />
      <Button
        variant={'contained'}
        color={'info'}
        onClick={() => {
          notifications.info(`This is an info message.`);
        }}
      >
        Show Info Notifications
      </Button>
      <Divider sx={{ borderColor: 'white', my: 2 }} />
      <Button
        variant={'contained'}
        color={'success'}
        onClick={() => {
          notifications.success(`You just triggered this notification. Success!`);
        }}
      >
        Show Success Notifications
      </Button>
      <Divider sx={{ borderColor: 'white', my: 2 }} />
      <Button
        variant={'contained'}
        onClick={() => {
          notificationAction({
            msg: msg,
            variant: variant,
            actionBtnText: actionBtnText,
            cancelBtnText: cancelBtnText,
            onAction: () => alert('Callback fnc to handle click, User Agree'),
            onCancel: () => alert('Callback fnc to handle click, User Dismissed'),
          });
        }}
      >
        Custom Action Notification
      </Button>
    </Container>
  </SnackbarProvider>
);
