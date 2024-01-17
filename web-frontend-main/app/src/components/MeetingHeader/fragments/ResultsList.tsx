// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Stack, MenuList as MuiMenuList, Typography, styled } from '@mui/material';
import { legalVoteStore } from '@opentalk/components';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectAllPollVotes } from '../../../store/slices/pollSlice';
import ResultsItem from './ResultsItem';

const MenuList = styled(MuiMenuList)({
  maxWidth: 300,
});

const ResultsList = () => {
  const { t } = useTranslation();
  const votes = useAppSelector(legalVoteStore.selectAllVotes);
  const polls = useAppSelector(selectAllPollVotes);

  return (
    <MenuList>
      <Stack p={2}>
        <Typography variant={'h2'} align={'center'}>
          {t('votes-poll-overview-title')}
        </Typography>
      </Stack>
      {votes.map((vote) => (
        <ResultsItem key={vote.id} item={vote} />
      ))}
      {polls.map((poll) => (
        <ResultsItem key={poll.id} item={poll} />
      ))}
    </MenuList>
  );
};

export default ResultsList;
