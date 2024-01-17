// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  styled,
  Typography,
  Container,
  IconButton,
  Grid,
  Stack,
  Tooltip,
  Box,
  Chip as MuiChip,
  Button,
} from '@mui/material';
import {
  ParticipantId,
  PollId,
  LegalVoteId,
  CloseIcon,
  useDateFormat,
  Choice,
  ChoiceResult,
  getCurrentTimezone,
} from '@opentalk/common';
import {
  LegalVoteType,
  VoteOption,
  legalVoteStore,
  LegalVoteCountdown,
  LegalVoteTokenClipboard,
} from '@opentalk/components';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import legalVoteSignaling from '../../api/types/outgoing/legal-vote';
import { vote as pollVote } from '../../api/types/outgoing/poll';
import VoteResultTable from '../../features/VoteResultTable';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectPollVoteById, closeResultWindow as closePollResultWindow, voted } from '../../store/slices/pollSlice';
import { setVotePollIdToShow } from '../../store/slices/uiSlice';
import { selectOurUuid } from '../../store/slices/userSlice';
import VoteResult, { VoteType } from './VoteResult';
import VoteResultDate from './fragments/VoteResultDate';

const TooltipIcon = styled('div')(({ color }) => ({
  width: '1rem',
  height: '1rem',
  borderRadius: '100%',
  marginRight: '1rem',
  background: color,
}));

const MainContainer = styled(Container)(({ theme }) => ({
  background: theme.palette.background.voteResult,
  position: 'fixed',
  top: '8rem',
  left: '25rem',
  borderRadius: '1rem',
  display: 'block',
  gap: '1rem',
  padding: theme.spacing(2),
  justifyContent: 'space-evenly',
  flexDirection: 'column',
  zIndex: 1000,
  maxHeight: '34rem',
  overflowY: 'auto',
  scrollBehavior: 'smooth',
}));

const StyledStack = styled(Stack)(() => ({
  padding: 0,
  width: '100%',
}));

const TopicTypography = styled(Typography)({
  wordBreak: 'break-word',
});

const Chip = styled(MuiChip)(() => ({
  marginLeft: 0,
  borderRadius: 0,
  borderColor: 'transparent',
  '& .MuiChip-label': {
    paddingRight: 0,
    '&:first-letter': {
      textTransform: 'capitalize',
    },
  },
}));

interface IVoteResultContainerProps {
  legalVoteId: PollId | LegalVoteId;
}

export interface Vote {
  id: PollId | LegalVoteId;
  voters?: Record<ParticipantId, VoteOption>;
  choices?: Array<Choice>;
  results?: Array<ChoiceResult>;
  name?: string;
  topic: string;
  votes?: Record<VoteOption, number>;
  state: 'active' | 'finished' | 'canceled';
  voted: boolean;
  live?: boolean;
}

const VoteResultContainer = ({ legalVoteId }: IVoteResultContainerProps) => {
  const dispatch = useAppDispatch();
  const ourUuid = useAppSelector(selectOurUuid);
  const { t } = useTranslation();
  const currentLegalVote = useAppSelector(legalVoteStore.selectVoteById(legalVoteId));
  const currentPoll = useAppSelector(selectPollVoteById(legalVoteId));
  const startTime = new Date(currentLegalVote?.startTime ?? new Date());
  const formattedTime = useDateFormat(startTime, 'time');
  const [showResults, setShowResults] = useState(false);
  const isLiveVote = currentLegalVote?.kind === 'live_roll_call' || currentLegalVote?.kind === 'roll_call';

  const closeResultWindow = () => {
    dispatch(closePollResultWindow());
    dispatch(legalVoteStore.closeResultWindow());
    dispatch(setVotePollIdToShow(undefined));
  };

  const vote: Vote | LegalVoteType | undefined = currentLegalVote || currentPoll;
  const [selectedLegalVoteOption, setSelectedLegalVoteOption] = useState<VoteOption | undefined>(
    currentLegalVote?.selectedOption
  );

  // to uncheck all checkboxes on every new voting
  useEffect(() => {
    setSelectedLegalVoteOption(undefined);
  }, [legalVoteId]);

  let numberOfVotes = 0;

  if (currentLegalVote !== undefined && vote) {
    numberOfVotes = Object.values(vote?.votes || {}).reduce(function sumVotes(sum, totalVotesForCurrentOption) {
      return sum + totalVotesForCurrentOption;
    }, 0);
  }

  function isVote(vote: Vote | LegalVoteType): vote is Vote {
    return (vote as Vote).results !== undefined;
  }

  if (currentPoll !== undefined && vote) {
    numberOfVotes = (isVote(vote) && vote?.results?.reduce((acc, result) => acc + result.count, 0)) || 0;
  }

  const allowedToVote = ourUuid ? currentLegalVote?.allowedParticipants?.includes(ourUuid as ParticipantId) : false;

  useEffect(() => {
    vote && setVotePollIdToShow(vote.id);
  }, [vote]);

  const mapVoteKey = (key: string) => {
    return t(`legal-vote-${key}-label`);
  };

  const submitLegalVoteOption = () => {
    if (!currentLegalVote || !currentLegalVote.id || !selectedLegalVoteOption) {
      return;
    }
    dispatch(
      legalVoteStore.actions.saveSelectedOption({
        legalVoteId: currentLegalVote.id,
        selectedOption: selectedLegalVoteOption,
      })
    );
    dispatch(
      legalVoteSignaling.actions.vote.action({
        legalVoteId: currentLegalVote?.id as LegalVoteId,
        option: selectedLegalVoteOption,
        token: currentLegalVote?.token || '',
        timezone: getCurrentTimezone(),
      })
    );
  };

  const renderVoteResult = () => {
    if (currentLegalVote?.votes !== undefined) {
      return (
        <Grid item xs={12} container direction={'column'} rowSpacing={1}>
          {Object.keys(currentLegalVote.votes).map(
            (voteKey, index) =>
              (voteKey !== 'abstain' || (voteKey === 'abstain' && currentLegalVote?.enableAbstain)) && (
                <Grid item key={index}>
                  <VoteResult
                    key={index}
                    title={mapVoteKey(voteKey as VoteOption)}
                    optionIndex={index}
                    voteType={VoteType.LegalVote}
                    voteData={{
                      votePercentage:
                        currentLegalVote?.votes && currentLegalVote?.votes[voteKey as VoteOption] != 0
                          ? (currentLegalVote?.votes[voteKey as VoteOption] / numberOfVotes) * 100
                          : 0,
                      numberOfVotes,
                      currentVotes: currentLegalVote?.votes ? currentLegalVote?.votes[voteKey as VoteOption] : 0,
                      isVotable: Boolean(allowedToVote) && Boolean(currentLegalVote?.state === 'active'),
                      legalVoteId: currentLegalVote?.id as LegalVoteId,
                    }}
                    isChecked={voteKey === selectedLegalVoteOption}
                    onVote={() => {
                      setSelectedLegalVoteOption(voteKey as VoteOption);
                    }}
                  />
                </Grid>
              )
          )}
        </Grid>
      );
    }

    return (
      <Grid item xs={12} container rowSpacing={1} direction={'column'}>
        {currentPoll &&
          currentPoll?.choices &&
          currentPoll?.choices.map((choice, index) => {
            const result = currentPoll?.results?.find((result) => result.id === choice.id);
            return (
              <Grid item key={index}>
                <VoteResult
                  key={index}
                  voteType={VoteType.Poll}
                  title={choice.content || ''}
                  optionIndex={index}
                  voteData={{
                    votePercentage: result !== undefined ? (result.count / numberOfVotes) * 100 : 0,
                    numberOfVotes,
                    currentVotes: result !== undefined ? result.count : 0,
                    isVotable:
                      typeof currentPoll?.voted === 'boolean'
                        ? !currentPoll?.voted
                        : Boolean(currentPoll?.state === 'active'),
                    legalVoteId: currentPoll?.id,
                  }}
                  isChecked={currentPoll?.selectedChoiceId === choice.id}
                  onVote={() => {
                    dispatch(voted({ id: currentPoll?.id as PollId, selectedChoiceId: choice.id }));
                    dispatch(pollVote.action({ pollId: currentPoll?.id as PollId, choiceId: choice.id }));
                  }}
                  showResult={currentPoll?.live || currentPoll?.state === 'finished'}
                />
              </Grid>
            );
          })}
      </Grid>
    );
  };

  const renderLiveIndicator = (vote: Vote | undefined) => {
    if (vote && 'live' in vote) {
      const liveTooltip = t('votes-result-live-tooltip');
      const notLiveTooltip = t('votes-result-not-live-tooltip');
      return (
        <Grid item container alignItems={'flex-start'} justifyContent={'space-between'} spacing={0}>
          {vote?.topic && (
            <Grid item>
              <TopicTypography>{vote?.topic}</TopicTypography>
            </Grid>
          )}
          <Grid item>
            {vote?.live ? (
              <Tooltip title={liveTooltip}>
                <TooltipIcon color={'green'} />
              </Tooltip>
            ) : (
              <Tooltip title={notLiveTooltip}>
                <TooltipIcon color={'red'} />
              </Tooltip>
            )}
          </Grid>
        </Grid>
      );
    }

    return vote?.topic && <TopicTypography>{vote?.topic}</TopicTypography>;
  };

  const getSubtitle = (vote: LegalVoteType | undefined) => {
    if (vote && 'subtitle' in vote) {
      return vote?.subtitle === '' ? null : vote.subtitle;
    }
    return null;
  };

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowResults(false);
  }, [currentLegalVote]);

  const showResultsHandler = () => {
    setShowResults(true);
  };

  const scrollToResults = () => {
    if (resultsRef && resultsRef.current && resultsRef.current.scrollIntoView) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isTableHintVisible = () => {
    if (isLiveVote || currentLegalVote === undefined || currentLegalVote.votingRecord === undefined || !allowedToVote) {
      return false;
    }
    const hasResults = Object.keys(currentLegalVote.votingRecord).length > 0;
    return hasResults;
  };

  const showResultTable = (isLiveVote || showResults) && currentLegalVote && allowedToVote;

  return (
    <MainContainer maxWidth="sm">
      <Grid container rowSpacing={1.4}>
        <Grid item xs={12} style={{ scrollBehavior: 'smooth' }}>
          <Stack width="100%" direction="row" alignItems="center" justifyContent="space-between" gap={1}>
            <Box display="flex" alignItems="center" flex={1} gap={1}>
              <Chip
                size="medium"
                label={t(`legal-vote-overview-panel-status-${vote?.state}`)}
                color={vote?.state === 'active' ? 'success' : 'error'}
                variant="filled"
                clickable={false}
              />
              {currentLegalVote && <Box>{formattedTime}</Box>}
              {currentLegalVote && currentLegalVote.duration && currentLegalVote.startTime && (
                <LegalVoteCountdown
                  duration={currentLegalVote.duration}
                  startTime={currentLegalVote.startTime}
                  active={currentLegalVote.state === 'active'}
                />
              )}
            </Box>
            <IconButton onClick={closeResultWindow} aria-label="close-vote-results">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <StyledStack>
            <Typography variant={'h2'}>{vote?.name}</Typography>
            {getSubtitle(vote as LegalVoteType) && (
              <TopicTypography>{getSubtitle(vote as LegalVoteType)}</TopicTypography>
            )}
            {renderLiveIndicator(vote as Vote)}
          </StyledStack>
        </Grid>
        {renderVoteResult()}
        {!allowedToVote && (vote as LegalVoteType)?.allowedParticipants?.length && (
          <Grid item xs={12} container justifyContent="flex-start">
            <Typography color={'primary'} textAlign={'center'}>
              {t('legal-vote-not-selected')}
            </Typography>
          </Grid>
        )}
        {currentLegalVote && allowedToVote && currentLegalVote.state === 'active' && (
          <Grid item xs={12} pb={1} container justifyContent="flex-end">
            <Button
              data-testid="legal-vote-save-button"
              type="button"
              onClick={submitLegalVoteOption}
              disabled={Boolean(currentLegalVote?.votedAt)}
            >
              {t('legal-vote-form-button-save')}
            </Button>
          </Grid>
        )}
        {currentLegalVote?.votedAt && allowedToVote && (
          <Grid item xs={12}>
            <VoteResultDate
              date={new Date(currentLegalVote?.votedAt)}
              state={currentLegalVote.state}
              showTableHint={isTableHintVisible()}
              showResultsHandler={showResultsHandler}
            />
          </Grid>
        )}
        {currentLegalVote && currentLegalVote.votedAt && currentLegalVote.state === 'finished' && allowedToVote && (
          <Grid item xs={12}>
            <LegalVoteTokenClipboard
              name={currentLegalVote.name}
              timestamp={currentLegalVote.votedAt || ''}
              token={currentLegalVote.token || ''}
              vote={t(`legal-vote-${selectedLegalVoteOption}-label`) as string}
            />
          </Grid>
        )}

        {showResultTable && Object.keys(currentLegalVote?.votingRecord || {}).length !== 0 && (
          <Grid ref={resultsRef} item xs={12}>
            <VoteResultTable scrollToResults={scrollToResults} voteId={currentLegalVote.id} />
          </Grid>
        )}
      </Grid>
    </MainContainer>
  );
};

export default VoteResultContainer;
