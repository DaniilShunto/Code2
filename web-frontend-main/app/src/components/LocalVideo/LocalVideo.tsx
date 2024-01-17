// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Grid } from '@mui/material';
import { PinIcon } from '@opentalk/common';
import { RefObject, useCallback, useEffect, useRef } from 'react';
import { VideoHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

import NameTile from '../../commonComponents/NameTile/NameTile';
import { useAppSelector } from '../../hooks';
import {
  selectAudioEnabled,
  selectMediaChangeInProgress,
  selectShareScreenEnabled,
  selectVideoEnabled,
} from '../../store/slices/mediaSlice';
import { selectMirroredVideoEnabled } from '../../store/slices/uiSlice';
import { selectDisplayName } from '../../store/slices/userSlice';
import { useMediaContext } from '../MediaProvider';
import { OverlayIconButton } from '../ParticipantWindow/fragments/VideoOverlay';

type PropsType = VideoHTMLAttributes<HTMLVideoElement>;

const Container = styled(Grid)({
  position: 'relative',

  '&::before': {
    content: '""',
    top: 0,
    left: 0,
    display: 'block',
    height: 0,
    width: '0',
    paddingBottom: 'calc(9/16 * 100%)',
  },
});

const NoVideoText = styled('div')({
  position: 'absolute',
  transform: 'translateY(50%)',
  background: 'rgba(38, 48, 61, 0.95)',
  color: 'white',
  borderRadius: '0.312rem',
  padding: '1ex',
});

const Video = styled('video', {
  shouldForwardProp: (prop) => !['noRoundedCorners', 'mirroringEnabled'].includes(prop as string),
})<{ noRoundedCorners?: boolean; mirroringEnabled?: boolean }>(({ theme, noRoundedCorners, mirroringEnabled }) => ({
  position: 'absolute',
  width: 'inherit',
  height: 'inherit',
  maxWidth: '100%',
  maxHeight: '100%',
  borderRadius: noRoundedCorners ? 0 : theme.borderRadius.medium,
  transform: mirroringEnabled ? 'scale(-1,1)' : '',
}));

const ThumbnailVideo = styled(Video)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  bottom: theme.spacing(1),
  maxWidth: 100,
}));

const PinIconButton = styled(OverlayIconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  left: theme.spacing(1),
  zIndex: theme.zIndex.mobileStepper,
}));

interface LocalVideoProps extends PropsType {
  noRoundedCorners?: boolean;
  fullscreenMode?: boolean;
  hideUserName?: boolean;
  isVideoPinned?: boolean;
  togglePinVideo?: () => void;
}

const LocalVideo = ({
  noRoundedCorners,
  fullscreenMode,
  togglePinVideo,
  isVideoPinned,
  hideUserName,
  ...props
}: LocalVideoProps) => {
  const videoEnabled = useAppSelector(selectVideoEnabled);
  const screenShareEnabled = useAppSelector(selectShareScreenEnabled);
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoThumbnailRef = useRef<HTMLVideoElement>(null);
  const mediaContext = useMediaContext();
  const outgoingVideoStream = mediaContext.outgoingMediaStream;
  const outgoingScreenStream = mediaContext.outgoingScreenStream;
  const displayName = useAppSelector(selectDisplayName);
  const isAudioOn = useAppSelector(selectAudioEnabled) && !!mediaContext.hasMicrophone;
  const mirroredVideoEnabled = useAppSelector(selectMirroredVideoEnabled);
  const isLoadingMedia = useAppSelector(selectMediaChangeInProgress);

  const isVideoRunning =
    outgoingVideoStream?.getVideoTracks().find((t) => t.enabled && t.readyState === 'live') !== undefined;

  const isVideoMissing = videoEnabled && !isLoadingMedia && !isVideoRunning;

  const attachVideo = useCallback((refObject: RefObject<HTMLVideoElement>, stream: MediaStream) => {
    if (refObject.current !== null) {
      refObject.current.volume = 0;
      refObject.current.srcObject = stream;
      refObject.current.playsInline = true;
    }
  }, []);

  const detachVideo = useCallback((refObject: RefObject<HTMLVideoElement>) => {
    if (refObject.current !== null) {
      refObject.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (isVideoMissing) {
      console.warn('Video is enabled but video tracks are closed');
    }
  }, [isVideoMissing, t]);

  useEffect(() => {
    if (screenShareEnabled && videoEnabled) {
      attachVideo(videoThumbnailRef, outgoingVideoStream);
      attachVideo(videoRef, outgoingScreenStream);
      return;
    }
    if (videoEnabled) {
      attachVideo(videoRef, outgoingVideoStream);
      detachVideo(videoThumbnailRef);
      return;
    }
    if (screenShareEnabled) {
      attachVideo(videoRef, outgoingScreenStream);
      detachVideo(videoThumbnailRef);
      return;
    }
    detachVideo(videoRef);
    detachVideo(videoThumbnailRef);
  }, [outgoingVideoStream, outgoingScreenStream, screenShareEnabled, attachVideo, detachVideo, videoEnabled]);

  return (
    <Container container justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
      {(videoEnabled || screenShareEnabled) && (
        <>
          {fullscreenMode && (
            <PinIconButton
              onClick={togglePinVideo}
              aria-label={t(`indicator-pinned`, {
                participantName: displayName || '',
              })}
              color={isVideoPinned ? 'primary' : 'secondary'}
            >
              <PinIcon />
            </PinIconButton>
          )}
          <Video
            ref={videoRef}
            autoPlay
            muted
            noRoundedCorners={noRoundedCorners}
            mirroringEnabled={mirroredVideoEnabled && !screenShareEnabled}
            {...props}
          />
          {screenShareEnabled && videoEnabled && (
            <ThumbnailVideo
              ref={videoThumbnailRef}
              autoPlay
              muted
              noRoundedCorners={noRoundedCorners}
              mirroringEnabled={mirroredVideoEnabled}
              {...props}
            />
          )}
          {!hideUserName && <NameTile audioOn={isAudioOn} displayName={displayName || ''} className="positionBottom" />}
        </>
      )}
      {isVideoMissing && <NoVideoText>{t('localvideo-no-device')}</NoVideoText>}
    </Container>
  );
};

export default LocalVideo;
