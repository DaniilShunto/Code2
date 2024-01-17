// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Slide, styled } from '@mui/material';
import { MediaSessionType, ParticipantId, VideoSetting } from '@opentalk/common';
import { useCallback, useEffect, useState, useMemo, useRef } from 'react';

import { useAppSelector } from '../../../hooks';
import { selectQualityCap } from '../../../store/slices/mediaSlice';
import { selectSubscriberHasVideoById } from '../../../store/slices/mediaSubscriberSlice';
import { AvatarContainer } from './AvatarContainer';
import RemoteVideo from './RemoteVideo';
import ScreenPresenterVideo from './ScreenPresenterVideo';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
});

export type PresenterVideoPosition = 'bottomLeft' | 'upperRight' | 'bottomRight';

interface ParticipantVideoProps {
  participantId: ParticipantId;
  presenterVideoIsActive?: boolean;
  isThumbnail?: boolean;
  mediaRef: string;
}

const ParticipantVideo = ({ participantId, presenterVideoIsActive, isThumbnail, mediaRef }: ParticipantVideoProps) => {
  const videoDescriptor = useMemo(() => ({ participantId, mediaType: MediaSessionType.Video }), [participantId]);
  const screenDescriptor = useMemo(() => ({ participantId, mediaType: MediaSessionType.Screen }), [participantId]);

  const qualityCap = useAppSelector(selectQualityCap);
  const hasCameraVideo = useAppSelector(selectSubscriberHasVideoById(videoDescriptor));
  const showCamera = hasCameraVideo && qualityCap !== VideoSetting.Off;
  const hasScreenVideo = useAppSelector(selectSubscriberHasVideoById(screenDescriptor));

  const containerRef = useRef(null);
  const [isVideoPinned, setIsVideoPinned] = useState<boolean>(false);
  const [showPresenterVideo, setShowPresenterVideo] = useState<boolean>(!!presenterVideoIsActive);

  const [presenterVideoPosition, setPresenterVideoPosition] = useState<PresenterVideoPosition>('bottomRight');
  const positionsArray: Array<PresenterVideoPosition> = ['bottomLeft', 'upperRight', 'bottomRight'];

  const slideDirection = presenterVideoPosition === 'upperRight' ? 'down' : 'up';
  const isVisible = isVideoPinned || presenterVideoIsActive || showPresenterVideo;

  useEffect(() => {
    const timer = setTimeout(() => setShowPresenterVideo(false), 5000);
    return () => clearTimeout(timer);
  }, [showPresenterVideo]);

  const displayPresenterVideo = useCallback(() => {
    !presenterVideoIsActive && setShowPresenterVideo(true);
  }, [presenterVideoIsActive]);

  const handleToggle = () => setIsVideoPinned((videoPinned) => !videoPinned);

  const movePresenterVideo = () => {
    const currentIndex = positionsArray.indexOf(presenterVideoPosition);
    const nextIndex = (currentIndex + 1) % 3;
    setPresenterVideoPosition(positionsArray[nextIndex]);
  };

  if (hasScreenVideo) {
    return (
      <Container onMouseMove={displayPresenterVideo} data-testid="participantSreenShareVideo" ref={containerRef}>
        <RemoteVideo descriptor={screenDescriptor} mediaRef={mediaRef} />
        <Slide direction={slideDirection} in={isVisible} mountOnEnter container={containerRef.current}>
          <ScreenPresenterVideo
            participantId={participantId}
            isVideoPinned={isVideoPinned}
            togglePin={handleToggle}
            videoPosition={presenterVideoPosition}
            changeVideoPosition={movePresenterVideo}
            isThumbnail={isThumbnail}
            mediaRef={`${mediaRef}-screen`}
          />
        </Slide>
      </Container>
    );
  }

  if (showCamera) {
    return <RemoteVideo descriptor={videoDescriptor} mediaRef={mediaRef} />;
  }

  return <AvatarContainer participantId={participantId} />;
};

export default ParticipantVideo;
