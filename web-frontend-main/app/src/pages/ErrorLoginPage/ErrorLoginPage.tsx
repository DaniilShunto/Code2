// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Container as MuiContainer, CssBaseline, Stack, styled, ThemeProvider, useTheme } from '@mui/material';
import { WarningIcon } from '@opentalk/common';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import { createOpenTalkTheme } from '../../assets/themes/opentalk';
import Error from '../../commonComponents/Error';
import { useAppDispatch } from '../../hooks';
import { hangUp } from '../../store/commonActions';
import LobbyTemplate from '../../templates/LobbyTemplate';

const StyledLogoIcon = styled(Logo)({
  height: '2rem',
  width: '9rem',
  fill: 'white',
});

const Container = styled(MuiContainer)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  color: theme.palette.common.white,
}));

interface ErrorLoginProps {
  error: Error;
}

const ErrorLoginPage = ({ error }: ErrorLoginProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hangUp());
  }, [dispatch]);

  return (
    <ThemeProvider theme={createOpenTalkTheme()}>
      <CssBaseline />
      <LobbyTemplate blur>
        <Container>
          <Stack spacing={8} alignItems="center">
            <WarningIcon fill={theme.palette.common.white} sx={{ width: '6rem', height: '6rem' }} />
            {error && <Error title={t(`${error.name}`)} description={t(`${error.message}`)} />}
            <StyledLogoIcon />
          </Stack>
        </Container>
      </LobbyTemplate>
    </ThemeProvider>
  );
};

export default ErrorLoginPage;
