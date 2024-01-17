// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { List } from '@mui/material';
import { ParticipantId } from '@opentalk/common';
import React from 'react';

import { MutedParticipant } from '../MuteParticipants';
import MuteParticipantsItem from './MuteParticipantsItem';

type MuteParticipantsListProps = {
  participantsList: MutedParticipant[];
  onCheck: (checked: boolean, participantId: ParticipantId) => void;
};

const MuteParticipantsList = ({ participantsList, onCheck }: MuteParticipantsListProps) => (
  <List>
    {participantsList.map((participant) => (
      <MuteParticipantsItem
        participant={participant}
        onCheck={(checked) => onCheck(checked, participant.id)}
        key={participant.id}
      />
    ))}
  </List>
);

export default MuteParticipantsList;
