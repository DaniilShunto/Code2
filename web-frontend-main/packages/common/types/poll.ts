// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ChoiceId, PollId } from './common';

export interface ChoiceCommon {
  id: ChoiceId;
}

export interface Choice extends ChoiceCommon {
  content: string;
}

export interface ChoiceResult extends ChoiceCommon {
  count: number;
}

export interface InitialPoll {
  id: PollId;
  duration: number;
  live: boolean;
  started: string;
  topic: string;
  choices: Array<Choice>;
  results?: Array<ChoiceResult>;
}
