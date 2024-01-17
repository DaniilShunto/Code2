// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { LegalVoteId } from '@opentalk/common';

import { configureStore, render, screen, cleanup, fireEvent } from '../../utils/testUtils';
import VoteResult, { IVoteResult, VoteType } from './VoteResult';

describe('testing vote results', () => {
  const { store } = configureStore();
  afterAll(() => cleanup());

  const voteData = {
    numberOfVotes: 0,
    votePercentage: 50,
    isVotable: true,
    legalVoteId: '1234' as LegalVoteId,
    currentVotes: 0,
  };

  const voteResultsProps: IVoteResult = {
    voteType: VoteType.LegalVote,
    title: 'Yes',
    optionIndex: 1,
    voteData: voteData,
    showResult: true,
    onVote: jest.fn(),
  };

  test('component should render wothout breaking', async () => {
    await render(<VoteResult {...voteResultsProps} />, store);
    const yesCheckbox = screen.getByRole('checkbox', { name: voteResultsProps.title });

    expect(yesCheckbox).toBeInTheDocument();
    expect(yesCheckbox).not.toBeChecked();
    expect(screen.getByText('50.0%')).toBeInTheDocument();
  });

  test('on click should fire onVote event', async () => {
    await render(<VoteResult {...voteResultsProps} />, store);
    const yesCheckbox = screen.getByRole('checkbox', { name: voteResultsProps.title });
    expect(yesCheckbox).toBeInTheDocument();
    fireEvent.click(yesCheckbox);
    expect(yesCheckbox).toBeChecked();
    expect(voteResultsProps.onVote).toBeCalledTimes(1);
  });
});
