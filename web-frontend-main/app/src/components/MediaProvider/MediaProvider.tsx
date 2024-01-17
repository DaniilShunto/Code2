// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { VideoSetting, notifications } from '@opentalk/common';
import i18next from 'i18next';
import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import browser from '../../modules/BrowserSupport';
import { BackgroundConfig } from '../../modules/Media/BackgroundBlur';
import { SignalLevel } from '../../modules/Media/LevelNode';
import localMediaContext, { LocalMedia } from '../../modules/Media/LocalMedia';
import localScreenContext from '../../modules/Media/LocalScreen';
import { DeviceId, getConstraints } from '../../modules/Media/MediaUtils';
import {
  changedAudioDevice,
  changedVideoDevice,
  setAudioEnable,
  setBackgroundEffects,
  setMediaChangeInProgress,
  setQualityCap,
  setScreenShare,
  setSpeakerActivity,
  setVideoEnable,
} from '../../store/slices/mediaSlice';
import { selectNeedRecordingConsent } from '../../store/slices/recordingSlice';
import { showConsentNotification } from '../../utils/showConsentNotification';

export interface MediaContextValue {
  getDeviceDetails: (constraints: { audio?: boolean; video?: boolean }) => Promise<void>;
  videoDevices?: MediaDeviceInfo[];
  audioInDevices?: MediaDeviceInfo[];
  audioOutDevices?: MediaDeviceInfo[];
  hasCamera?: boolean;
  hasMicrophone?: boolean;
  hasAllDevicesDetails: boolean;
  hasAllVideoDetails: boolean;
  hasAllAudioDetails: boolean;
  permissionDenied: boolean;
  defaultAudioDevice?: DeviceId;
  defaultVideoDevice?: DeviceId;
  requestAudioPermission: () => Promise<void>;
  changeAudioInput: (audioDeviceId?: DeviceId) => Promise<void>;
  changeVideoInput: (videoDeviceId?: DeviceId) => Promise<void>;
  trySetAudio: (enabled: boolean) => Promise<void>;
  trySetVideo: (enabled: boolean) => Promise<void>;
  trySetBackground: (backgroundConfig: BackgroundConfig) => Promise<void>;
  trySetScreenShare: (enabled: boolean) => Promise<void>;
  setMaxQuality: (qualityCap: VideoSetting) => void;
  outgoingMediaStream: MediaStream;
  outgoingScreenStream: MediaStream;
  getAudioLevel: () => SignalLevel | undefined;
}

const MediaContext = React.createContext<MediaContextValue | null>(null);

interface MediaProviderProps {
  children: ReactNode;
}

enum HandledErrorType {
  Audio = 'audio',
  Video = 'video',
  Screen = 'screen',
}

export const MediaProvider = ({ children }: MediaProviderProps) => {
  const askConsent = useAppSelector(selectNeedRecordingConsent);
  const [devices, setDevices] = useState<MediaDeviceInfo[] | undefined>();

  const [defaultAudioDevice, setDefaultAudioDevice] = useState<DeviceId | undefined>();
  const [defaultVideoDevice, setDefaultVideoDevice] = useState<DeviceId | undefined>();

  const dispatch = useAppDispatch();
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  const hasAllDevicesDetails = useMemo(() => devices !== undefined && devices.every((d) => d.label !== ''), [devices]);

  const hasAllAudioDetails = useMemo(
    () => devices !== undefined && devices.filter((d) => d.kind === 'audioinput').every((d) => d.label !== ''),
    [devices]
  );

  const hasAllVideoDetails = useMemo(
    () => devices !== undefined && devices.filter((d) => d.kind === 'videoinput').every((d) => d.label !== ''),
    [devices]
  );

  const getAudioLevel = useCallback(() => {
    return localMediaContext.getAudioLevel();
  }, []);

  //TODO: move to LocalMedia
  useEffect(() => {
    const deviceChangeHandler = () => {
      return LocalMedia.enumerateDevices()
        .then(setDevices)
        .catch((e) => {
          console.error('failed to enumerate media devices:', e);
        });
    };

    navigator.mediaDevices.addEventListener('devicechange', deviceChangeHandler);
    deviceChangeHandler();

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', deviceChangeHandler);
    };
  }, []);

  useEffect(() => {
    const mediaStateHandler = ({ kind, enabled }: { kind: 'audio' | 'video'; enabled: boolean }) => {
      switch (kind) {
        case 'audio':
          dispatch(setAudioEnable(enabled));
          break;
        case 'video':
          dispatch(setVideoEnable(enabled));
          break;
      }
    };

    const mediaDeviceHandler = ({ kind, deviceId }: { kind: 'audio' | 'video'; deviceId: DeviceId }) => {
      switch (kind) {
        case 'audio':
          dispatch(changedAudioDevice(deviceId));
          break;
        case 'video':
          dispatch(changedVideoDevice(deviceId));
          break;
      }
    };

    const backgroundChangedHandler = (backgroundConfig: BackgroundConfig) =>
      dispatch(setBackgroundEffects(backgroundConfig));

    const speakerActivityHandler = (isUserSpeaking: boolean) => {
      dispatch(setSpeakerActivity(isUserSpeaking));
    };
    const screenShareStoppedHandler = () => dispatch(setScreenShare(false));

    localMediaContext.addEventListener('stateChanged', mediaStateHandler);
    localMediaContext.addEventListener('deviceChanged', mediaDeviceHandler);
    localMediaContext.addEventListener('backgroundChanged', backgroundChangedHandler);
    localMediaContext.addEventListener('isUserSpeaking', speakerActivityHandler);
    localScreenContext.addEventListener('stopped', screenShareStoppedHandler);

    return () => {
      localMediaContext.removeEventListener('stateChanged', mediaStateHandler);
      localMediaContext.removeEventListener('deviceChanged', mediaDeviceHandler);
      localMediaContext.removeEventListener('backgroundChanged', backgroundChangedHandler);
      localMediaContext.removeEventListener('isUserSpeaking', speakerActivityHandler);
      localScreenContext.removeEventListener('stopped', screenShareStoppedHandler);
    };
  }, [dispatch]);

  const permissionDeniedObserver: <T>(result: Promise<T>) => Promise<T> = useCallback(
    (result) => {
      dispatch(setMediaChangeInProgress(true));
      result
        .then((inner) => {
          setPermissionDenied(false);
          return inner;
        })
        .catch((e) => {
          if (e.name === 'NotAllowedError') {
            setPermissionDenied(true);
          }
        })
        .finally(() => dispatch(setMediaChangeInProgress(false)));
      return result;
    },
    [dispatch]
  );

  const requestAudioPermission = useCallback(async () => {
    return permissionDeniedObserver(localMediaContext.requestPermission({ audio: true })).catch((e) => {
      console.error('failed get device permission', e);
    });
  }, [permissionDeniedObserver]);

  const errorNotificationHandler = useCallback(
    (e: Error, mediaType: HandledErrorType, action: string) => {
      if (e.name === 'NotAllowedError') {
        console.warn(`permission denied for media ${mediaType}`);
        /* Show warning when device access is blocked.
         * Always for camera and microphone and for screen share in Firefox (in Chrome-based browsers it is only temporary)
         */
        if (mediaType !== HandledErrorType.Screen || (permissionDenied && browser.isFirefox())) {
          notifications.warning(i18next.t('media-denied-warning', { mediaType }), {
            preventDuplicate: true,
          });
        }
      } else {
        console.error(`media ${mediaType} error for ${action}`, e);
        notifications.error(i18next.t('media-access-error', { mediaType }), {
          preventDuplicate: true,
        });
      }
    },
    [permissionDenied]
  );

  //TODO: move to LocalMedia
  const fetchProtectedDeviceDetails = useCallback(
    async (constraints: MediaStreamConstraints) => {
      if (permissionDenied) {
        throw new Error('Media still in permission denied state');
      }
      const media = await permissionDeniedObserver(navigator.mediaDevices.getUserMedia(constraints));

      const audioTrack = media.getAudioTracks()[0];
      if (audioTrack) {
        const { deviceId } = audioTrack.getSettings();
        setDefaultAudioDevice(deviceId as DeviceId | undefined);
      }

      const videoTrack = media.getVideoTracks()[0];
      if (videoTrack) {
        const { deviceId } = videoTrack.getSettings();
        setDefaultVideoDevice(deviceId as DeviceId | undefined);
      }

      media.getTracks().forEach((t) => {
        t.enabled = false;
      });

      const devices = await LocalMedia.enumerateDevices().finally(() => {
        // release all tracks
        media.getTracks().forEach((t) => t.stop());
      });
      setDevices(devices);
    },
    [permissionDeniedObserver, permissionDenied]
  );

  const getDeviceDetails = useCallback(
    ({ audio, video }: { audio?: boolean; video?: boolean }) => {
      if (permissionDenied) {
        return Promise.reject();
      }

      if (
        permissionDenied ||
        (hasAllDevicesDetails &&
          !(audio && defaultAudioDevice === undefined) &&
          !(video && defaultVideoDevice === undefined))
      ) {
        return Promise.resolve();
      }

      const requestAudio = audio || (audio === undefined && video === undefined);
      const requestVideo = video;
      const constraints = getConstraints({ constraints: { audio: requestAudio, video: requestVideo } });
      return fetchProtectedDeviceDetails(constraints).catch((e) =>
        errorNotificationHandler(e, HandledErrorType.Audio, 'device-details')
      );
    },
    [
      fetchProtectedDeviceDetails,
      errorNotificationHandler,
      hasAllDevicesDetails,
      defaultAudioDevice,
      defaultVideoDevice,
      permissionDenied,
    ]
  );

  // Does this work to avoid re-renders when the value of the context.Provider changes?
  const memoedChildren = useMemo(() => children, [children]);

  const videoDevices = devices?.filter((d) => d.kind === 'videoinput');
  const audioInDevices = devices?.filter((d) => d.kind === 'audioinput');
  const audioOutDevices = devices?.filter((d) => d.kind === 'audiooutput');
  const hasCamera = videoDevices && videoDevices.length > 0;
  const hasMicrophone = audioInDevices && audioInDevices.length > 0;

  const changeAudioInput = useCallback(
    (audioDeviceId?: DeviceId) => {
      return permissionDeniedObserver(localMediaContext.reconfigure({ audioInDevice: audioDeviceId })).catch((e) =>
        errorNotificationHandler(e, HandledErrorType.Audio, `change to dev ${audioDeviceId}`)
      );
    },
    [permissionDeniedObserver, errorNotificationHandler]
  );

  const changeVideoInput = useCallback(
    (videoDeviceId?: DeviceId) => {
      return permissionDeniedObserver(localMediaContext.reconfigure({ videoDevice: videoDeviceId })).catch((e) =>
        errorNotificationHandler(e, HandledErrorType.Video, `change to dev ${videoDeviceId}`)
      );
    },
    [permissionDeniedObserver, errorNotificationHandler]
  );

  const trySetScreenShare = useCallback(
    async (enabled: boolean) => {
      if (enabled) {
        if (askConsent) {
          const consent = await showConsentNotification(dispatch);
          if (!consent) {
            return;
          }
        }

        return permissionDeniedObserver(localScreenContext.start())
          .then(() => {
            dispatch(setScreenShare(true));
          })
          .catch((e) => errorNotificationHandler(e, HandledErrorType.Screen, 'switch on'));
      } else {
        localScreenContext.release();
      }
    },
    [dispatch, permissionDeniedObserver, errorNotificationHandler, askConsent]
  );

  const trySetAudio = useCallback(
    async (enabled: boolean) => {
      if (askConsent && enabled) {
        const consent = await showConsentNotification(dispatch);
        if (!consent) {
          return;
        }
      }

      return permissionDeniedObserver(localMediaContext.reconfigure({ audio: enabled })).catch((e) =>
        errorNotificationHandler(e, HandledErrorType.Audio, `switch ${enabled ? 'on' : 'off'}`)
      );
    },
    [permissionDeniedObserver, errorNotificationHandler, askConsent, dispatch]
  );

  const trySetVideo = useCallback(
    async (enabled: boolean) => {
      if (askConsent && enabled) {
        const consent = await showConsentNotification(dispatch);
        if (!consent) {
          return;
        }
      }

      return permissionDeniedObserver(localMediaContext.reconfigure({ video: enabled })).catch((e) =>
        errorNotificationHandler(e, HandledErrorType.Video, `switch ${enabled ? 'on' : 'off'}`)
      );
    },
    [permissionDeniedObserver, errorNotificationHandler, askConsent, dispatch]
  );

  const trySetBackground = useCallback(
    (backgroundConfig: BackgroundConfig) => {
      return permissionDeniedObserver(localMediaContext.reconfigure({ backgroundConfig })).catch((e) =>
        errorNotificationHandler(e, HandledErrorType.Video, `switch_blur ${backgroundConfig ? 'on' : 'off'}`)
      );
    },
    [permissionDeniedObserver, errorNotificationHandler]
  );

  const setMaxQuality = async (qualityCap: VideoSetting) => {
    const screenQualityCap = qualityCap === VideoSetting.Off ? VideoSetting.Low : qualityCap;
    const actions = [localMediaContext.setQuality(qualityCap), localScreenContext.setQuality(screenQualityCap)];

    Promise.allSettled(actions)
      .then(() => dispatch(setQualityCap(qualityCap)))
      .catch((e) => {
        console.error('Failed to set max stream quality', e, qualityCap);
        notifications.error(`Failed to set max stream quality: ${e.message}`);
      });
  };

  return (
    <MediaContext.Provider
      value={{
        getDeviceDetails,
        videoDevices,
        audioInDevices,
        audioOutDevices,
        hasCamera,
        hasMicrophone,
        hasAllDevicesDetails,
        hasAllVideoDetails,
        hasAllAudioDetails,
        permissionDenied,
        defaultAudioDevice,
        defaultVideoDevice,
        requestAudioPermission,
        changeAudioInput,
        changeVideoInput,
        trySetAudio,
        trySetVideo,
        trySetBackground,
        trySetScreenShare,
        setMaxQuality,
        outgoingMediaStream: localMediaContext.outputMediaStream,
        outgoingScreenStream: localScreenContext.stream,
        getAudioLevel,
      }}
    >
      {memoedChildren}
    </MediaContext.Provider>
  );
};

export const useMediaContext = (): MediaContextValue => {
  const contextValue = useContext(MediaContext);

  if (process.env.NODE_ENV !== 'production' && !contextValue) {
    throw new Error(
      'could not find media-provider context value; please ensure the component is wrapped in a <Provider>'
    );
  }

  return contextValue as MediaContextValue;
};

export default MediaProvider;
