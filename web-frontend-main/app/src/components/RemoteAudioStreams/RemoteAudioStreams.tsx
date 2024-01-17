// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import React from 'react';

import { useAppSelector } from '../../hooks';
import { idFromDescriptor } from '../../modules/WebRTC';
import { selectAllSubscribers } from '../../store/slices/mediaSubscriberSlice';
import RemoteAudio from './RemoteAudio';

const RemoteAudioStreams = () => {
  const subscribers = useAppSelector(selectAllSubscribers);

  const subscribersWithAudio = subscribers.filter(({ audio }) => audio);
  return (
    <>
      {subscribersWithAudio.map((descriptor) => (
        <RemoteAudio key={idFromDescriptor(descriptor)} descriptor={descriptor} />
      ))}
    </>
  );
};

export default RemoteAudioStreams;
