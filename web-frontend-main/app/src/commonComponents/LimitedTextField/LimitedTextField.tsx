// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { InputBaseProps, TextFieldProps, Typography, styled } from '@mui/material';
import { FormWrapper, FormProps } from '@opentalk/common';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ObservedInput } from '../TextField/TextField';

type ComposedTextFieldProps = TextFieldProps &
  InputBaseProps &
  FormProps & { maxCharacters: number; showLimitAt?: number; value?: string; countBytes?: boolean };

const CounterMessage = styled(Typography, {
  shouldForwardProp: (prop) => !['isError'].includes(prop as string),
})<{ isError?: boolean }>(({ theme, isError }) => ({
  color: isError ? theme.palette.error.main : theme.palette.secondary.main,
}));

const LimitedTextField = React.forwardRef<HTMLInputElement, ComposedTextFieldProps>(
  ({ label, error, helperText, fullWidth, maxCharacters, showLimitAt, countBytes, ...props }, ref) => {
    const { t } = useTranslation();

    const { value } = props;
    const valueLength = countBytes ? new TextEncoder().encode(value).length : value?.length || 0;

    const remainingCharacters = maxCharacters - valueLength;
    const lengthError = remainingCharacters < 0;
    const showInfo = valueLength > (showLimitAt || 0);

    return (
      <FormWrapper label={label} helperText={helperText} error={error} fullWidth={fullWidth}>
        <ObservedInput {...props} error={error || lengthError} ref={ref} />
        {showInfo ? (
          <CounterMessage variant="caption" isError={lengthError}>
            {t(`global-textfield-max-characters${remainingCharacters < 0 ? '-error' : ''}`, {
              remainingCharacters: Math.abs(remainingCharacters),
            })}
          </CounterMessage>
        ) : null}
      </FormWrapper>
    );
  }
);

export default LimitedTextField;
