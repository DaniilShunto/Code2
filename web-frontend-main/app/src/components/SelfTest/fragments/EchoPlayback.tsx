// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { notifications } from '@opentalk/common';
import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { EchoTest, EchoTestState } from '../../../modules/WebRTC/EchoTest';
import { selectAudioDeviceId, selectAudioEnabled } from '../../../store/slices/mediaSlice';
import { useMediaContext } from '../../MediaProvider';

export const EchoPlayBack = () => {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaContext = useMediaContext();
  const stream = mediaContext.outgoingMediaStream;
  const isAudioOn = useAppSelector(selectAudioEnabled) && !!mediaContext.hasMicrophone;
  const isAudioLive = isAudioOn && stream?.getAudioTracks().length > 0;
  const audioId = useAppSelector(selectAudioDeviceId);

  const changeHandler = useCallback(
    (instance: EchoTest) => (echoTestState: EchoTestState) => {
      switch (echoTestState) {
        case 'connected':
          break;
        case 'streamUpdate':
          if (audioRef.current === null) {
            console.error('no audio element found.');
            return;
          }
          if (instance.outStream !== undefined) {
            audioRef.current.srcObject = instance.outStream;
          } else {
            console.error('no out stream - broken or called too early.');
            audioRef.current.srcObject = null;
          }
          break;
        case 'closed':
          if (audioRef.current !== null) {
            audioRef.current.srcObject = null;
          }
          break;
        default:
          console.error('unknown state change');
      }
    },
    []
  );

  useEffect(() => {
    if (!isAudioLive) {
      return;
    }

    const audioTrackSettings = stream.getAudioTracks()[0].getSettings();

    if (!audioTrackSettings.echoCancellation) {
      console.warn('no support for echoCancellation', audioTrackSettings);
      notifications.warning(t('echotest-warn-no-echo-cancellation'), { persist: true });
    }
  }, [stream, isAudioLive, t]);

  useEffect(() => {
    if (!isAudioLive) {
      return;
    }

    const echoTest = new EchoTest();
    const echoChangeHandler = changeHandler(echoTest);
    echoTest.addEventListener('stateChanged', echoChangeHandler);
    echoTest.connect(stream).catch((e) => {
      console.error('Failed to connect EchoTest', e);
    });

    return () => {
      echoTest.close();
      echoTest.removeEventListener('stateChanged', echoChangeHandler);
    };
  }, [audioId, stream, isAudioLive, changeHandler]);

  return (
    <audio ref={audioRef} autoPlay>
      <track kind="captions" />
    </audio>
  );
};
