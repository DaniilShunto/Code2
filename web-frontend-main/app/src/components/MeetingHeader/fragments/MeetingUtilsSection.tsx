// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Stack } from '@mui/material';
import { RecordingsIcon as DefaultRecordingsIcon, DurationIcon } from '@opentalk/common';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectRecordingState } from '../../../store/slices/recordingSlice';
import { selectIsModerator } from '../../../store/slices/userSlice';
import MeetingTimer from './MeetingTimer';
import ResultsPopover from './ResultsPopover';
import SecureConnectionField from './SecureConnectionField';
import WaitingParticipantsPopover from './WaitingParticipantsPopover';

const ContainerWithBackground = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.video,
  height: '100%',
  alignItems: 'center',
  justifyContet: 'center',
  padding: theme.spacing(0, 1),
  borderRadius: '0.25rem',
  //Applies proper size to each icon inside
  '& .MuiSvgIcon-root': {
    fontSize: theme.typography.pxToRem(16),
  },
}));

const Container = styled(Stack)({
  height: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
});

const RecordingsIcon = styled(DefaultRecordingsIcon)(({ theme }) => ({
  fill: theme.palette.error.light,
}));

const MeetingUtilsSection = () => {
  const isModerator = useAppSelector(selectIsModerator);
  const recording = useAppSelector(selectRecordingState);
  const { t } = useTranslation();

  const showSecurityIcon = window.location.protocol === 'https:';

  return (
    <Container spacing={1} direction={'row'}>
      {isModerator && <WaitingParticipantsPopover />}
      <ContainerWithBackground spacing={1} direction={'row'}>
        <ResultsPopover />
        <DurationIcon />
        <MeetingTimer aria-label="current time" />
        {showSecurityIcon && <SecureConnectionField />}
      </ContainerWithBackground>
      {recording && <RecordingsIcon aria-label={t('recording-active-label')} />}
    </Container>
  );
};

export default MeetingUtilsSection;
