// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  descriptorFromId,
  idFromDescriptor,
  MediaDescriptor,
  MediaId,
  PACKET_LOSS_THRESHOLD,
} from '../../modules/WebRTC';
import { StatsEvent } from '../../modules/WebRTC/Statistics/ConnectionStats';
import { hangUp } from '../commonActions';
import { RootState } from '../index';
import { closed } from './mediaSubscriberSlice';

const STATS_HISTORY_INTERVAL = 1 * 60 * 1000; // 1 Minute
export type State = MediaDescriptor & { reports: Array<StatsEvent>; online: boolean };

export const connectionStatsAdapter = createEntityAdapter<State>({
  selectId: idFromDescriptor,
});

export const connectionStatsSlice = createSlice({
  name: 'stats',
  initialState: connectionStatsAdapter.getInitialState(),
  reducers: {
    statsUpdated: (state, { payload }: PayloadAction<Record<MediaId, StatsEvent>>) => {
      const updates = Object.entries(payload).map(([id, newReport]): State => {
        const reports = (state.entities[id]?.reports || []).filter(
          (report) => report.connection.timestamp > newReport.connection.timestamp - STATS_HISTORY_INTERVAL
        );
        reports.push(newReport);
        return { ...descriptorFromId(id as MediaId), reports, online: true };
      });

      connectionStatsAdapter.upsertMany(state, updates);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(closed, (state, { payload }: PayloadAction<MediaDescriptor>) => {
      connectionStatsAdapter.updateOne(state, {
        id: `${payload.participantId}/${payload.mediaType}`,
        changes: { online: false },
      });
    });
    builder.addCase(hangUp.fulfilled, (state) => {
      connectionStatsAdapter.removeAll(state);
    });
    builder.addCase(hangUp.rejected, (state) => {
      connectionStatsAdapter.removeAll(state);
    });
  },
});

export const { statsUpdated } = connectionStatsSlice.actions;

export const connectionStatsSelectors = connectionStatsAdapter.getSelectors<RootState>((state) => state.stats);

const selectStatsByIdRaw = (descriptor: MediaDescriptor) => (state: RootState) =>
  connectionStatsSelectors.selectById(state, idFromDescriptor(descriptor));

// returns temporarily the last inbound report entry to ensure legacy code is working as expected
export const selectStatsById = (descriptor: MediaDescriptor) => {
  const sel = selectStatsByIdRaw(descriptor);
  return createSelector(sel, (stats) => {
    const reports = stats?.reports;
    if (reports !== undefined && reports.length > 0) {
      const { inbound, connection } = reports[reports.length - 1];
      if (inbound && connection) {
        return { mediaStream: inbound, connection };
      }
    }
    return undefined;
  });
};

export const selectStatsPacketLossByDescriptor = (descriptor: MediaDescriptor) => {
  const sel = selectStatsById(descriptor);
  return createSelector(sel, (report) => {
    const packetLoss = report?.connection?.packetLoss;
    return packetLoss !== undefined && packetLoss > PACKET_LOSS_THRESHOLD;
  });
};

export const selectStats = (state: RootState) => {
  return state.stats;
};

export const actions = connectionStatsSlice.actions;

export default connectionStatsSlice.reducer;
