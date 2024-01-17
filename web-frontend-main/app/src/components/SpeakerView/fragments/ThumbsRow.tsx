// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Stack } from '@mui/material';
import React, { useMemo, useState } from 'react';

import { useAppSelector } from '../../../hooks';
import { selectAllOnlineParticipants } from '../../../store/slices/participantsSlice';
import IconSlideButton from './IconSlideButton';
import { Thumbnail } from './Thumbnail';

// ThumbsHolder: the surrounding container of the thumbnails
const ThumbsHolder = styled(Stack)<{ tracks: number }>(({ theme }) => ({
  margin: theme.spacing(2, 0, 0, 0),
  gridGap: theme.spacing(2),
  width: '100%',
}));

export interface ThumbsProps {
  thumbWidth: number;
  thumbsPerWindow: number;
}

const ThumbsRow = ({ thumbWidth, thumbsPerWindow }: ThumbsProps) => {
  const participants = useAppSelector(selectAllOnlineParticipants);

  // firstParticipantIndex: the index of the first participant in the row of thumbs
  const [firstParticipantIndex, setFirstParticipantIndex] = useState<number>(0);

  // endIndex is out of the range of the shown elements (thumbs) (see arraySlice)
  const endIndex = Math.min(firstParticipantIndex + thumbsPerWindow, participants.length);

  // firstIndex is reducing by the thumbs-quantity, minimum = 0
  const slideLeft = () => {
    const firstIndex = Math.max(firstParticipantIndex - thumbsPerWindow, 0);
    setFirstParticipantIndex(firstIndex);
  };

  // endIndex adds length of thumbsPerPage to show the next row of participants, maximum = participants.length
  const slideRight = () => {
    const lastPossibleFirstIndex = Math.max(participants.length - thumbsPerWindow, 0);
    const index = Math.min(endIndex, lastPossibleFirstIndex);
    setFirstParticipantIndex(index);
  };

  const visibleParticipantIds = useMemo(
    () => participants.slice(firstParticipantIndex, endIndex).map((participant) => participant.id),
    [participants, firstParticipantIndex, endIndex]
  );

  return (
    <ThumbsHolder direction="row" gap={1} tracks={thumbsPerWindow} data-testid="ThumbsHolder">
      {firstParticipantIndex > 0 && (
        <IconSlideButton direction="left" aria-label="navigate-to-left" onClick={slideLeft} />
      )}
      {visibleParticipantIds.map((participantId, index) => (
        <Thumbnail width={thumbWidth} key={participantId} participantId={participantId} index={index} />
      ))}
      {endIndex < participants.length && (
        <IconSlideButton direction="right" aria-label="navigate-to-right" onClick={slideRight} />
      )}
    </ThumbsHolder>
  );
};

export default ThumbsRow;
