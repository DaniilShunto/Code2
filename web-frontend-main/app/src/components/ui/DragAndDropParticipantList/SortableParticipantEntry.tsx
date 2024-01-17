// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import { ParticipantId } from '@opentalk/common';
import React, { useMemo } from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';

import { useDisplayName } from '../../../hooks';

interface EntryProps {
  id: ParticipantId;
  index: number;
  provided: DraggableProvided;
  isDragging: boolean;
}

const ListEntry = styled('li')(({ ...props }: { isDragging: boolean }) => ({
  display: 'block',
  border: '1px solid black',
  textDecoration: 'none',
  padding: '1px',
  opacity: props.isDragging ? '0.8' : 1,
  margin: 2,
  borderRadius: '0.312rem',
  color: props.isDragging ? 'black' : '#111',
  borderColor: props.isDragging ? '#111' : 'transparent',
  backgroundColor: props.isDragging ? '#aaa' : '#ccc',
}));

export const SortableParticipantEntry = ({ id, index, provided, isDragging }: EntryProps) => {
  const getDisplayName = useDisplayName();
  const displayName = useMemo(() => getDisplayName.resolve(id), [id, getDisplayName]);

  return (
    <ListEntry
      ref={provided.innerRef}
      isDragging={isDragging}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={isDragging}
      data-testid={id}
      data-index={index}
      translate="no"
    >
      {displayName}
    </ListEntry>
  );
};
export default SortableParticipantEntry;
