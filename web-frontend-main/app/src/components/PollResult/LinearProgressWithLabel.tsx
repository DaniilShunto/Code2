// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, LinearProgress, LinearProgressProps, Typography } from '@mui/material';
import React from 'react';

const LinearProgressWithLabel = (props: LinearProgressProps & { label: string; absolute: number; sum: number }) => {
  const value = (props.absolute * 100) / props.sum || 0;
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <Typography variant="body2" color="textPrimary">
          {props.label}
        </Typography>
      </Box>
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} value={value} />
      </Box>
      <Box minWidth={60}>
        <Typography variant="body2" color="textSecondary">
          {`${Math.round(value)}%`} ({`${props.absolute}/${props.sum}`})
        </Typography>
      </Box>
    </Box>
  );
};
export default LinearProgressWithLabel;
