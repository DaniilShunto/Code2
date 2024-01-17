// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, CircularProgress } from '@mui/material';
import { legalVoteStore } from '@opentalk/components';

import { useAppSelector } from '../../../hooks';
import { selectCurrentShownPollVoteId, selectShowPollWindow } from '../../../store/slices/pollSlice';
import { selectRoomConnectionState, ConnectionState } from '../../../store/slices/roomSlice';
import { selectShowCoffeeBreakCurtain, selectVotePollIdToShow } from '../../../store/slices/uiSlice';
import { selectIsModerator } from '../../../store/slices/userSlice';
import { CoffeeBreakView } from '../../CoffeeBreakView/CoffeeBreakView';
import MeetingHeader from '../../MeetingHeader';
import MeetingSidebar from '../../MeetingSidebar/index';
import VoteResultContainer from '../../VoteResult/VoteResultContainer';
import Cinema from './Cinema';

const InnerContainer = styled('div')(({ theme }) => ({
  display: 'grid',
  height: '100%',
  width: '100%',
  padding: theme.spacing(2),
  gap: theme.spacing(2),
  minHeight: 0,
  gridTemplate: 'auto 1fr / auto 1fr',
}));

const CircularProgressBar = styled(CircularProgress)({
  margin: 'auto',
});

const DesktopInnerLayout = () => {
  const currentVoteId = useAppSelector(legalVoteStore.selectCurrentShownVoteId);
  const showVoteResultContainer = useAppSelector(legalVoteStore.selectShowLegalVoteWindow);
  const showPollResultContainer = useAppSelector(selectShowPollWindow);
  const currentShownPollVoteId = useAppSelector(selectCurrentShownPollVoteId);
  const votePollIdToShow = useAppSelector(selectVotePollIdToShow);
  const connectionState = useAppSelector(selectRoomConnectionState);

  const showCoffeeBreakCurtain = useAppSelector(selectShowCoffeeBreakCurtain);
  const isModerator = useAppSelector(selectIsModerator);

  return (
    <InnerContainer>
      <MeetingSidebar />

      {showCoffeeBreakCurtain && isModerator ? (
        <CoffeeBreakView roundBorders />
      ) : (
        <>
          <MeetingHeader />
          {connectionState === ConnectionState.Leaving || connectionState === ConnectionState.Starting ? (
            <CircularProgressBar />
          ) : (
            <>
              <Cinema />
              {votePollIdToShow && <VoteResultContainer legalVoteId={votePollIdToShow} />}
              {!votePollIdToShow && currentVoteId && showVoteResultContainer && (
                <VoteResultContainer legalVoteId={currentVoteId} />
              )}
              {!votePollIdToShow && currentShownPollVoteId && showPollResultContainer && (
                <VoteResultContainer legalVoteId={currentShownPollVoteId} />
              )}
            </>
          )}
        </>
      )}
    </InnerContainer>
  );
};

export default DesktopInnerLayout;
