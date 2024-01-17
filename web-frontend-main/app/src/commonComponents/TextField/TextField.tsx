// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { InputBase, InputBaseProps, TextFieldProps } from '@mui/material';
import { setHotkeysEnabled } from '@opentalk/common';
import { FormWrapper, FormProps } from '@opentalk/common';
import React, { useCallback } from 'react';

import { useAppDispatch } from '../../hooks';

type ComposedTextFieldProps = TextFieldProps & InputBaseProps & FormProps;

export const ObservedInput = React.forwardRef(
  ({ error, onFocus, onBlur, ...props }: InputBaseProps, ref: React.Ref<unknown>) => {
    const dispatch = useAppDispatch();

    const handleOnFocus = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        dispatch(setHotkeysEnabled(false));
        onFocus && onFocus(event);
      },
      [dispatch, onFocus]
    );

    const handleOnBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        dispatch(setHotkeysEnabled(true));
        onBlur && onBlur(event);
      },
      [dispatch, onBlur]
    );

    return <InputBase ref={ref} {...props} error={error} onFocus={handleOnFocus} onBlur={handleOnBlur} />;
  }
);

ObservedInput.displayName = 'ObservedInput';

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
