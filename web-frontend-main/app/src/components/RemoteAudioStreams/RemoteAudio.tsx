// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

/*  Since we probably won't be able to provide a real time transcription for videos as of now, media-has-caption will be disabled for now.*/
import React, { useEffect, useRef } from 'react';

import { useRemoteMedia } from '../../hooks/media';
import { MediaDescriptor } from '../../modules/WebRTC';

const RemoteAudio = ({ descriptor }: { descriptor: MediaDescriptor }) => {
  const stream = useRemoteMedia(descriptor, 'audio');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current !== null && stream !== undefined) {
      const audioElement = audioRef.current;
      audioElement.srcObject = stream;
      return () => {
        audioElement.srcObject = null;
      };
    }
  }, [stream, audioRef]);

  return stream ? (
    <audio ref={audioRef} autoPlay>
      <track kind="captions" />
    </audio>
  ) : null;
};

export default React.memo(RemoteAudio);
