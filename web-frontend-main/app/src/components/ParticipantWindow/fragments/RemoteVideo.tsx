// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

/*  Since we probably won't be able to provide a real time transcription for videos as of now, media-has-caption will be disabled for now.*/

/* eslint-disable jsx-a11y/media-has-caption */
import { CircularProgress, Grid, Stack, styled, Tooltip } from '@mui/material';
import { VideoSetting, WarningIcon } from '@opentalk/common';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useRef, VideoHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { useRemoteMedia } from '../../../hooks/media';
import { idFromDescriptor, MediaDescriptor, requestVideoQuality } from '../../../modules/WebRTC';
import { selectQualityCap } from '../../../store/slices/mediaSlice';
import { selectSubscriberStateById } from '../../../store/slices/mediaSubscriberSlice';

const Container = styled(Grid)({
  width: '100%',
  height: '100%',
});

const Loader = styled(CircularProgress)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const Video = styled('video')({
  width: '100%',
  height: '100%',
});

type IRemoteVideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  descriptor: MediaDescriptor;
  mediaRef: string;
};

const RemoteVideo = ({ descriptor, mediaRef }: IRemoteVideoProps) => {
  const qualityMax = useAppSelector(selectQualityCap);
  const { error } = useAppSelector(selectSubscriberStateById(descriptor, 'video'));
  const { t } = useTranslation();

  const stream = useRemoteMedia(descriptor, 'video');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (videoRef.current !== null && stream !== undefined) {
      const videoElement = videoRef.current;
      videoElement.srcObject = stream;
      videoElement.playsInline = true;
      return () => {
        videoElement.srcObject = null;
      };
    }
    if (videoRef.current !== null) {
      return () => {
        videoRef.current = null;
      };
    }
    return;
  }, [stream, videoRef]);

  const requestQuality = useCallback(
    (quality: VideoSetting) => requestVideoQuality(descriptor, quality, mediaRef),
    [descriptor, mediaRef]
  );

  const updateQuality = useCallback(
    (size: number) => {
      const qualityCap = descriptor.mediaType === 'screen' ? Math.max(qualityMax, VideoSetting.Low) : qualityMax;
      let target;
      switch (true) {
        case size >= 500:
          target = VideoSetting.High;
          break;
        case size >= 200:
          target = VideoSetting.Medium;
          break;
        default:
          target = VideoSetting.Low;
          break;
      }

      const quality = Math.min(qualityCap, target);
      requestQuality(quality);
    },
    [qualityMax, requestQuality]
  );

  const handleResize = useCallback(() => {
    if (!containerRef.current) return;

    const videoWidth = containerRef.current.clientWidth;
    const videoHeight = containerRef.current.clientHeight;
    const size = Math.min(videoHeight, videoWidth);
    updateQuality(size);
  }, [containerRef, updateQuality]);

  useEffect(() => {
    const resizeHandler = debounce(handleResize, 100);
    window.addEventListener('resize', resizeHandler);
    resizeHandler();

    return () => {
      window.removeEventListener('resize', resizeHandler);
      requestQuality(VideoSetting.Off);
    };
  }, [handleResize]);

  if (error) {
    return (
      <Tooltip title={t('media-subscription-failed') || ''}>
        <Stack>
          <WarningIcon />
        </Stack>
      </Tooltip>
    );
  }

  return (
    <Container
      ref={containerRef}
      container
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      data-testid={`remoteVideo-${idFromDescriptor(descriptor)}`}
    >
      {stream ? <Video muted autoPlay ref={videoRef} /> : <Loader />}
    </Container>
  );
};

export default RemoteVideo;
