// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Stack, Box } from '@mui/material';
import { MediaSessionType, ParticipantId, Participant } from '@opentalk/common';
import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { requestMute } from '../../api/types/outgoing/media';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { SubscriberConfig } from '../../modules/WebRTC';
import { selectUnmutedParticipants } from '../../store/selectors';
import { selectAllSubscribers } from '../../store/slices/mediaSubscriberSlice';
import SearchTextField from '../SearchTextField/index';
import MuteParticipantsList from './fragments/MuteParticipantsList';

export interface MutedParticipant extends Participant {
  selected: boolean;
}

const MuteParticipants = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const activeParticipants = useAppSelector(selectUnmutedParticipants);
  const allSubscribers = useAppSelector(selectAllSubscribers);

  const [search, setSearch] = useState<string>('');
  const [selectedParticipants, setSelectedParticipants] = useState<ParticipantId[]>([]);

  const participantsList = useMemo(() => {
    return activeParticipants
      .filter((participant) => participant.displayName.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
      .map((participant) => ({ ...participant, selected: selectedParticipants.includes(participant.id) }));
  }, [search, activeParticipants, selectedParticipants]);

  const handleSearchChange = (value: string) => setSearch(value);

  const handleSelectParticipant = (checked: boolean, participantId: ParticipantId) => {
    if (checked) {
      setSelectedParticipants((prevState) => [...prevState, participantId]);
    } else {
      setSelectedParticipants((prevState) => prevState.filter((part) => part !== participantId));
    }
  };

  const muteAll = useCallback(() => {
    const unmutedIds = allSubscribers
      .filter((subscriber: SubscriberConfig) => subscriber.mediaType === MediaSessionType.Video && subscriber.audio)
      .map((subscriber) => subscriber.participantId);
    dispatch(requestMute.action({ targets: unmutedIds, force: true }));
  }, [allSubscribers, dispatch]);

  const muteSelected = useCallback(() => {
    const subscribersIds = allSubscribers
      .filter(
        (subscriber: SubscriberConfig) =>
          selectedParticipants.includes(subscriber.participantId) &&
          subscriber.mediaType === MediaSessionType.Video &&
          subscriber.audio
      )
      .map((subscriber) => subscriber.participantId);
    dispatch(requestMute.action({ targets: subscribersIds, force: true }));
  }, [allSubscribers, selectedParticipants, dispatch]);

  return (
    <Stack flex={1} spacing={2} overflow="hidden">
      <Box display="flex" justifyContent="space-between" gap={2}>
        <Button onClick={muteAll} fullWidth>
          {t('mute-participants-button-all')}
        </Button>
        <Button onClick={muteSelected} fullWidth>
          {t('mute-participants-button-selected')}
        </Button>
      </Box>
      <SearchTextField searchValue={search} onSearch={handleSearchChange} fullWidth />
      <Box overflow="auto">
        <MuteParticipantsList participantsList={participantsList} onCheck={handleSelectParticipant} />
      </Box>
    </Stack>
  );
};

export default MuteParticipants;
