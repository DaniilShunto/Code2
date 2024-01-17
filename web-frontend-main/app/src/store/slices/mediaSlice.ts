// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ParticipantId, Timestamp, VideoSetting } from '@opentalk/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../';
import { RequestMute } from '../../api/types/incoming/media';
import { BackgroundConfig } from '../../modules/Media/BackgroundBlur';
import { DeviceId } from '../../modules/Media/MediaUtils';
import { leave as participantLeave } from './participantsSlice';

export enum NotificationKind {
  ForceMute = 'forceMute',
  RequestMute = 'requestMute',
}

interface MuteNotification {
  kind: NotificationKind;
  origin: ParticipantId;
}

interface MediaState {
  audioEnabled: boolean;
  videoEnabled: boolean;
  shareScreenEnabled: boolean;
  videoBackgroundEffects: BackgroundConfig;
  audioDevice?: DeviceId;
  videoDevice?: DeviceId;
  focusedSpeaker: ParticipantId | undefined;
  qualityCap: VideoSetting;
  upstreamLimit: VideoSetting;
  requestMuteNotification?: MuteNotification;
  inProgress: boolean;
  isUserSpeaking: boolean;
}

const initialState: MediaState = {
  audioEnabled: false,
  videoEnabled: false,
  shareScreenEnabled: false,
  videoBackgroundEffects: { style: 'off' },
  audioDevice: undefined,
  videoDevice: undefined,
  focusedSpeaker: undefined,
  qualityCap: VideoSetting.High,
  upstreamLimit: VideoSetting.High,
  inProgress: false,
  isUserSpeaking: false,
};

export const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setAudioEnable: (state, { payload: enabled }: PayloadAction<boolean>) => {
      state.audioEnabled = enabled;
    },
    setVideoEnable: (state, { payload: enabled }: PayloadAction<boolean>) => {
      state.videoEnabled = enabled;
    },
    setScreenShare: (state, { payload: enabled }: PayloadAction<boolean>) => {
      state.shareScreenEnabled = enabled;
    },
    setBackgroundEffects: (state, { payload }: PayloadAction<BackgroundConfig>) => {
      state.videoBackgroundEffects = payload;
    },
    changedAudioDevice: (state, action: PayloadAction<DeviceId | undefined>) => {
      state.audioDevice = action.payload;
    },
    changedVideoDevice: (state, action: PayloadAction<DeviceId | undefined>) => {
      state.videoDevice = action.payload;
    },
    setFocusedSpeaker: (state, { payload: { id } }: PayloadAction<{ id: ParticipantId; timestamp?: Timestamp }>) => {
      state.focusedSpeaker = id;
    },
    setSpeakerActivity: (state, { payload }: PayloadAction<boolean>) => {
      state.isUserSpeaking = payload;
    },
    setQualityCap: (state, action: PayloadAction<VideoSetting>) => {
      state.qualityCap = action.payload;
    },
    setUpstreamLimit: (state, { payload }: PayloadAction<VideoSetting>) => {
      state.upstreamLimit = payload;
    },
    setMediaChangeInProgress: (state, { payload }: PayloadAction<boolean>) => {
      state.inProgress = payload;
    },
    requestMute: (state, { payload }: PayloadAction<RequestMute>) => {
      if (payload.force) {
        state.requestMuteNotification = { kind: NotificationKind.ForceMute, origin: payload.issuer };
      } else {
        state.requestMuteNotification = { kind: NotificationKind.RequestMute, origin: payload.issuer };
      }
    },
    notificationShown: (state) => {
      state.requestMuteNotification = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(participantLeave, (state, action) => {
      if (state.focusedSpeaker === action.payload.id) {
        state.focusedSpeaker = undefined;
      }
    });
  },
});

export const {
  setAudioEnable,
  setVideoEnable,
  changedAudioDevice,
  changedVideoDevice,
  setBackgroundEffects,
  setScreenShare,
  setFocusedSpeaker,
  setSpeakerActivity,
  setQualityCap,
  setUpstreamLimit,
  requestMute,
  notificationShown,
  setMediaChangeInProgress,
} = mediaSlice.actions;
export const selectAudioEnabled = (state: RootState) => state.media.audioEnabled;

export const selectVideoEnabled = (state: RootState) => state.media.videoEnabled;
export const selectShareScreenEnabled = (state: RootState) => state.media.shareScreenEnabled;
export const selectVideoBackgroundEffects = (state: RootState) => state.media.videoBackgroundEffects;
export const selectAudioDeviceId = (state: RootState) => state.media.audioDevice;
export const selectVideoDeviceId = (state: RootState) => state.media.videoDevice;
export const selectFocusedSpeaker = (state: RootState) => state.media.focusedSpeaker;
export const selectIsUserSpeaking = (state: RootState) => state.media.isUserSpeaking;
export const selectQualityCap = (state: RootState) => state.media.qualityCap;
export const selectUpstreamLimit = (state: RootState) => state.media.upstreamLimit;
export const selectNotification = (state: RootState) => state.media.requestMuteNotification;
export const selectMediaChangeInProgress = (state: RootState) => state.media.inProgress;

export const actions = mediaSlice.actions;

export default mediaSlice.reducer;
