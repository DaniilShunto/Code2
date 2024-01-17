// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { MediaSessionType, VideoSetting } from '@opentalk/common';
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
  createListenerMiddleware,
  TypedStartListening,
  createSelector,
} from '@reduxjs/toolkit';

import { RootState, AppDispatch } from '..';
import { media } from '../../api/types/incoming';
import {
  idFromDescriptor,
  MediaDescriptor,
  QualityLimit,
  SubscriberConfig,
  SubscriberStateChanged,
} from '../../modules/WebRTC';
import { SubscriberState } from '../../modules/WebRTC/SubscriberConnection';
import { hangUp, startRoom } from '../commonActions';
import { leave } from './participantsSlice';
import { pinnedRemoteScreenshare } from './uiSlice';

interface State extends SubscriberConfig {
  subscriberState: SubscriberState;
  limit: VideoSetting;
  error?: media.MediaError;
}

export const mediaSubscriberAdapter = createEntityAdapter<State>({
  selectId: idFromDescriptor,
});

export const mediaSubscriberSlice = createSlice({
  name: 'subscribers',
  initialState: mediaSubscriberAdapter.getInitialState(),
  reducers: {
    updated: (state, { payload }: PayloadAction<SubscriberConfig>) => {
      const id = idFromDescriptor(payload);
      const lastConfig = mediaSubscriberAdapter.getSelectors().selectById(state, id);
      if (lastConfig === undefined) {
        mediaSubscriberAdapter.addOne(state, {
          ...payload,
          subscriberState: { audioRunning: false, videoRunning: false, connection: 'new' },
          limit: VideoSetting.High,
        });
      } else {
        const { video, videoSettings, audio } = payload;
        mediaSubscriberAdapter.updateOne(state, {
          id,
          changes: { video, videoSettings, audio },
        });
      }
    },
    failed: (state, { payload }: PayloadAction<media.MediaError>) => {
      mediaSubscriberAdapter.updateOne(state, {
        id: payload.source,
        changes: {
          error: payload,
          subscriberState: { audioRunning: false, videoRunning: false, connection: 'failed' },
        },
      });
    },
    closed: (state, { payload }: PayloadAction<MediaDescriptor>) => {
      mediaSubscriberAdapter.updateOne(state, {
        id: idFromDescriptor(payload),
        changes: {
          subscriberState: { audioRunning: false, videoRunning: false, connection: 'closed' },
          limit: VideoSetting.High,
        },
      });
    },
    mediaUpdated: (state, { payload }: PayloadAction<SubscriberStateChanged>) => {
      mediaSubscriberAdapter.updateOne(state, {
        id: idFromDescriptor(payload),
        changes: { subscriberState: payload.subscriberState },
      });
    },
    limit: (state, { payload }: PayloadAction<QualityLimit>) => {
      mediaSubscriberAdapter.updateOne(state, {
        id: idFromDescriptor(payload),
        changes: { limit: payload.limit },
      });
    },
    removed: (state, { payload }: PayloadAction<MediaDescriptor>) => {
      mediaSubscriberAdapter.removeOne(state, idFromDescriptor(payload));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(leave, (state, { payload: { id } }) => {
      mediaSubscriberAdapter.removeMany(state, [
        idFromDescriptor({ participantId: id, mediaType: MediaSessionType.Screen }),
        idFromDescriptor({ participantId: id, mediaType: MediaSessionType.Video }),
      ]);
    });
    builder.addCase(hangUp.pending, (state) => {
      mediaSubscriberAdapter.removeAll(state);
    });
    builder.addCase(startRoom.rejected, () => mediaSubscriberAdapter.getInitialState());
  },
});

export const { updated, mediaUpdated, closed, removed, limit, failed } = mediaSubscriberSlice.actions;

export const mediaSubscribersSelectors = mediaSubscriberAdapter.getSelectors<RootState>((state) => state.subscribers);
export const selectAllSubscribers = (state: RootState) => mediaSubscribersSelectors.selectAll(state);
export const selectUnmutedSubscribers = createSelector(selectAllSubscribers, (subscribers) =>
  subscribers.filter(({ audio, mediaType }) => audio && mediaType === MediaSessionType.Video)
);

export const selectSubscriberById = (descriptor: MediaDescriptor) => (state: RootState) =>
  mediaSubscribersSelectors.selectById(state, idFromDescriptor(descriptor));

export const selectSubscriberLiveById = (descriptor: MediaDescriptor, kind: 'audio' | 'video') => {
  const sel = selectSubscriberById(descriptor);
  return createSelector(sel, (subscriber: State | undefined): boolean => {
    if (subscriber === undefined) {
      return false;
    }
    return kind === 'video' ? subscriber.subscriberState.videoRunning : subscriber.subscriberState.audioRunning;
  });
};

export const selectSubscriberHasVideoById = (descriptor: MediaDescriptor) => {
  const sel = selectSubscriberById(descriptor);
  return createSelector(sel, (subscriber: State | undefined): boolean => {
    if (subscriber === undefined) {
      return false;
    }
    return subscriber.video && subscriber.limit !== VideoSetting.Off;
  });
};

export const selectSubscriberStateById = (descriptor: MediaDescriptor, kind: 'audio' | 'video') => {
  const sel = selectSubscriberById(descriptor);
  return createSelector(
    sel,
    (
      subscriber: State | undefined
    ): {
      active: boolean;
      error: undefined | media.MediaError;
      limit: VideoSetting;
    } => {
      if (subscriber === undefined) {
        return { active: false, error: undefined, limit: VideoSetting.High };
      }

      return {
        active: kind === 'video' ? subscriber.video && subscriber.limit !== VideoSetting.Off : subscriber.audio,
        limit: subscriber.limit,
        error: subscriber.error,
      };
    }
  );
};

export const selectIsSubscriberOnlineByDescriptor = (descriptor: MediaDescriptor) => {
  const sel = selectSubscriberById(descriptor);
  return createSelector(sel, (subscriber) => {
    const mediaConnectionState = subscriber?.subscriberState?.connection;
    return mediaConnectionState !== undefined && mediaConnectionState !== 'new' && mediaConnectionState !== 'closed';
  });
};

export const actions = mediaSubscriberSlice.actions;

// By design `updated` signal can be fired not only on starting screenshare or video, but also on change of media quality.
// We want to pin the latest screenshare only in case, the other user started it.
// Therefore we need to know, if subscriber, which fired `updated` already exists.
// As crossslice state access is not supported and is an anti-pattern, we use the listener middleware technique.
export const mediaSubscriberMiddleware = createListenerMiddleware();
type AppStartListening = TypedStartListening<RootState, AppDispatch>;

const startAppListening = mediaSubscriberMiddleware.startListening as AppStartListening;
startAppListening({
  actionCreator: updated,
  effect: (action, listenerApi) => {
    if (action.payload.mediaType === MediaSessionType.Screen) {
      const id = idFromDescriptor(action.payload);
      const subscriber = mediaSubscriberAdapter
        .getSelectors()
        .selectById(listenerApi.getOriginalState().subscribers, id);
      if (!subscriber) {
        listenerApi.dispatch(pinnedRemoteScreenshare(action.payload.participantId));
      }
    }
  },
});

export default mediaSubscriberSlice.reducer;
