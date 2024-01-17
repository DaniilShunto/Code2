// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { BreakoutRoomId, InviteCode, RoomId, notifications } from '@opentalk/common';
import { createAsyncThunk } from '@reduxjs/toolkit';
import convertToCamelCase from 'camelcase-keys';
import convertToSnakeCase from 'snakecase-keys';

import { stopTimeLimitNotification } from '../components/TimeLimitNotification';
import localMediaContext from '../modules/Media/LocalMedia';
import localScreenContext from '../modules/Media/LocalScreen';
import { ConferenceRoom, shutdownConferenceContext } from '../modules/WebRTC';
import { getControllerBaseUrl } from '../utils/apiUtils';
import { RootState } from './index';
import { ConnectionState } from './slices/roomSlice';

export interface RoomCredentials {
  roomId: RoomId;
  password?: string;
  inviteCode?: InviteCode;
  breakoutRoomId: BreakoutRoomId | null;
}

export const login = createAsyncThunk<{ permission: Array<string> }, string, { state: RootState; rejectValue: Error }>(
  'user/login',
  async (idToken: string, thunkApi) => {
    const { getState } = thunkApi;
    const baseUrl = getControllerBaseUrl(getState().config);
    const response = await fetch(new URL('v1/auth/login', baseUrl).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(convertToSnakeCase({ idToken })),
    });

    return convertToCamelCase(await response.json(), { deep: true });
  }
);

export const startRoom = createAsyncThunk<
  { conferenceContext: ConferenceRoom; resumption: string },
  RoomCredentials & { displayName: string },
  { state: RootState }
>('room/start', async (credentials, { getState }) => {
  const config = getState().config;
  const { resumptionToken, roomId } = getState().room;
  if (credentials.displayName.length === 0) {
    throw new Error('displayName must ne non empty');
  }
  return ConferenceRoom.create(credentials, config, credentials.roomId === roomId ? resumptionToken : undefined);
});

export const hangUp = createAsyncThunk<void, void, { state: RootState }>('room/hangup', async (_, { getState }) => {
  // This ensures that all notifications visible to the user prior to hanging up
  // and being redirected to the lobby room are cleared up. If you need to show
  // notification after hanging up, make sure to call it after this function.
  notifications.closeAll();
  // A workaround to disable notifications about time limitation of the conference, as they
  // have they own timeout strategy
  stopTimeLimitNotification();
  const { connectionState } = getState().room;
  if (connectionState !== ConnectionState.Leaving) {
    throw new Error(`cannot hangup when state is '${connectionState}' and not 'leaving'.`);
  }
  shutdownConferenceContext();
  localScreenContext.release();
  return localMediaContext.release();
});
