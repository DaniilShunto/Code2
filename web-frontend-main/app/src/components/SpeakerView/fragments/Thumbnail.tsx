// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import { ParticipantId } from '@opentalk/common';
import React, { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../../hooks';
import { pinnedParticipantIdSet, selectPinnedParticipantId } from '../../../store/slices/uiSlice';
import ParticipantWindow from '../../ParticipantWindow';

const ThumbnailContainer = styled('div')<{ width: number }>(({ width, theme }) => ({
  width: width,
  height: '100%',
  position: 'relative',
  borderRadius: theme.borderRadius.medium,
  overflow: 'hidden',
  padding: 0,
  cursor: 'pointer',
  aspectRatio: '16/9',
  '& .MuiAvatar-root, & .MuiAvatar-circular, & .MuiAvatar-colorDefault': {
    maxWidth: theme.typography.pxToRem(48),
    maxHeight: theme.typography.pxToRem(48),
  },
  '& video': {
    width: '100%',
  },
}));

export const Thumbnail = ({
  participantId,
  width,
  index,
}: {
  participantId: ParticipantId;
  width: number;
  index: number;
}) => {
  const pinnedParticipantId = useAppSelector(selectPinnedParticipantId);
  const dispatch = useAppDispatch();

  const togglePin = useCallback(() => {
    const updatePinnedId = pinnedParticipantId === participantId ? undefined : participantId;
    dispatch(pinnedParticipantIdSet(updatePinnedId));
  }, [dispatch, participantId, pinnedParticipantId]);

  return (
    <ThumbnailContainer onClick={togglePin} width={width} data-testid={`thumbsVideo-${participantId}`}>
      <ParticipantWindow participantId={participantId} isThumbnail={true} mediaRef={`thumb-${index}`} />
    </ThumbnailContainer>
  );
};

export default Thumbnail;
