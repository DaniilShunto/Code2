// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { RoomMode, selectHotkeysEnabled } from '@opentalk/common';
import { automodStore } from '@opentalk/components';
import { debounce } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '.';
import { automod } from '../api/types/outgoing';
import { useMediaContext } from '../components/MediaProvider';
import { useFullscreenContext } from '../hooks/useFullscreenContext';
import { selectAudioEnabled, selectMediaChangeInProgress, selectVideoEnabled } from '../store/slices/mediaSlice';
import { selectCurrentRoomMode } from '../store/slices/roomSlice';

const MICROPHONE = 'm';
const VIDEO = 'v';
const FULLSCREEN = 'f';
const PUSH_TO_TALK = ' ';
const NEXT_SPEAKER = 'n';
const HOTKEYS = [VIDEO, MICROPHONE, FULLSCREEN, PUSH_TO_TALK, NEXT_SPEAKER];
const HOTKEY_DEBOUNCE_TIME = 100; //ms

export const useHotkeys = () => {
  const mediaContext = useMediaContext();
  const fullscreenContext = useFullscreenContext();
  const hotkeysEnabled = useAppSelector(selectHotkeysEnabled);
  const audioEnabled = useAppSelector(selectAudioEnabled);
  const videoEnabled = useAppSelector(selectVideoEnabled);
  const roomMode = useAppSelector(selectCurrentRoomMode);
  const speakerState = useAppSelector(automodStore.selectSpeakerState);
  const dispatch = useDispatch();

  const isLoadingMedia = useAppSelector(selectMediaChangeInProgress);
  const startingAudio = useRef<Promise<void> | undefined>();
  const stoppingAudio = useRef<Promise<void> | undefined>();
  const [isInPushedToTalkMode, setIsInPushedToTalkMode] = useState(false);

  const switchAudio = useCallback((value: boolean) => mediaContext.trySetAudio(value), [mediaContext]);

  const toggleAudio = useCallback(() => {
    if (!isLoadingMedia) {
      switchAudio(!audioEnabled);
    }
  }, [isLoadingMedia, switchAudio, audioEnabled]);

  const toggleVideo = useCallback(() => {
    if (!isLoadingMedia) {
      mediaContext.trySetVideo(!videoEnabled);
    }
  }, [isLoadingMedia, mediaContext, videoEnabled]);

  // Push-to-talk function shall work ONLY if the user is muted (audio is disabled)
  // On keydown we start the push-to-talk mode and unmute the user,
  // On keyup - stop the push-to-talk mode and mute the user again
  // We use `startingAudio` and `stoppingAudio` promises to prevent race condition
  // between audio en-/disabling actions in mediaContext
  const pushToTalk = (type: 'keyup' | 'keydown') => {
    const startAudio = async () => {
      await switchAudio(true);
      startingAudio.current = undefined;
    };

    const stopAudio = async () => {
      await switchAudio(false);
      stoppingAudio.current = undefined;
    };

    switch (type) {
      case 'keydown':
        if (!audioEnabled) {
          if (startingAudio.current === undefined) {
            if (stoppingAudio.current === undefined) {
              startingAudio.current = startAudio();
            } else {
              startingAudio.current = stoppingAudio.current.then(() => startAudio());
            }
          }
          setIsInPushedToTalkMode(true);
        }
        break;
      case 'keyup':
        if (isInPushedToTalkMode) {
          if (stoppingAudio.current === undefined) {
            if (startingAudio.current === undefined) {
              stoppingAudio.current = stopAudio();
            } else {
              stoppingAudio.current = startingAudio.current.then(() => stopAudio());
            }
          }
          setIsInPushedToTalkMode(false);
        }
        break;
    }
  };

  const toggleFullscreenView = useCallback(() => {
    fullscreenContext[fullscreenContext.active ? 'exit' : 'enter']();
  }, [fullscreenContext]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!hotkeysEnabled) {
        return;
      }

      const { type, repeat, key } = event;

      if (HOTKEYS.includes(key) && (type === 'keyup' || type === 'keydown')) {
        event.preventDefault();

        switch (key) {
          case MICROPHONE:
            if (type === 'keyup' && mediaContext.hasMicrophone) {
              toggleAudio();
            }
            break;
          case VIDEO:
            if (type === 'keyup' && mediaContext.hasCamera) {
              toggleVideo();
            }
            break;
          case FULLSCREEN:
            if (type === 'keyup') {
              toggleFullscreenView();
            }
            break;
          case PUSH_TO_TALK:
            // if (!repeat) {
            pushToTalk(type);
            //}
            break;
          case NEXT_SPEAKER:
            if (!repeat && roomMode === RoomMode.TalkingStick && speakerState === 'active') {
              // Attempted to achieve `setAsTransitioningSpeaker` in a middleware, but we are unable
              // to define `pass.action` case twice as it is already defined in the ee-components.
              // We would need to extract case definition from ee-components to the middleware,
              // which then brings same sequential updates like in here, just in the different place.
              dispatch(automodStore.actions.setAsTransitioningSpeaker());
              dispatch(automod.actions.pass.action());
            }
            break;
          default:
            break;
        }
      }
    },
    [
      mediaContext.hasMicrophone,
      mediaContext.hasCamera,
      pushToTalk,
      hotkeysEnabled,
      audioEnabled,
      toggleAudio,
      toggleVideo,
      toggleFullscreenView,
      roomMode,
      speakerState,
      dispatch,
    ]
  );

  useEffect(() => {
    const debouncedHandleKeypress = debounce(handleKeyPress, HOTKEY_DEBOUNCE_TIME);

    window.addEventListener('keydown', debouncedHandleKeypress);
    window.addEventListener('keyup', debouncedHandleKeypress);

    return () => {
      window.removeEventListener('keydown', debouncedHandleKeypress);
      window.removeEventListener('keyup', debouncedHandleKeypress);
    };
  }, [handleKeyPress]);
};
