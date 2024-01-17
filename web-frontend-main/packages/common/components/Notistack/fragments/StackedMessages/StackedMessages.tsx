// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

import { Stack } from '@mui/material';
import React from 'react';

interface StackedMessagesProps {
  messages: string[];
}

export const StackedMessages = ({ messages }: StackedMessagesProps) => {
  return (
    <Stack spacing={1}>
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </Stack>
  );
};

export const createStackedMessages = (messages: string[]) => {
  return <StackedMessages messages={messages} />;
};
