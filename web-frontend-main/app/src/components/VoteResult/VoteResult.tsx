// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Checkbox, LinearProgress, FormControlLabel as MuiFormControlLabel } from '@mui/material';
import { PollId, LegalVoteId } from '@opentalk/common';
import { legalVoteStore } from '@opentalk/components';
import React, { useState } from 'react';

import { useAppSelector } from '../../hooks';
import { selectCurrentShownPollVote } from '../../store/slices/pollSlice';

export enum VoteType {
  Poll = 'Poll',
  LegalVote = 'LegalVote',
}
interface IVoteData {
  numberOfVotes: number;
  votePercentage: number;
  isVotable: boolean;
  legalVoteId: LegalVoteId | PollId;
  currentVotes: number;
}

export interface IVoteResult {
  title: string;
  optionIndex: number;
  voteData: IVoteData;
  onVote: () => void;
  showResult?: boolean;
  isChecked?: boolean;
  voteType: VoteType;
}

const ProgressContainer = styled('div')({
  position: 'relative',
  height: '3em',
});

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: '100%',
  borderRadius: '0.5em',
  backgroundColor: theme.palette.secondary.main,
  color: 'red',
}));

const ProgressLabel = styled('label')(({ theme }) => ({
  position: 'absolute',
  color: theme.palette.secondary.contrastText,
  right: '1em',
  bottom: '0.7em',
  zIndex: 1,
  display: 'flex',
  gap: '1em',
}));

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  position: 'absolute',
  left: '1em',
  zIndex: 1,
  width: '100%',
  '&&': {
    color: theme.palette.secondary.contrastText,
    '& .MuiCheckbox-root, .MuiFormControlLabel-label': {
      color: 'inherit',
    },
    '& .Mui-disabled': {
      color: 'inherit',
      opacity: 0.6,
    },
  },
}));

const VoteResult = ({ title, voteData, onVote, showResult = true, isChecked, voteType }: IVoteResult) => {
  const didVote =
    voteType === VoteType.LegalVote
      ? Boolean(useAppSelector(legalVoteStore.selectCurrentShownVote)?.votedAt)
      : Boolean(useAppSelector(selectCurrentShownPollVote)?.voted);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  return (
    <ProgressContainer
      onMouseEnter={() => setShowAdditionalInfo(true)}
      onMouseLeave={() => setShowAdditionalInfo(false)}
    >
      <FormControlLabel
        disabled={didVote || !voteData.isVotable}
        control={
          <Checkbox
            checked={isChecked}
            onChange={() => {
              onVote();
            }}
          />
        }
        label={title}
      />
      <ProgressBar color="secondary" variant="determinate" value={voteData.votePercentage} />
      {showResult && (
        <ProgressLabel>
          {`${voteData.votePercentage ? voteData.votePercentage.toFixed(1) : 0}% ${
            showAdditionalInfo ? `${voteData.currentVotes} / ${voteData.numberOfVotes}` : ''
          }`}
        </ProgressLabel>
      )}
    </ProgressContainer>
  );
};

export default VoteResult;
