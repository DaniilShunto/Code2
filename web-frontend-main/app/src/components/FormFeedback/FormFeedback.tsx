// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import React, { ReactElement } from 'react';

enum FormFeedbackType {
  Error,
  Info,
}
const StyledFormFeedback = styled('div')<{ type?: FormFeedbackType }>(({ type }) => ({
  color: type === FormFeedbackType.Error ? 'red' : 'white',
  margin: '0.312rem auto',
}));

interface FormFeedbackProps {
  error?: ReactElement;
  info?: ReactElement;
}

export const FormFeedback = ({ error, info }: FormFeedbackProps) => {
  const isHelp = !error && info;
  if (!error && !info) return null;
  return (
    <StyledFormFeedback type={isHelp ? FormFeedbackType.Info : error && FormFeedbackType.Error} aria-live="polite">
      {isHelp ? info : error && error}
    </StyledFormFeedback>
  );
};
export default FormFeedback;
