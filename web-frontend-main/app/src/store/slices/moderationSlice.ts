// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '..';
import { lowerHand, raiseHand } from '../../api/types/outgoing/control';

interface ModerationState {
  hasHandUp: boolean;
  handUpdatedAt?: string;
  raiseHandsEnabled: boolean;
}

const initialState: ModerationState = {
  hasHandUp: false,
  raiseHandsEnabled: true,
};

export const moderationSlice = createSlice({
  name: 'moderation',
  initialState,
  reducers: {
    forceLowerHand: (state) => {
      state.hasHandUp = false;
    },
    enableRaisedHands: (state) => {
      state.raiseHandsEnabled = true;
    },
    disableRaisedHands: (state) => {
      state.raiseHandsEnabled = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(raiseHand.action, (state) => {
        state.hasHandUp = true;
        state.handUpdatedAt = new Date().toISOString();
      })
      .addCase(lowerHand.action, (state) => {
        state.hasHandUp = false;
        state.handUpdatedAt = new Date().toISOString();
      });
  },
});

export const { forceLowerHand, disableRaisedHands, enableRaisedHands } = moderationSlice.actions;
export const actions = moderationSlice.actions;

export const selectHandUp = (state: RootState) => state.moderation.hasHandUp;
export const selectHandUpdatedAt = (state: RootState) => state.moderation.handUpdatedAt;
export const selectRaiseHandsEnabled = (state: RootState) => state.moderation.raiseHandsEnabled;

export default moderationSlice.reducer;
