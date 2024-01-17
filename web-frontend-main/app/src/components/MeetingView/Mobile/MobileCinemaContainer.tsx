// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { CircularProgress, Stack, styled } from '@mui/material';
import { legalVoteStore } from '@opentalk/components';

import { useAppSelector } from '../../../hooks';
import { selectCurrentShownPollVoteId, selectShowPollWindow } from '../../../store/slices/pollSlice';
import { ConnectionState, selectRoomConnectionState } from '../../../store/slices/roomSlice';
import { selectVotePollIdToShow } from '../../../store/slices/uiSlice';
import VoteResultContainer from '../../VoteResult/VoteResultContainer';
import Cinema from '../fragments/Cinema';

const Container = styled(Stack)(() => ({
  justifyContent: 'space-between',
  overflow: 'auto',
  height: '100%',
}));

const InnerContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1, 0.7),
  height: '100%',
}));

const CircularProgressBar = styled(CircularProgress)({
  margin: 'auto',
});

const MobileCinemaContainer = () => {
  const currentVoteId = useAppSelector(legalVoteStore.selectCurrentShownVoteId);
  const showVoteResultContainer = useAppSelector(legalVoteStore.selectShowLegalVoteWindow);
  const showPollResultContainer = useAppSelector(selectShowPollWindow);
  const currentShownPollVoteId = useAppSelector(selectCurrentShownPollVoteId);
  const votePollIdToShow = useAppSelector(selectVotePollIdToShow);
  const connectionState = useAppSelector(selectRoomConnectionState);

  return (
    <Container>
      {connectionState === ConnectionState.Leaving || connectionState === ConnectionState.Starting ? (
        <CircularProgressBar />
      ) : (
        <InnerContainer>
          <Cinema />
          {votePollIdToShow && <VoteResultContainer legalVoteId={votePollIdToShow} />}
          {!votePollIdToShow && currentVoteId && showVoteResultContainer && (
            <VoteResultContainer legalVoteId={currentVoteId} />
          )}
          {!votePollIdToShow && currentShownPollVoteId && showPollResultContainer && (
            <VoteResultContainer legalVoteId={currentShownPollVoteId} />
          )}
        </InnerContainer>
      )}
    </Container>
  );
};

export default MobileCinemaContainer;
