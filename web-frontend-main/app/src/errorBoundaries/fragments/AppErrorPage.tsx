// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Button,
  Collapse,
  Container as MuiContainer,
  CssBaseline,
  styled,
  ThemeProvider,
  Typography,
  Stack,
  useTheme,
} from '@mui/material';
import { ArrowDownIcon, ArrowUpIcon, WarningIcon } from '@opentalk/common';
import React, { ErrorInfo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import { createOpenTalkTheme } from '../../assets/themes/opentalk';
import Error from '../../commonComponents/Error';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { hangUp } from '../../store/commonActions';
import { selectErrorReportEmail } from '../../store/slices/configSlice';
import LobbyTemplate from '../../templates/LobbyTemplate';

const DiagnosticDataElement = styled('div')({
  maxHeight: '15em',
  width: '100%',
  overflow: 'auto',
});

const StyledLogoIcon = styled(Logo)({
  height: '2rem',
  width: '9rem',
  fill: 'white',
});

const CustomStack = styled(Stack)({
  maxWidth: '80%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const CollapseButton = styled(Button)({
  boxShadow: 'none',
  backgroundColor: 'transparent',
  '&:hover': {
    boxShadow: 'none',
    backgroundColor: 'transparent',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: 'transparent',
  },
});

const Container = styled(MuiContainer)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  color: theme.palette.common.white,
}));

interface AppErrorProps {
  error: Error;
  errorInfo?: ErrorInfo;
}

const AppErrorPage = ({ errorInfo, error }: AppErrorProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [collapsed, setCollapsed] = useState(true);
  const email = useAppSelector(selectErrorReportEmail);
  const dispatch = useAppDispatch();

  const diagnosticData = {
    cause: error.cause,
    name: error.name,
    message: error.message,
    stack: error.stack,
    errorInfo: errorInfo,
  };

  useEffect(() => {
    dispatch(hangUp());
  }, [dispatch]);

  return (
    <ThemeProvider theme={createOpenTalkTheme()}>
      <CssBaseline />
      <LobbyTemplate blur>
        <Container>
          <CustomStack spacing={8}>
            <WarningIcon fill={theme.palette.common.white} sx={{ width: '6rem', height: '6rem' }} />

            <Stack spacing={1}>
              <Error
                title={t('show-diagnostic-data-title')}
                description={t('show-diagnostic-data-message', { errorReportEmail: email })}
              />

              {collapsed ? (
                <CollapseButton
                  disableRipple
                  size={'large'}
                  startIcon={<ArrowDownIcon />}
                  variant={'text'}
                  color={'primary'}
                  onClick={() => {
                    setCollapsed(!collapsed);
                  }}
                >
                  {t('show-diagnostic-data-button')}
                </CollapseButton>
              ) : (
                <CollapseButton
                  disableRipple
                  size={'large'}
                  startIcon={<ArrowUpIcon />}
                  variant={'text'}
                  color={'primary'}
                  onClick={() => {
                    setCollapsed(!collapsed);
                  }}
                >
                  {t('hide-diagnostic-data-button')}
                </CollapseButton>
              )}
              <DiagnosticDataElement>
                <Collapse orientation="vertical" in={!collapsed}>
                  <Typography textAlign={'left'} variant="body2" color={'inherit'}>
                    {JSON.stringify(diagnosticData, null, '\t')}
                  </Typography>
                </Collapse>
              </DiagnosticDataElement>
            </Stack>

            <Button
              href={`mailto:?to=${email}&body=${encodeURIComponent(
                JSON.stringify(diagnosticData)
              )}&subject=${'OpenTalk diagnostic data'}`}
            >
              {t('send-error-button-text')}
            </Button>

            <StyledLogoIcon />
          </CustomStack>
        </Container>
      </LobbyTemplate>
    </ThemeProvider>
  );
};

export default AppErrorPage;
