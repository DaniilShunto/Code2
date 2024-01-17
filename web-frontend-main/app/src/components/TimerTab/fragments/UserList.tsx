// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import styled from '@emotion/styled';
import { List as MuiList, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material';
import { DoneIcon, CloseIcon, ParticipantAvatar } from '@opentalk/common';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectParticipantsReadyList } from '../../../store/selectors';
import { selectReadyCheckEnabled } from '../../../store/slices/timerSlice';

const List = styled(MuiList)({
  overflow: 'auto',
});

const UserList = () => {
  const participants = useAppSelector(selectParticipantsReadyList);
  const isReadyCheckEnabled = useAppSelector(selectReadyCheckEnabled);
  const { t } = useTranslation();

  const renderReadyStatus = (isReady: boolean) =>
    isReady ? <DoneIcon fontSize="small" color="primary" /> : <CloseIcon fontSize="small" color="warning" />;

  const renderUsers = () => {
    return participants.map((participant) => {
      if (participant.leftAt === null) {
        return (
          <ListItem key={participant.id} sx={{ px: 0 }}>
            <ListItemAvatar>
              <ParticipantAvatar src={participant.avatarUrl}>{participant.displayName}</ParticipantAvatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography noWrap translate="no">
                  {participant.displayName}
                </Typography>
              }
            />
            {isReadyCheckEnabled && renderReadyStatus(participant.isReady)}
          </ListItem>
        );
      }
      return null;
    });
  };

  if (participants.length <= 0) {
    return null;
  }

  return (
    <Stack spacing={1} overflow="hidden">
      <Typography variant="h2">{t('global-participants')}</Typography>
      <List>{renderUsers()}</List>
    </Stack>
  );
};

export default UserList;
