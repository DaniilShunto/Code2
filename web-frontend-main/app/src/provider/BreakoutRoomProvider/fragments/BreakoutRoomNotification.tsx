// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Stack, Typography, Box, styled } from '@mui/material';
import { notifications, SnackbarKey, SnackbarMessage, SnackbarContent } from '@opentalk/common';
import { isEmpty } from 'lodash';
import React, { useState } from 'react';

import Countdown from './Countdown';

export interface Action {
  variant?: 'text' | 'outlined' | 'contained';
  text: string;
  onClick: () => void;
}

interface CountDown {
  duration: number;
  action: () => void;
}

interface IJoinNotificationProps {
  message: SnackbarMessage;
  iconComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  actions: Action[];
  snackbarKey: SnackbarKey;
  countdown?: CountDown;
}

const StyledSnackbarContent = styled(SnackbarContent)(({ theme }) => ({
  background: theme.palette.info.dark,
  padding: theme.spacing(1, 2),
  borderRadius: theme.borderRadius.medium,
}));

const BreakoutRoomNotification = React.forwardRef<HTMLDivElement, IJoinNotificationProps>(
  ({ message, actions, iconComponent: Icon, countdown, snackbarKey }, ref) => {
    const [alreadyClicked, setAlreadyClicked] = useState(false);
    const handleOnClick = (onClick: () => void) => {
      !alreadyClicked && onClick();
      setAlreadyClicked(true);
      notifications.close(snackbarKey);
    };

    const handleCountdownEnds = () => {
      if (countdown !== undefined) {
        countdown.action();
        notifications.close(snackbarKey);
      }
    };

    const renderActions = () =>
      actions.map(({ text, onClick, variant }, index) => (
        <Button onClick={() => handleOnClick(onClick)} variant={variant} key={index}>
          {text}
        </Button>
      ));

    return (
      <StyledSnackbarContent ref={ref} role="alert">
        <Stack spacing={1}>
          <Box display="flex" alignItems="center">
            <Icon width="2rem" height="2rem" />
            <Typography ml={2}>{message}</Typography>
          </Box>
          <Box display="flex" pl={6}>
            {renderActions()}
            {!isEmpty(countdown) && (
              <Countdown duration={countdown?.duration} onCountdownEnds={handleCountdownEnds} ml={1.5} />
            )}
          </Box>
        </Stack>
      </StyledSnackbarContent>
    );
  }
);

export default BreakoutRoomNotification;
