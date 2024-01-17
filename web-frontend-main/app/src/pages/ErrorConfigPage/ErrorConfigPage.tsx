// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Container as MuiContainer, CssBaseline, Stack, styled, ThemeProvider, useTheme } from '@mui/material';
import { WarningIcon } from '@opentalk/common';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import { createOpenTalkTheme } from '../../assets/themes/opentalk';
import Error from '../../commonComponents/Error';
import LobbyTemplate from '../../templates/LobbyTemplate';

const StyledLogoIcon = styled(Logo)({
  height: '2rem',
  width: '9rem',
  fill: 'white',
});

const CustomStack = styled(Stack)({
  maxWidth: '35rem',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const Container = styled(MuiContainer)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  color: theme.palette.common.white,
}));

const ErrorConfigPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ThemeProvider theme={createOpenTalkTheme()}>
      <CssBaseline />
      <LobbyTemplate blur>
        <Container>
          <CustomStack spacing={8}>
            <WarningIcon fill={theme.palette.common.white} sx={{ width: '6rem', height: '6rem' }} />

            <Error title={t('error-config-title')} description={t('error-config-message')} />

            <StyledLogoIcon />
          </CustomStack>
        </Container>
      </LobbyTemplate>
    </ThemeProvider>
  );
};

export default ErrorConfigPage;
