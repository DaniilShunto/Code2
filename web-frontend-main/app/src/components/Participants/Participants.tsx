// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Stack } from '@mui/material';
import { automodStore, TalkingStickParticipantList } from '@opentalk/components';
import React from 'react';

import { useAppSelector } from '../../hooks';
import { selectTalkingStickParticipants } from '../../store/selectors';
import ParticipantsContainer from './fragments/ParticipantsContainer';

const Participants = () => {
  const isAutomodActive = useAppSelector(automodStore.selectAutomodActiveState);
  const talkingStickParticipants = useAppSelector(selectTalkingStickParticipants);

  return (
    <Stack flex={1} spacing={2} overflow="hidden">
      {isAutomodActive ? (
        <TalkingStickParticipantList participants={talkingStickParticipants} />
      ) : (
        <ParticipantsContainer />
      )}
    </Stack>
  );
};

export default Participants;
