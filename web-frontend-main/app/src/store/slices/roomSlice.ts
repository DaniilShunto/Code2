// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  FetchRequestError,
  FetchRequestState,
  InviteCode,
  RoomId,
  joinSuccess,
  TimerStyle,
  RoomMode,
  AutomodSelectionStrategy,
  EventInfo,
  timerStarted,
  timerStopped,
  notifications,
} from '@opentalk/common';
import { automodStore } from '@opentalk/components';
import { AuthTypeError, authError } from '@opentalk/redux-oidc';
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createListenerMiddleware,
  AnyAction,
  ListenerEffectAPI,
} from '@reduxjs/toolkit';
import convertToCamelCase from 'camelcase-keys';
import convertToSnakeCase from 'snakecase-keys';

import { AppDispatch, RootState } from '../';
import { StartRoomError } from '../../api/rest';
import { fetchWithAuth, getControllerBaseUrl } from '../../utils/apiUtils';
import { hangUp, startRoom } from '../commonActions';

interface InviteState extends FetchRequestState {
  active?: boolean;
  expiration?: string;
  inviteCode?: InviteCode;
}

/**
 * ### State Machine Graph
 * - Initial -> Setup
 * - Setup -> Starting
 * - Starting -> Blocked
 * - Starting -> Waiting ->ReadyToEnter -> Online
 * - Starting -> Failed
 * - Starting -> Failed-credentials
 * - Starting -> Online
 * - Online -> Failed
 * - Online -> Leaving
 * - Leaving -> Failed
 * - Leaving -> Left
 * - Failed -> Starting
 * - Failed -> Left
 * - Left -> Starting
 */
export enum ConnectionState {
  Initial = 'initial',
  Setup = 'setup',
  Starting = 'starting',
  Waiting = 'waiting',
  Online = 'online',
  Leaving = 'leaving',
  Left = 'left',
  Failed = 'failed',
  FailedCredentials = 'failed-credentials',
  Blocked = 'blocked',
  ReadyToEnter = 'ready-to-enter',
}

interface RoomState {
  roomId?: RoomId;
  password?: string;
  invite: InviteState;
  connectionState: ConnectionState;
  resumptionToken?: string;
  waitingRoomEnabled: boolean;
  error?: string;
  serverTimeOffset: number;
  passwordRequired: boolean;
  participantLimit: number;
  currentMode?: RoomMode;
  eventInfo?: EventInfo;
  reconnectTimerId: ReturnType<typeof setTimeout> | null;
}

export interface InviteRoomVerifyResponse {
  roomId: RoomId;
  passwordRequired: boolean;
}

const initialInviteState: InviteState = {
  loading: false,
  error: undefined,
  active: undefined,
  expiration: undefined,
  inviteCode: undefined,
};

const initialState: RoomState = {
  roomId: undefined,
  password: undefined,
  invite: initialInviteState,
  connectionState: ConnectionState.Initial,
  waitingRoomEnabled: false,
  serverTimeOffset: 0,
  passwordRequired: false,
  participantLimit: 0,
  reconnectTimerId: null,
};

export const fetchRoomByInviteId = createAsyncThunk<
  InviteRoomVerifyResponse,
  InviteCode,
  { state: RootState; rejectValue: FetchRequestError }
>('room/fetchRoomByInviteId', async (inviteCode, thunkApi) => {
  const { getState, rejectWithValue } = thunkApi;

  const verifyUrl = new URL('v1/invite/verify', getControllerBaseUrl(getState().config));

  try {
    const body = JSON.stringify(convertToSnakeCase({ inviteCode }));

    const response = await fetchWithAuth(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (!response.ok) {
      return rejectWithValue({
        status: response.status,
        statusText: await response.text(),
      });
    }

    return convertToCamelCase(await response.json(), { deep: true }) as InviteRoomVerifyResponse;
  } catch (error) {
    return rejectWithValue({
      status: 500,
      statusText: error as string,
    });
  }
});

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    joinBlocked: (state, { payload: { reason } }: PayloadAction<{ reason?: string }>) => {
      state.connectionState = ConnectionState.Blocked;
      state.error = reason;
    },
    connectionClosed: (state, { payload: { errorCode } }: PayloadAction<{ errorCode?: number }>) => {
      state.connectionState = errorCode ? ConnectionState.Failed : ConnectionState.Leaving;
      state.error = `websocket_error_${errorCode}`;
    },
    enteredWaitingRoom: (state) => {
      state.connectionState = ConnectionState.Waiting;
    },
    readyToEnter: (state) => {
      state.connectionState = ConnectionState.ReadyToEnter;
    },
    enableWaitingRoom: (state) => {
      state.waitingRoomEnabled = true;
    },
    disableWaitingRoom: (state) => {
      state.waitingRoomEnabled = false;
    },
    updatedReconnectTimerId: (state, { payload: { reconnectTimerId } }) => {
      state.reconnectTimerId = reconnectTimerId;
    },
    abortedReconnection: (state) => {
      if (state.reconnectTimerId) {
        clearTimeout(state.reconnectTimerId);
      }
      state.reconnectTimerId = null;
      state.connectionState = ConnectionState.Left;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRoomByInviteId.pending, (state) => {
      state.invite.loading = true;
    });
    builder.addCase(fetchRoomByInviteId.fulfilled, (state, { payload, meta }) => {
      state.roomId = payload.roomId;
      state.invite.loading = false;
      state.invite.inviteCode = meta.arg;
      state.connectionState = ConnectionState.Setup;
      state.resumptionToken = undefined;
      state.passwordRequired = payload.passwordRequired;
    });
    builder.addCase(fetchRoomByInviteId.rejected, (state, { payload }) => {
      state.invite = {
        ...initialInviteState,
        error: payload,
        loading: false,
      };
    });
    builder.addCase(
      startRoom.pending,
      (
        state,
        {
          meta: {
            arg: { roomId, password, inviteCode },
          },
        }
      ) => {
        state.error = undefined;
        state.connectionState = ConnectionState.Starting;
        state.roomId = roomId;
        state.password = password;
        state.invite = { inviteCode, loading: false };
      }
    );
    builder.addCase(startRoom.fulfilled, (state, { payload: { resumption } }) => {
      state.resumptionToken = resumption;
    });
    builder.addCase(startRoom.rejected, (state, payload) => {
      if ('code' in payload.error) {
        state.error = payload.error.code;
      }
      if (state.error === StartRoomError.WrongRoomPassword) {
        state.connectionState = ConnectionState.FailedCredentials;
      } else {
        state.connectionState = ConnectionState.Failed;
      }
    });
    builder.addCase(joinSuccess, (state, { payload }) => {
      state.currentMode = undefined;
      state.serverTimeOffset = payload.serverTimeOffset;
      state.connectionState = ConnectionState.Online;
      state.waitingRoomEnabled = Boolean(payload.moderation?.waitingRoomEnabled);
      state.participantLimit = payload.tariff.quotas?.roomParticipantLimit;

      if (payload.timer && payload.timer.style === TimerStyle.CoffeeBreak) {
        state.currentMode = RoomMode.CoffeeBreak;
      }

      if (payload.automod) {
        if (payload.automod.config.selectionStrategy === AutomodSelectionStrategy.Playlist) {
          state.currentMode = RoomMode.TalkingStick;
        }
      }
      state.eventInfo = payload.eventInfo;
    });
    builder.addCase(hangUp.pending, (state) => {
      state.connectionState = ConnectionState.Leaving;
    });
    builder.addCase(hangUp.fulfilled, (state) => {
      state.connectionState = ConnectionState.Left;
    });
    builder.addCase(hangUp.rejected, (state) => {
      state.connectionState = ConnectionState.Left;
    });
    builder.addCase(timerStarted, (state, { payload }) => {
      if (payload.style === TimerStyle.CoffeeBreak) {
        state.currentMode = RoomMode.CoffeeBreak;
      } else {
        state.currentMode = undefined;
      }
    });
    builder.addCase(timerStopped, (state) => {
      if (state.currentMode === RoomMode.CoffeeBreak) {
        state.currentMode = undefined;
      }
    });
    builder.addCase(automodStore.started, (state, { payload: { selectionStrategy } }) => {
      if (selectionStrategy === AutomodSelectionStrategy.Playlist) {
        state.currentMode = RoomMode.TalkingStick;
      }
    });
    builder.addCase(automodStore.stopped, (state) => {
      state.currentMode = undefined;
    });
  },
});

export const actions = roomSlice.actions;
export const {
  joinBlocked,
  connectionClosed,
  enteredWaitingRoom,
  readyToEnter,
  enableWaitingRoom,
  disableWaitingRoom,
  updatedReconnectTimerId,
  abortedReconnection,
} = actions;

export const selectRoomPassword = (state: RootState) => state.room.password;
export const selectRoomId = (state: RootState) => state.room.roomId;
export const selectInviteCode = (state: RootState) => state.room.invite.inviteCode;
export const selectRoomConnectionState = (state: RootState) => state.room.connectionState;
export const selectWaitingRoomState = (state: RootState) => state.room.waitingRoomEnabled;
export const selectServerTimeOffset = (state: RootState) => state.room.serverTimeOffset;
export const selectPasswordRequired = (state: RootState) => state.room.passwordRequired;
export const selectParticipantLimit = (state: RootState) => state.room.participantLimit;
export const selectCurrentRoomMode = (state: RootState) => state.room.currentMode;
export const selectEventInfo = (state: RootState) => state.room.eventInfo;

export default roomSlice.reducer;

export const roomMiddleware = createListenerMiddleware<RootState, AppDispatch>();

function reconnect(listenerApi: ListenerEffectAPI<RootState, AppDispatch>) {
  const RECONNECT_DELAY = 5000; //ms
  const state = listenerApi.getState();
  const { roomId } = state.room;
  const { inviteCode } = state.room.invite;
  const { displayName } = state.user;
  const { assignment: breakoutRoomId } = state.breakout;

  if (state.room.error === StartRoomError.Unathorized) {
    listenerApi.dispatch(
      authError({ status: 401, name: AuthTypeError.SessionExpired, message: AuthTypeError.SessionExpired })
    );
  }
  if (state.room.error === StartRoomError.WrongRoomPassword) {
    return;
  }

  if (state.room.reconnectTimerId) {
    clearTimeout(state.room.reconnectTimerId);
  }

  if (roomId) {
    const reconnectTimerId = setTimeout(() => {
      listenerApi.dispatch(
        startRoom({
          roomId,
          breakoutRoomId: breakoutRoomId || null,
          displayName,
          inviteCode,
        })
      );
    }, RECONNECT_DELAY);

    listenerApi.dispatch(updatedReconnectTimerId({ reconnectTimerId }));
  }
}

roomMiddleware.startListening({
  type: 'room/start/rejected',
  effect: (_action: AnyAction, listenerApi: ListenerEffectAPI<RootState, AppDispatch>) => reconnect(listenerApi),
});

type ConnectionClosedAction = Partial<ReturnType<typeof connectionClosed>> & AnyAction;
roomMiddleware.startListening({
  type: 'room/connectionClosed',
  effect: (action: ConnectionClosedAction, listenerApi: ListenerEffectAPI<RootState, AppDispatch>) => {
    if (action.payload?.errorCode) {
      return reconnect(listenerApi);
    }
  },
});

roomMiddleware.startListening({
  type: 'room/hangup/rejected',
  // TODO: Find a way to increase guard type and step away from AnyAction.
  effect: (action: AnyAction) => {
    if (action.error) {
      notifications.error(action.error.message);
    }
  },
});
