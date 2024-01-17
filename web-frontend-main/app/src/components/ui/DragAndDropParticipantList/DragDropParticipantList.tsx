// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, List } from '@mui/material';
import { ParticipantId } from '@opentalk/common';
import React from 'react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';

import { SortableParticipantEntry } from '.';

const DropZone = styled('div')(({ ...props }: { isDraggingOver: boolean }) => ({
  /* stop the list collapsing when empty */
  minHeight: '12.5rem',
  width: '12.5rem',
  backgroundColor: props.isDraggingOver ? 'rgba(1,1,1,0.2)' : 'transparent',
  transitionProperty: 'background-color',
  /*
    not relying on the items for a margin-bottom,
    as it will collapse when the list is empty
  */
  paddingBottom: '1.25rem',
}));

const InnerSortableParticipantList = React.memo(({ entries }: { entries: ParticipantId[] }) => {
  return (
    <>
      {entries.map((id, index) => (
        <Draggable key={id} draggableId={id} index={index}>
          {(dragProvided: DraggableProvided, dragSnapshot: DraggableStateSnapshot) => (
            <SortableParticipantEntry
              key={id}
              id={id}
              index={index}
              isDragging={dragSnapshot.isDragging}
              provided={dragProvided}
            />
          )}
        </Draggable>
      ))}
    </>
  );
});

export const DragDropParticipantList = ({
  entries,
  dropProvided,
  dropSnapshot,
}: {
  entries: ParticipantId[];
  dropProvided: DroppableProvided;
  dropSnapshot: DroppableStateSnapshot;
}) => {
  return (
    <DropZone isDraggingOver={dropSnapshot.isDraggingOver} ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
      <List>
        <InnerSortableParticipantList entries={entries} />
      </List>
      {dropProvided.placeholder}
    </DropZone>
  );
};

export default DragDropParticipantList;
