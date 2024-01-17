// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  styled,
  Checkbox,
  Typography,
  Button,
  Popover,
  InputAdornment,
  ListItem,
  List,
  FormControlLabel as MuiFormControlLabel,
  ListItemAvatar,
  ListItemText,
  Container,
  Stack,
  Grid,
} from '@mui/material';
import { DoneIcon, ParticipantAvatar, ParticipantId } from '@opentalk/common';
import { SearchIcon } from '@opentalk/common';
import { cloneDeep, isEmpty, some, differenceBy } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { deselectWriter, selectWriter, uploadPdf } from '../../api/types/outgoing/protocol';
import TextField from '../../commonComponents/TextField';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectAllProtocolParticipants } from '../../store/selectors';
import { selectProtocolUrl } from '../../store/slices/protocolSlice';

const ParticipantSelectContainer = styled(Container)(({ theme }) => ({
  width: '19rem',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
}));

const ParticipantsListGrid = styled(Grid)({
  height: '20rem',
  overflowY: 'auto',
});

const FormControlLabel = styled(MuiFormControlLabel)({
  flex: 1,
  marginLeft: 0,
  minWidth: 0,
  '& .MuiTypography-root': {
    flex: 1,
  },
});

const SelectedParticipantsList = styled(List)({
  overflow: 'auto',
  width: '100%',
  flex: 1,
});

export interface ProtocolParticipant {
  id: ParticipantId;
  displayName: string;
  avatarUrl?: string;
  isSelected: boolean;
}

const ProtocolTab = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const protocolUrl = useAppSelector(selectProtocolUrl);
  const [selectedParticipants, setSelectedParticipants] = useState<ProtocolParticipant[]>([]);
  const [participants, setParticipants] = useState<ProtocolParticipant[]>([]);
  const allProtocolParticipants = useAppSelector(selectAllProtocolParticipants);
  const [searchMask, setSearchMask] = useState('');

  useEffect(() => {
    setParticipants(allProtocolParticipants);
    setSelectedParticipants(allProtocolParticipants);
  }, [allProtocolParticipants]);

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchMask(event.target.value);
  }, []);

  const getFilteredParticipants = useCallback(() => {
    if (!isEmpty(searchMask)) {
      return selectedParticipants.filter((participant) =>
        participant.displayName.toString().toLocaleLowerCase().includes(searchMask.toString().toLocaleLowerCase())
      );
    }
    return selectedParticipants;
  }, [searchMask, selectedParticipants]);

  const checkAllHandler = useCallback(() => {
    let allChecked = false;
    selectedParticipants.forEach((participant) => {
      allChecked = participant.isSelected;
    });
    const checkedArray = selectedParticipants.map((participant) => {
      participant.isSelected = !allChecked;
      return participant;
    });
    setSelectedParticipants(checkedArray);
  }, [selectedParticipants]);

  const checkHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newParticipantsArray = selectedParticipants.map((participant) => {
        if (participant.id === event.target.id) {
          participant.isSelected = event.target.checked;
        }
        return participant;
      });
      setSelectedParticipants(newParticipantsArray);
    },
    [selectedParticipants]
  );

  const sendInvitations = useCallback(() => {
    const participantComparator = (participant: ProtocolParticipant) => {
      return `${participant.id}${participant.isSelected}`;
    };
    const differentParticipants = protocolUrl
      ? differenceBy(participants, allProtocolParticipants, participantComparator)
      : participants;

    if (differentParticipants.length > 0) {
      const selectedParticipantIds = differentParticipants
        .filter((participant) => participant.isSelected)
        .map((participant) => participant.id);
      const deselectedParticipantIds = differentParticipants
        .filter((participant) => !participant.isSelected)
        .map((participant) => participant.id);
      if (selectedParticipantIds.length > 0) {
        dispatch(
          selectWriter.action({
            participantIds: selectedParticipantIds,
          })
        );
      }
      if (deselectedParticipantIds.length > 0) {
        dispatch(
          deselectWriter.action({
            participantIds: deselectedParticipantIds,
          })
        );
      }
    }
  }, [participants, dispatch]);

  const closeParticipantsListPanel = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const assignButtonHandler = useCallback(() => {
    setParticipants(selectedParticipants);
    closeParticipantsListPanel();
  }, [selectedParticipants, closeParticipantsListPanel]);

  const openParticipantsListPanel = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setSearchMask('');
      setSelectedParticipants(cloneDeep(participants));
      setAnchorEl(event.currentTarget);
    },
    [participants]
  );

  const uploadPdfAction = useCallback(() => {
    dispatch(uploadPdf.action());
  }, [dispatch]);

  const renderSelectedParticipantListItems = () => (
    <SelectedParticipantsList>
      {participants
        .filter((participant) => participant.isSelected)
        .map((participant, index) => (
          <ListItem key={index} sx={{ px: 0 }}>
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
            <DoneIcon color={'success'} />
          </ListItem>
        ))}
    </SelectedParticipantsList>
  );

  const open = Boolean(anchorEl);
  const hasSelectedParticipants = some(participants, 'isSelected');

  return (
    <Stack data-testid="protocol-tab" spacing={2} direction="column" alignItems="center" flex={1} overflow="hidden">
      <Stack spacing={2} flex={1} width="100%" overflow="hidden">
        <Button
          sx={{ width: '100%' }}
          onClick={openParticipantsListPanel}
          aria-label={protocolUrl ? t('protocol-edit-invite-button') : t('protocol-invite-button')}
        >
          {protocolUrl ? t('protocol-edit-invite-button') : t('protocol-invite-button')}
        </Button>
        {renderSelectedParticipantListItems()}
      </Stack>
      <Stack direction="column" sx={{ width: '100%' }} spacing={1} alignItems="center">
        {protocolUrl && (
          <Button sx={{ width: '100%' }} onClick={uploadPdfAction} aria-label={t('protocol-upload-pdf-button')}>
            {t('protocol-upload-pdf-button')}
          </Button>
        )}
        <Button
          sx={{ width: '100%' }}
          aria-label={protocolUrl ? t('protocol-update-invite-send-button') : t('protocol-invite-send-button')}
          disabled={!hasSelectedParticipants}
          onClick={sendInvitations}
        >
          {protocolUrl ? t('protocol-update-invite-send-button') : t('protocol-invite-send-button')}
        </Button>
      </Stack>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 0,
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={open}
        onClose={closeParticipantsListPanel}
      >
        <ParticipantSelectContainer disableGutters>
          <Stack spacing={2}>
            <TextField
              size={'small'}
              onChange={(event) => handleSearch(event)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              fullWidth
            />
            <Stack direction={'row'}>
              <Button size={'small'} sx={{ width: '100%' }} onClick={checkAllHandler}>
                {t('poll-participant-list-button-select-all')}
              </Button>
            </Stack>
            <ParticipantsListGrid zeroMinWidth item>
              <List>
                {getFilteredParticipants().map((participant) => (
                  <ListItem key={participant.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={participant.isSelected}
                          id={participant.id}
                          onChange={checkHandler}
                          color="primary"
                        />
                      }
                      label={
                        <Typography noWrap translate="no">
                          {participant.displayName}
                        </Typography>
                      }
                      labelPlacement={'start'}
                    />
                  </ListItem>
                ))}
              </List>
            </ParticipantsListGrid>
            <Stack justifyContent="space-between" direction="row" spacing={2}>
              <Button variant={'text'} onClick={closeParticipantsListPanel}>
                {t('poll-participant-list-button-close')}
              </Button>
              <Button onClick={assignButtonHandler}>{t('poll-participant-list-button-select')}</Button>
            </Stack>
          </Stack>
        </ParticipantSelectContainer>
      </Popover>
    </Stack>
  );
};

export default ProtocolTab;
