// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Stack, Typography, useTheme } from '@mui/material';
import React from 'react';

interface ErrorProps {
  title: string;
  description?: string;
}

const Error = ({ title, description }: ErrorProps) => {
  const theme = useTheme();

  return (
    <Stack textAlign={'center'} spacing={2}>
      <Typography variant="h5" component={'h1'} color={theme.palette.error.contrastText}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color={theme.palette.error.contrastText}>
          {description}
        </Typography>
      )}
    </Stack>
  );
};

export default Error;
