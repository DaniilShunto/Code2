// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

export const isLastStep = (steps: number, currentStepIndex: number) => {
  return steps === currentStepIndex + 1;
};

export const isFirstStep = (currentStepIndex: number) => {
  return currentStepIndex === 0;
};
