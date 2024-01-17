// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { PopperProps, Popper, useMediaQuery, Stack, styled, Typography, CircularProgress } from '@mui/material';
import { WarningIcon } from '@opentalk/common';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useQuickStartUrl } from '../../../hooks/useQuickStartUrl';

const MIDDLE_SCREEN_HEIGHT_RATIO = 0.92;
const BIG_SCREEN_HEIGHT_RATIO = 0.8;
const WIDTH_TO_HEIGHT_RATIO = 1.5;

const StatusMessageContainer = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'heightInPx' && prop !== 'widthInPx',
})<{
  heightInPx: number;
  widthInPx: number;
}>(({ theme, heightInPx, widthInPx }) => ({
  width: widthInPx.toString() + 'px',
  height: heightInPx.toString() + 'px',
  background: theme.palette.common.white,
  color: theme.palette.common.black,
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
}));

interface MessageProps {
  heightInPx: number;
  widthInPx: number;
  message: string;
  status: 'error' | 'loading';
}

const StatusMessage = (props: MessageProps) => {
  const { message, heightInPx, widthInPx, status } = props;
  return (
    <StatusMessageContainer heightInPx={heightInPx} widthInPx={widthInPx} spacing={1}>
      <Typography>{message}</Typography>
      {status === 'error' ? <WarningIcon fontSize="large" color="primary" /> : null}
      {status === 'loading' ? <CircularProgress /> : null}
    </StatusMessageContainer>
  );
};

const QuickStartPopper = (props: PopperProps) => {
  const { t } = useTranslation();
  const isScreenHeightBig = useMediaQuery('(min-height:750px)');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMissing, setIsMissing] = useState(false);
  const { conferenceQuickStartUrl } = useQuickStartUrl();

  // A very rough adjustement of the quick start scale
  // Good enough for the MVP. The responsivness can be improved in the future
  const calculateViewRatio = () => {
    return isScreenHeightBig ? BIG_SCREEN_HEIGHT_RATIO : MIDDLE_SCREEN_HEIGHT_RATIO;
  };
  const imgHeight = Math.floor(window.innerHeight) * calculateViewRatio();
  const imgWidth = Math.min(window.innerWidth * calculateViewRatio(), imgHeight * WIDTH_TO_HEIGHT_RATIO);

  // Show file missing message in case the url link is undefined for some reason
  useEffect(() => {
    if (!conferenceQuickStartUrl) {
      setIsMissing(true);
    } else {
      setIsMissing(false);
    }
  }, [conferenceQuickStartUrl]);

  return (
    <Popper {...props} placement="left-start">
      <img
        height={imgHeight}
        width={imgWidth}
        src={conferenceQuickStartUrl}
        alt={t('conference-quick-start-title')}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsMissing(true)}
        style={isLoaded ? {} : { display: 'none' }}
      ></img>
      {!isLoaded && !isMissing && (
        <StatusMessage
          message={t('quick-start-loading')}
          heightInPx={imgHeight}
          widthInPx={imgWidth}
          status="loading"
        />
      )}
      {isMissing && (
        <StatusMessage message={t('quick-start-error')} heightInPx={imgHeight} widthInPx={imgWidth} status="error" />
      )}
    </Popper>
  );
};

export default QuickStartPopper;
