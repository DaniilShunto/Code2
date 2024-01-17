// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Slide, keyframes } from '@mui/material';
import React, { useRef } from 'react';

import { useAppSelector } from '../../hooks';
import { selectFocusedSpeaker } from '../../store/slices/mediaSlice';
import { selectSlicedParticipants } from '../../store/slices/participantsSlice';
import { selectPaginationPageState } from '../../store/slices/uiSlice';
import ParticipantWindow from '../ParticipantWindow';

const breathe = keyframes`
  0% {
    opacity: 0.6;
  }

 100% {
    opacity: 1;
  }
`;

const CinemaCell = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isActiveSpeaker',
})<{ isActiveSpeaker: boolean }>(({ theme, isActiveSpeaker }) => ({
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  borderRadius: '1em',
  position: 'relative',

  '&::before': {
    content: '""',
    display: 'block',
    height: 0,
    width: 0,
    paddingBottom: 'calc(9/16 * 100%)',
  },

  '&::after': {
    content: '""',
    position: 'absolute',
    display: 'block',
    width: '100%',
    height: '100%',
    inset: '0',
    borderRadius: '1em',
    boxShadow: `inset 0px 0px 0px ${isActiveSpeaker ? 2 : 0}px ${theme.palette.primary.main}`,
    transition: `all 300ms linear`,
    pointerEvents: 'none',
    animation: isActiveSpeaker ? `${breathe} 1s infinite ease-in-out alternate` : 'none',
  },
}));

const GridContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'videoWidth',
})<{ videoWidth: number }>(({ theme, videoWidth }) => {
  return {
    width: '100%',
    display: 'grid',
    gridGap: theme.spacing(1),
    alignContent: 'center',
    gridAutoFlow: 'row',
    [theme.breakpoints.up('md')]: {
      height: '100%',
      gridTemplateColumns: `repeat(auto-fit, minmax(calc(${videoWidth}% - ${theme.spacing(1)}), 1fr))`,
    },
  };
});

export const MAX_GRID_TILES = 9;

const GridView = () => {
  const selectedPage = useAppSelector(selectPaginationPageState);
  const slicedParticipants = useAppSelector(selectSlicedParticipants(selectedPage, MAX_GRID_TILES));
  const selectedSpeakerId = useAppSelector(selectFocusedSpeaker);
  const lastPage = useRef<number>(0);

  const videoWidth = slicedParticipants.length <= 4 ? 50 : 33.3;
  const direction = selectedPage > lastPage.current ? 'left' : 'right';

  lastPage.current = selectedPage;

  const gridCells = slicedParticipants.map((participant, index) => (
    <Slide direction={direction} key={index} in mountOnEnter unmountOnExit>
      <CinemaCell
        data-testid="cinemaCell"
        isActiveSpeaker={participant.id === selectedSpeakerId && slicedParticipants.length >= 2}
      >
        <ParticipantWindow key={participant.id} participantId={participant.id} mediaRef={`grid-${index}`} />
      </CinemaCell>
    </Slide>
  ));

  return <GridContainer videoWidth={videoWidth}>{gridCells}</GridContainer>;
};

export default GridView;
