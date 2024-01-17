// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Container as MuiContainer, Grid, Stack, styled, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import arrowImage from '../../assets/images/arrow-illustration.png';
import LocalVideo from '../../components/LocalVideo';
import { useAppSelector } from '../../hooks';
import { selectFeatures } from '../../store/slices/configSlice';
import { selectVideoEnabled } from '../../store/slices/mediaSlice';
import QuickStart from '../QuickStart';
import SpeedTest from '../SpeedTest';
import { EchoPlayBack } from './fragments/EchoPlayback';
import { SelfTestToolbar } from './fragments/SelfTestToolbar';

const SelfTestContainer = styled('div')(() => ({
  position: 'relative',
  padding: 0,
  width: '100%',
  maxWidth: '1200px',

  //The blur should be part of the theme and handled globally
  backdropFilter: 'blur(100px)',
  WebkitBackdropFilter: 'blur(100px)',
  background: `rgba(0, 22, 35, 0.5) url(${arrowImage}) no-repeat 77% 67%`,
  backgroundSize: '10rem',
}));

const SpeedTestContainer = styled(MuiContainer)(({ theme }) => ({
  top: 0,
  left: 0,
  position: 'relative',
  padding: theme.spacing(6),
  [theme.breakpoints.up('md')]: {
    position: 'absolute',
  },
}));

const BottomContainer = styled(MuiContainer)(({ theme }) => ({
  padding: theme.spacing(6),
  bottom: 0,
  left: 0,
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    position: 'absolute',
  },
}));

const MonitorContainer = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  aspectRatio: '16/9',

  '& h1, p': {
    color: theme.palette.secondary.contrastText,
  },
}));
interface SelftestProps {
  children: ReactNode;
  actionButton?: ReactNode;
  title?: string;
}

const SelfTest = ({ children, actionButton, title }: SelftestProps) => {
  const videoEnabled = useAppSelector(selectVideoEnabled);
  const { joinWithoutMedia } = useAppSelector(selectFeatures);
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <SelfTestContainer>
      <Stack direction="row-reverse">
        <QuickStart variant="lobby" />
        <SpeedTestContainer>
          <SpeedTest />
        </SpeedTestContainer>
      </Stack>
      <MonitorContainer>
        {videoEnabled ? (
          <LocalVideo noRoundedCorners hideUserName />
        ) : (
          <>
            {title && (
              <Typography
                variant="h2"
                textAlign={'center'}
                color={theme.palette.common.white}
                marginBottom={theme.spacing(5)}
              >
                {t('joinform-room-title', { title })}
              </Typography>
            )}
            <Typography variant="h1" textAlign={'center'} fontSize={'2.9rem'} lineHeight={'2.9rem'} mb={2}>
              {t('selftest-header')}
            </Typography>
            <Typography textAlign={'center'} fontSize={'1.37rem'}>
              {joinWithoutMedia ? t('selftest-body-do-test') : t('selftest-body')}
            </Typography>
          </>
        )}
        <EchoPlayBack />
      </MonitorContainer>
      <BottomContainer>
        <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
          <Grid item>{children}</Grid>
          <Grid item>
            <SelfTestToolbar actionButton={actionButton} />
          </Grid>
        </Grid>
      </BottomContainer>
    </SelfTestContainer>
  );
};

export default SelfTest;
