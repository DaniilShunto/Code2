// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Grid,
  styled,
  ListItemAvatar as MuiListItemAvatar,
  Checkbox,
  ListItem as MuiListItem,
  FormControlLabel as MuiFormControlLabel,
  ListItemText,
} from '@mui/material';
import { ParticipantAvatar } from '@opentalk/common';
import React from 'react';

import { MutedParticipant } from '../MuteParticipants';

type MuteParticipantsItemProps = {
  participant: MutedParticipant;
  onCheck: (checked: boolean) => void;
};

const Avatar = styled(ParticipantAvatar)({
  width: '2.25rem',
  height: '2.25rem',
  fontSize: '0.75rem',
});

const ListItem = styled(MuiListItem)(({ theme }) => ({
  padding: theme.spacing(1, 0),
}));

const ListItemAvatar = styled(MuiListItemAvatar)(({ theme }) => ({
  minWidth: 'initial',
  marginRight: theme.spacing(1),
}));

const FormControlLabel = styled(MuiFormControlLabel)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  margin: 0,
}));

const MuteParticipantsItem = ({ participant, onCheck }: MuteParticipantsItemProps) => (
  <ListItem alignItems="flex-start">
    <Grid container direction={'row'} wrap={'nowrap'}>
      <Grid item>
        <ListItemAvatar>
          <Avatar src={participant.avatarUrl}>{participant.displayName}</Avatar>
        </ListItemAvatar>
      </Grid>
      <Grid item zeroMinWidth xs>
        <FormControlLabel
          key={participant.id}
          control={
            <Checkbox
              checked={participant.selected}
              id={participant.id}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => onCheck(event.target.checked)}
            />
          }
          label={<ListItemText translate="no">{participant.displayName}</ListItemText>}
          labelPlacement={'start'}
        />
      </Grid>
    </Grid>
  </ListItem>
);

export default MuteParticipantsItem;
