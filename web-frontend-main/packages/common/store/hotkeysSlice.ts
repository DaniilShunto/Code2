// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TimerStyle } from '../types';
import { joinSuccess, timerStarted, timerStopped } from './actions';

interface HotkeysState {
  hotkeysEnabled: boolean;
}

const initialState: HotkeysState = {
  hotkeysEnabled: false,
};

export const hotkeysSlice = createSlice({
  name: 'hotkeys',
  initialState,
  reducers: {
    setHotkeysEnabled: (state, { payload: enabled }: PayloadAction<boolean>) => {
      state.hotkeysEnabled = enabled;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(joinSuccess, (state, { payload }) => {
      if (payload.timer?.style === TimerStyle.CoffeeBreak) {
        state.hotkeysEnabled = false;
      } else {
        state.hotkeysEnabled = true;
      }
    }),
      builder.addCase(timerStarted, (state, { payload }) => {
        if (payload.style === TimerStyle.CoffeeBreak) {
          state.hotkeysEnabled = false;
        }
      }),
      builder.addCase(timerStopped, (state) => {
        if (!state.hotkeysEnabled) {
          state.hotkeysEnabled = true;
        }
      });
  },
});

export const { setHotkeysEnabled } = hotkeysSlice.actions;

export const selectHotkeysEnabled = (state: { hotkeys: HotkeysState }) => state.hotkeys.hotkeysEnabled;

export const actions = hotkeysSlice.actions;

export default hotkeysSlice.reducer;
