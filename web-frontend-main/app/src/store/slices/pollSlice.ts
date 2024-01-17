// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { PollId, ChoiceResult, Choice, joinSuccess } from '@opentalk/common';
import { createEntityAdapter, createSlice, EntityId, EntityState, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../';
import { Started, LiveUpdate, Done } from '../../api/types/incoming/poll';

export interface Poll {
  id: PollId;
  topic: string;
  duration: number | null;
  choices: Array<Choice>;
  results: Array<ChoiceResult>;
  startTime: string;
  stopTime?: string;
  state: 'active' | 'finished';
  live: boolean;
  voted: boolean;
  selectedChoiceId?: Choice['id'];
}

export interface PollFormValues {
  id?: number;
  topic: string;
  duration: number | string;
  live: boolean;
  choices: Array<string>;
}

const newPollFromApiType = ({ ...poll }: Started): Poll => ({
  ...poll,
  results: [],
  startTime: new Date().toISOString(),
  state: 'active',
  voted: false,
});

const pollAdapter = createEntityAdapter<Poll>({
  sortComparer: (a, b) => {
    const aDate = Date.parse(a.startTime);
    const bDate = Date.parse(b.startTime);
    return aDate - bDate;
  },
});

interface State {
  activeVote?: PollId;
  currentShownVote?: PollId;
  votes: EntityState<Poll>;
  savedPolls: PollFormValues[];
  showResultWindow: boolean;
}

export const pollSlice = createSlice({
  name: 'poll',
  initialState: {
    votes: pollAdapter.getInitialState(),
    savedPolls: [],
    showResultWindow: false,
  } as State,
  reducers: {
    started: (state, { payload }: PayloadAction<Started>) => {
      state.currentShownVote = payload.id;
      state.activeVote = payload.id;
      state.showResultWindow = true;

      const vote: Poll = newPollFromApiType(payload);
      pollAdapter.addOne(state.votes, vote);
    },
    done: (state, { payload }: PayloadAction<Done>) => {
      state.activeVote = undefined;
      pollAdapter.updateOne(state.votes, {
        id: payload.id,
        changes: { stopTime: new Date().toISOString(), state: 'finished', results: payload.results },
      });
    },
    liveUpdated: (state, { payload }: PayloadAction<LiveUpdate>) => {
      pollAdapter.updateOne(state.votes, {
        id: payload.id,
        changes: { results: payload.results },
      });
    },
    savePollFormValues: (state, { payload }: PayloadAction<PollFormValues>) => {
      const index = state.savedPolls.findIndex((savedPoll) => savedPoll.id === payload.id);
      if (index !== -1) {
        state.savedPolls[index] = {
          ...state.savedPolls[index],
          ...payload,
        };
        return;
      }
      state.savedPolls.push({
        id: state.savedPolls.length,
        ...payload,
      });
    },
    closeResultWindow: (state) => {
      state.showResultWindow = false;
    },
    voted: (state, { payload }: PayloadAction<{ id: PollId; selectedChoiceId: Choice['id'] }>) => {
      pollAdapter.updateOne(state.votes, {
        id: payload.id,
        changes: { voted: true, selectedChoiceId: payload.selectedChoiceId },
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(joinSuccess, (state, { payload: { polls } }) => {
      if (polls !== undefined) {
        const poll = {
          ...polls,
          results: polls.results || [],
          startTime: polls.started,
          state: 'active',
          voted: false,
        } as Poll;
        state.showResultWindow = true;
        state.currentShownVote = polls.id;
        pollAdapter.upsertOne(state.votes, poll);
      }
    });
  },
});

export const { started, liveUpdated, done, savePollFormValues, closeResultWindow, voted } = pollSlice.actions;
export const actions = pollSlice.actions;

const voteSelectors = pollAdapter.getSelectors<RootState>((state) => state.poll.votes);

export const selectPollVoteById = (id: EntityId) => (state: RootState) => voteSelectors.selectById(state, id);
export const selectPollVoteIds = (state: RootState) => voteSelectors.selectIds(state);
export const selectAllPollVotes = (state: RootState) => voteSelectors.selectAll(state);
export const selectPollVotes = (state: RootState) => voteSelectors.selectEntities(state);

export const selectCurrentShownPollVoteId = (state: RootState) => state.poll.currentShownVote;
export const selectCurrentShownPollVote = (state: RootState) =>
  state.poll.currentShownVote ? selectPollVoteById(state.poll.currentShownVote)(state) : undefined;

export const selectActivePollVoteId = (state: RootState) => state.poll.activeVote;
export const selectActivePollVote = (state: RootState) =>
  state.poll.activeVote ? selectPollVoteById(state.poll.activeVote)(state) : undefined;

export const selectAllSavedPolls = (state: RootState) => state.poll.savedPolls;
export const selectSavedPollPerId = (id: number | undefined) => (state: RootState) =>
  state.poll.savedPolls.find((savedPoll) => savedPoll.id === id);

export const selectShowPollWindow = (state: RootState) => state.poll.showResultWindow;
export default pollSlice.reducer;
