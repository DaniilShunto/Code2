// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Grid, styled, IconButton } from '@mui/material';
import { PinIcon, FullscreenViewIcon, ParticipantId, MediaSessionType } from '@opentalk/common';
import { MouseEventHandler, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import LayoutOptions from '../../../enums/LayoutOptions';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { useFullscreenContext } from '../../../hooks/useFullscreenContext';
import { selectStatsPacketLossByDescriptor } from '../../../store/slices/connectionStatsSlice';
import { selectIsSubscriberOnlineByDescriptor } from '../../../store/slices/mediaSubscriberSlice';
import { selectParticipantName } from '../../../store/slices/participantsSlice';
import { pinnedParticipantIdSet, selectCinemaLayout, selectPinnedParticipantId } from '../../../store/slices/uiSlice';
import BrokenSubscriberIndicator from './BrokenSubscriberIndicator';
import Statistics from './Statistics';

const OverlayContainer = styled(Grid)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  fontSize: 'inherit',
  width: '100%',
  padding: theme.spacing(1),
  background: 'transparent',
}));

const IndicatorContainer = styled(Grid)(({ theme }) => ({
  width: '100%',
  display: 'grid',
  gridAutoFlow: 'column',
  gridAutoColumns: theme.spacing(3),
  gap: theme.spacing(1),
}));

export const OverlayIconButton = styled(IconButton)(({ theme }) => ({
  '&.MuiIconButton-colorPrimary, &.MuiIconButton-colorSecondary': {
    height: theme.spacing(2.5),
    width: theme.spacing(3),
    padding: theme.spacing(1),
    opacity: 0.8,
    color: theme.palette.primary.contrastText,
    '& .MuiSvgIcon-root': {
      fontSize: theme.typography.pxToRem(13),
    },
    ':hover': {
      opacity: 1,
    },
  },

  '&.MuiIconButton-colorPrimary': {
    svg: {
      fill: theme.palette.secondary.contrastText,
    },
    ':hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },

  '&.MuiIconButton-colorSecondary': {
    ':hover': {
      backgroundColor: theme.palette.secondary.lighter,
    },
  },
}));

interface VideoOverlayProps {
  participantId: ParticipantId;
  active: boolean;
}

const VideoOverlay = ({ participantId, active }: VideoOverlayProps) => {
  const userLayout = useAppSelector(selectCinemaLayout);
  const dispatch = useAppDispatch();
  const screenDescriptor = useMemo(() => ({ participantId, mediaType: MediaSessionType.Screen }), [participantId]);
  const videoDescriptor = useMemo(() => ({ participantId, mediaType: MediaSessionType.Video }), [participantId]);

  const hasScreen = useAppSelector(selectIsSubscriberOnlineByDescriptor(screenDescriptor));
  const hasVideo = useAppSelector(selectIsSubscriberOnlineByDescriptor(videoDescriptor));
  const descriptor = hasScreen ? screenDescriptor : videoDescriptor;
  const isOnline = hasScreen || hasVideo;
  const hasPacketLoss = useAppSelector(selectStatsPacketLossByDescriptor(descriptor));
  const displayName = useAppSelector(selectParticipantName(participantId));
  const pinnedParticipantId = useAppSelector(selectPinnedParticipantId);
  const { t } = useTranslation();

  const fullscreenHandle = useFullscreenContext();

  const togglePin = useCallback(() => {
    const updatePinnedId = pinnedParticipantId === participantId ? undefined : participantId;
    dispatch(pinnedParticipantIdSet(updatePinnedId));
  }, [dispatch, participantId, pinnedParticipantId]);

  const openFullScreenView: MouseEventHandler = useCallback(
    (e) => {
      e.stopPropagation();
      fullscreenHandle.enter(participantId);
    },
    [fullscreenHandle, participantId]
  );

  const getOverlayButtons = () => (
    <IndicatorContainer item>
      {isOnline && (active || hasPacketLoss) && <Statistics descriptor={descriptor} />}
      {active && (
        <>
          {userLayout === LayoutOptions.Speaker && (
            <OverlayIconButton
              color={pinnedParticipantId === descriptor.participantId ? 'primary' : 'secondary'}
              onClick={togglePin}
              translate="no"
              aria-label={t(`indicator-pinned`, {
                participantName: displayName || '',
              })}
            >
              <PinIcon />
            </OverlayIconButton>
          )}
          <OverlayIconButton aria-label={t('indicator-fullscreen-open')} onClick={openFullScreenView} color="secondary">
            <FullscreenViewIcon />
          </OverlayIconButton>
        </>
      )}
      <BrokenSubscriberIndicator descriptor={descriptor} />
    </IndicatorContainer>
  );

  return <OverlayContainer children={getOverlayButtons()} />;
};

export default VideoOverlay;
