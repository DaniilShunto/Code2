// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { RoomId } from '@opentalk/rest-api-rtk-query';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { fetchWithAuth, getControllerBaseUrl } from '../../utils/apiUtils';
import { RootState } from '../index';

export const deleteRoomMetaData = createAsyncThunk<void, RoomId, { state: RootState }>(
  'internal/deleteRoomMetaData',
  async (id, thunkApi) => {
    const { getState, rejectWithValue } = thunkApi;

    const deleteUrl = new URL(`internal/rooms/${id}`, getControllerBaseUrl(getState().config)).toString();
    const response = await fetchWithAuth(deleteUrl, {
      method: 'DELETE',
    });

    const result = await response.text();
    if (!response.ok) {
      return rejectWithValue({
        status: response.status,
        statusText: result,
      });
    }
  }
);
