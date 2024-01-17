// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '../../../hooks';
import { selectCombinedSpeakerId } from '../../../store/selectors';
import { selectAllOnlineParticipants } from '../../../store/slices/participantsSlice';
import ParticipantWindow from '../../ParticipantWindow';

interface SpeakerViewProps {
  speakerWindowWidth?: number;
  speakerWindowHeight?: number;
}
const Container = styled('div', {
  shouldForwardProp: (prop) => !['height', 'width'].includes(prop as string),
})<{ width: number; height: number }>(({ theme, width, height }) => ({
  borderRadius: theme.borderRadius.medium,
  overflow: 'hidden',
  width: width,
  height: height,
  margin: 'auto',
  display: 'flex',
}));

const SpeakerWindow = ({ speakerWindowWidth, speakerWindowHeight }: SpeakerViewProps) => {
  const participants = useAppSelector(selectAllOnlineParticipants);
  const selectedSpeakerId = useAppSelector(selectCombinedSpeakerId);
  const currentSpeakerId = selectedSpeakerId || participants[0]?.id;
  const [{ width, height }, setDimensions] = useState({ width: 1, height: 1 });

  const calculateCellDimensions = useCallback(() => {
    if (speakerWindowWidth && speakerWindowHeight) {
      const aspectRatio = 16 / 9;
      const height = Math.min(speakerWindowWidth / aspectRatio, speakerWindowHeight);
      const width = height * (16 / 9);

      setDimensions({
        width,
        height,
      });
    }
  }, [speakerWindowWidth, speakerWindowHeight]);

  useEffect(() => {
    calculateCellDimensions();
  }, [speakerWindowWidth, speakerWindowHeight, calculateCellDimensions]);

  return (
    <Container width={width} height={height} data-testid="SpeakerWindow1">
      {currentSpeakerId && (
        <ParticipantWindow participantId={currentSpeakerId} alwaysShowOverlay mediaRef={`speaker-main`} />
      )}
    </Container>
  );
};

export default SpeakerWindow;
