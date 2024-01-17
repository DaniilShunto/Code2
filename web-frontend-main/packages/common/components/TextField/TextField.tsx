// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { InputBase, InputBaseProps, TextFieldProps } from '@mui/material';
import React, { forwardRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { setHotkeysEnabled } from '../../store';
import { FormWrapper, FormProps } from '../FormWrapper/FormWrapper';

type ComposedTextFieldProps = TextFieldProps & InputBaseProps & FormProps;

export const ObservedInput = forwardRef<HTMLInputElement, InputBaseProps>(({ error, onFocus, onBlur, ...props }, ref) => {
    const dispatch = useDispatch();

  const handleOnFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      dispatch(setHotkeysEnabled(false));
      onFocus && onFocus(event);
    },
    [onFocus]
  );

  const handleOnBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      dispatch(setHotkeysEnabled(true));
      onBlur && onBlur(event);
    },
    [onBlur]
  );

  return <InputBase ref={ref} {...props} error={error} onFocus={handleOnFocus} onBlur={handleOnBlur} />;
})

const TextField = React.forwardRef<HTMLInputElement, ComposedTextFieldProps>(
  ({ label, error, helperText, fullWidth, ...props }, ref) => {
    return (
      <FormWrapper label={label} helperText={helperText} error={error} fullWidth={fullWidth}>
        <ObservedInput {...props} ref={ref} />
      </FormWrapper>
    );
  }
);

export default TextField;
