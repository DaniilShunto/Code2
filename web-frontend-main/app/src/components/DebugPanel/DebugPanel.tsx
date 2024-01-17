// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { AppBar, Stack, Typography } from '@mui/material';
import { ParticipantId } from '@opentalk/common';
import { EntityState } from '@reduxjs/toolkit';
import i18next, { t } from 'i18next';
import React, { useMemo } from 'react';

import { useAppSelector } from '../../hooks';
import { StatsEvent } from '../../modules/WebRTC/Statistics/ConnectionStats';
import { selectStats, State } from '../../store/slices/connectionStatsSlice';
import { selectOurUuid } from '../../store/slices/userSlice';

const aggregateTimeline = (reports: StatsEvent[]) => {
  const statsAggregate = reports.reduce(
    (agg, { connection, inbound, outbound }: StatsEvent) => ({
      connectionBitRateUp: agg.connectionBitRateUp + (connection.bitRateUp || 0),
      connectionBitRateDown: agg.connectionBitRateDown + (connection.bitRateDown || 0),
      inboundBitRate: agg.inboundBitRate + (inbound?.bitRate || 0),
      inboundMaxBitRate: Math.max(agg.inboundMaxBitRate, inbound?.bitRate || 0),
      outboundBitRate: agg.outboundBitRate + (outbound?.bitRate || 0),
      outboundMaxBitRate: Math.max(agg.outboundMaxBitRate, outbound?.bitRate || 0),
      connectionCount: agg.connectionCount + (connection ? 1 : 0),
      inboundCount: agg.inboundCount + (inbound ? 1 : 0),
      outboundCount: agg.outboundCount + (outbound ? 1 : 0),
    }),
    {
      connectionBitRateUp: 0,
      connectionBitRateDown: 0,
      inboundBitRate: 0,
      inboundMaxBitRate: 0,
      outboundBitRate: 0,
      outboundMaxBitRate: 0,
      connectionCount: 0,
      inboundCount: 0,
      outboundCount: 0,
    }
  );

  return {
    connection: {
      avgUp:
        statsAggregate.connectionCount !== 0 ? statsAggregate.connectionBitRateUp / statsAggregate.connectionCount : 0,
      avgDown:
        statsAggregate.connectionCount !== 0
          ? statsAggregate.connectionBitRateDown / statsAggregate.connectionCount
          : 0,
    },
    inbound: {
      avg: statsAggregate.inboundCount !== 0 ? statsAggregate.inboundBitRate / statsAggregate.inboundCount : 0,
      max: statsAggregate.inboundMaxBitRate,
    },
    outbound: {
      avg: statsAggregate.outboundCount !== 0 ? statsAggregate.outboundBitRate / statsAggregate.outboundCount : 0,
      max: statsAggregate.outboundMaxBitRate,
    },
  };
};

const aggregateConnections = (stats: EntityState<State>, publisherId: ParticipantId) => {
  const connections: Array<{ reports: Array<StatsEvent>; isPublisher: boolean; online: boolean }> = stats.ids.map(
    (id) => {
      const connection = stats.entities[id];
      if (connection === undefined) {
        return { reports: [], isPublisher: false, online: false };
      } else {
        return {
          reports: connection.reports,
          isPublisher: connection.participantId === publisherId,
          online: connection.online,
        };
      }
    }
  );

  return connections.reduce(
    (aggregate, { reports, isPublisher, online }) => {
      if (!online) {
        return aggregate;
      }

      const { publishing, subscribing, connectionCount } = aggregate;
      const { inbound, outbound } = aggregateTimeline(reports);

      if (reports.length === 0) {
        return { publishing, subscribing, connectionCount };
      }

      const recentReport: StatsEvent = reports[reports.length - 1];

      if (isPublisher) {
        return {
          publishing: {
            currentBitrate: publishing.currentBitrate + (recentReport.outbound?.bitRate || 0),
            avgBitrate: publishing.avgBitrate + outbound.avg,
            maxBitrate: Math.max(publishing.maxBitrate, outbound.max),
            count: publishing.count + (outbound.avg > 0 ? 1 : 0),
          },
          subscribing,
          connectionCount: connectionCount + 1,
        };
      } else {
        return {
          publishing,
          subscribing: {
            currentBitrate: subscribing.currentBitrate + (recentReport.inbound?.bitRate || 0),
            avgBitrate: subscribing.avgBitrate + inbound.avg,
            maxBitrate: Math.max(subscribing.maxBitrate, inbound.max),
            count: subscribing.count + (inbound.avg > 0 ? 1 : 0),
          },
          connectionCount: connectionCount + 1,
        };
      }
    },
    {
      publishing: { currentBitrate: 0, avgBitrate: 0, maxBitrate: 0, count: 0 },
      subscribing: { currentBitrate: 0, avgBitrate: 0, maxBitrate: 0, count: 0 },
      connectionCount: 0,
    }
  );
};

const formatNumberRate = (num: number | undefined) => {
  const mbit = 1024 * 1024;
  const kbit = 1024;

  if (num === undefined) {
    return '-';
  }

  if (num >= mbit) {
    return `${(num / mbit).toLocaleString(i18next.language, { maximumFractionDigits: 2 })} MBit/s`;
  }
  if (num >= kbit) {
    return `${(num / kbit).toLocaleString(i18next.language, { maximumFractionDigits: 0 })} kBit/s`;
  }
  return `${num.toLocaleString(i18next.language, { maximumFractionDigits: 0 })} Bit/s`;
};

const DebugPanel = () => {
  const ownId = useAppSelector(selectOurUuid);
  const stats = useAppSelector(selectStats);

  const connectionSummary = useMemo(() => (ownId ? aggregateConnections(stats, ownId) : undefined), [stats, ownId]);

  return (
    <AppBar position="relative">
      <Stack sx={{ paddingLeft: '4em' }} spacing={3} p={1} direction={'row'}>
        <Stack direction={'column'}>
          <Typography>{`${t('debug-panel-remote-count-label')} `}</Typography>
          <Typography align={'center'}>{`${connectionSummary?.connectionCount}`}</Typography>
        </Stack>
        <Stack direction={'column'}>
          <Typography>{`${t('debug-panel-outbound-label')} `}</Typography>
          <Typography align={'right'}>
            {`${formatNumberRate(connectionSummary?.publishing.currentBitrate)},
            ${formatNumberRate(connectionSummary?.publishing.avgBitrate)},
            ${formatNumberRate(connectionSummary?.publishing.maxBitrate)}`}
          </Typography>
        </Stack>
        <Stack direction={'column'}>
          <Typography>{`${t('debug-panel-inbound-label')} `}</Typography>
          <Typography align={'right'}>
            {`${formatNumberRate(connectionSummary?.subscribing.currentBitrate)},
             ${formatNumberRate(connectionSummary?.subscribing.avgBitrate)},
             ${formatNumberRate(connectionSummary?.subscribing.maxBitrate)}`}
          </Typography>
        </Stack>
      </Stack>
    </AppBar>
  );
};

export default DebugPanel;
