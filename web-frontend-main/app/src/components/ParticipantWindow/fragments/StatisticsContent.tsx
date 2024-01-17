// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import SuspenseLoading from '../../../commonComponents/SuspenseLoading';
import { useAppSelector } from '../../../hooks';
import { MediaDescriptor } from '../../../modules/WebRTC';
import { NetworkEndpoint } from '../../../modules/WebRTC/Statistics/CandidatePairState';
import { selectStatsById } from '../../../store/slices/connectionStatsSlice';
import { formatBitRate } from '../../../utils/numberUtils';

const ContentContainer = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'auto auto',
  padding: theme.spacing(1),
}));

export const EndpointInfo = ({ endpoint }: { endpoint?: NetworkEndpoint }) => {
  const { t } = useTranslation();

  if (endpoint === undefined) {
    return <span>'-'</span>;
  }
  const address = endpoint.address || t('statistics-value-redacted');
  return (
    <>
      {`${address}:${endpoint.port} (${endpoint.protocol})`}
      {endpoint.networkType && ` ${endpoint.networkType}`}
    </>
  );
};

const MILLISECONDS_PER_SECOND = 1000;

export const StatisticsContent = ({ descriptor }: { descriptor: MediaDescriptor }) => {
  const stats = useAppSelector(selectStatsById(descriptor));
  const { t } = useTranslation();
  if (stats === undefined) {
    return <SuspenseLoading />;
  }

  const { mediaStream, connection } = stats;
  const { bitRate, frameRate, packetLoss, frameHeight, frameWidth, jitter, codingTime } = mediaStream;

  // The latency and jitter value may default to 0, which is invalid.
  // We use 0.5ms as threshold for validity.
  // We expect both to be a couple of milliseconds under good conditions.
  const validJitter =
    jitter !== undefined && jitter > 0.5 * MILLISECONDS_PER_SECOND && Math.round(jitter * MILLISECONDS_PER_SECOND);

  const validLatency =
    connection.avgRTT !== undefined &&
    connection.avgRTT > 0.5 * MILLISECONDS_PER_SECOND &&
    Math.round((connection.avgRTT / 2) * MILLISECONDS_PER_SECOND);

  const validPacketLoss = packetLoss !== undefined && Math.round(packetLoss * 100);

  return (
    <ContentContainer>
      {frameHeight && frameWidth && (
        <>
          <Typography variant={'body2'}>{`${t('statistics-video')}: `}</Typography>
          <Typography variant={'body2'} align={'right'}>
            {`${frameWidth}x${frameHeight}`}
          </Typography>
        </>
      )}
      <Typography variant={'body2'}>{`${t('statistics-rate')}: `}</Typography>
      <Typography variant={'body2'} align={'right'}>
        {formatBitRate(bitRate)}
      </Typography>
      <Typography variant={'body2'}>{`${t('statistics-fps')}: `}</Typography>
      <Typography variant={'body2'} align={'right'}>
        {frameRate ? `${Math.round(frameRate)} FPS` : '-'}
      </Typography>
      <Typography variant={'body2'}>{`${t('statistics-jitter')}: `}</Typography>
      <Typography variant={'body2'} align={'right'}>
        {validJitter ? `${validJitter} ms` : '-'}
      </Typography>
      <Typography variant={'body2'}>{`${t('statistics-latency')}: `}</Typography>
      <Typography variant={'body2'} align={'right'}>
        {validLatency ? `${validLatency} ms` : '-'}
      </Typography>
      <Typography variant={'body2'}>{`${t('statistics-packets-lost')}: `}</Typography>
      <Typography variant={'body2'} align={'right'}>
        {validPacketLoss ? `${validPacketLoss} % ` : '-'}
      </Typography>
      {codingTime !== undefined && (
        <>
          <Typography variant={'body2'}>{`${t('statistics-decode-time')}: `}</Typography>
          <Typography variant={'body2'} align={'right'}>
            {Math.round(codingTime * 1000)} ms
          </Typography>
        </>
      )}
      <Typography variant={'body2'}>{`${t('statistics-local-network-endpoint')}: `}</Typography>
      <Typography variant={'body2'} align={'left'}>
        <EndpointInfo endpoint={connection.localEndpoint} />
      </Typography>
      <Typography variant={'body2'}>{`${t('statistics-remote-network-endpoint')}: `}</Typography>
      <Typography variant={'body2'} align={'left'}>
        <EndpointInfo endpoint={connection.remoteEndpoint} />
      </Typography>
    </ContentContainer>
  );
};
