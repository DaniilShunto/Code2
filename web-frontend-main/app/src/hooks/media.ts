// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { notifications } from '@opentalk/common';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '.';
import { getMediaStream, MediaDescriptor } from '../modules/WebRTC';
import { selectSubscriberLiveById } from '../store/slices/mediaSubscriberSlice';

export const useRemoteMedia = (descriptor: MediaDescriptor, mediaKind: 'video' | 'audio') => {
  const [media, setMediaStream] = useState<{ stream: MediaStream; descriptor: MediaDescriptor } | undefined>(undefined);
  const live = useAppSelector(selectSubscriberLiveById(descriptor, mediaKind));
  const { t } = useTranslation();

  // detach on unmount
  useEffect(() => () => setMediaStream(undefined), []);

  useEffect(() => {
    if (!live || media?.descriptor === descriptor) {
      return;
    }

    const stream = getMediaStream(descriptor);
    const observedTrack = stream.getTracks().find((track) => track.kind === mediaKind);
    if (observedTrack === undefined) {
      console.error(`Expected media track unavailable for participant ${descriptor.participantId}`);
      notifications.error(t('signaling-subscription-failed'));
      return undefined;
    }
    const endedListener = () => {
      if (media?.descriptor === descriptor) {
        setMediaStream(undefined);
      }
      observedTrack.removeEventListener('ended', endedListener);
    };
    observedTrack.addEventListener('ended', endedListener);
    //TODO remove endedListener or use `live` instead of a listener
    setMediaStream({ stream, descriptor });
  }, [live, media?.descriptor, descriptor, t]);

  return media?.stream;
};
