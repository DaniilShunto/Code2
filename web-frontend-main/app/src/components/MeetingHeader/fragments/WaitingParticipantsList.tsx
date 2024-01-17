// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Button, Typography, List as MuiList, ListSubheader, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { acceptParticipantFromWaitingRoomToRoom } from '../../../api/types/outgoing/moderation';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  approvedAll,
  selectAllParticipantsInWaitingRoom,
  selectNotApprovedParticipants,
} from '../../../store/slices/participantsSlice';
import WaitingParticipantItem from './WaitingParticipantsItem';

const List = styled(MuiList)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  alignItems: 'space-between',
  padding: theme.spacing(1, 1),
  borderRadius: '0.1rem',
  background: theme.palette.background.video,
  overflow: 'hidden',
}));

const Subheader = styled(ListSubheader)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'transparent',
  '& .MuiTypography-root': {
    color: theme.palette.text.primary,
  },
}));

const ScrollableBox = styled(Box)({
  overflow: 'auto',
  maxHeight: 'calc(calc(2.25rem + 20px) * 3.25)', // (2.25rem = avatar height) + (8px padding top + 6px name margin top + 6px name margin bottom)
});

interface WaitingParticipantsListProps {
  /**
   * Passed when used inside popover for accessibility
   */
  id?: string;
}

const WaitingParticipantsList = ({ id }: WaitingParticipantsListProps) => {
  const { t } = useTranslation();
  const participantsInWaitingRoom = useAppSelector(selectAllParticipantsInWaitingRoom);
  const participantsNotApproved = useAppSelector(selectNotApprovedParticipants);
  const dispatch = useAppDispatch();

  const handleApproveAll = () => {
    if (participantsNotApproved.length > 0) {
      participantsNotApproved.forEach((participant) => {
        dispatch(acceptParticipantFromWaitingRoomToRoom.action({ target: participant.id }));
      });
      dispatch(approvedAll());
    }
  };

  return (
    <List id={id}>
      <Subheader>
        <Typography variant="body2">{t('waiting-room-participant-label')}</Typography>
        <Button variant="text" disabled={participantsNotApproved.length === 0} onClick={handleApproveAll} focusRipple>
          {t('approve-all-participants-from-waiting')}
        </Button>
      </Subheader>
      <ScrollableBox>
        {participantsInWaitingRoom.map((participant) => (
          <WaitingParticipantItem key={participant.id} participant={participant} />
        ))}
      </ScrollableBox>
    </List>
  );
};

export default WaitingParticipantsList;
