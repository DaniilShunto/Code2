// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { joinSuccess } from '@opentalk/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../';
import { sendRecordingConsentSignal } from '../../api/types/outgoing/recording';
import { hangUp } from '../commonActions';

type RecordingStatus = 'initializing' | 'recording';

interface RecordingState {
  status: RecordingStatus;
  recordingId?: string;
  consent: boolean;
}

const initialState: RecordingState = {
  status: 'initializing',
  consent: false,
};

const recordingSlice = createSlice({
  name: 'recording',
  initialState,
  reducers: {
    recordingStarted: (state, { payload }: PayloadAction<string>) => {
      state.recordingId = payload;
      state.status = 'recording';
    },
    recordingStopped: (state) => {
      state.recordingId = undefined;
      state.status = 'initializing';
      state.consent = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(joinSuccess, (state, { payload: { recording } }) => {
      if (!recording) {
        state.recordingId = undefined;
        state.status = 'initializing';
        state.consent = false;
        return;
      }
      if (recording.state === 'recording' && recording.recordingId) {
        state.status = 'recording';
        state.recordingId = recording.recordingId;
      }
    });
    builder.addCase(hangUp.pending, () => initialState);

    builder.addCase(sendRecordingConsentSignal.action, (state, { payload: { consent } }) => {
      state.consent = consent;
    });
  },
});

export const { recordingStarted, recordingStopped } = recordingSlice.actions;

export const selectRecordingState = (state: RootState) => state.recording.status === 'recording';
export const selectRecordingId = (state: RootState) => state.recording.recordingId;
export const selectNeedRecordingConsent = (state: RootState) => selectRecordingState(state) && !state.recording.consent;

export default recordingSlice.reducer;
