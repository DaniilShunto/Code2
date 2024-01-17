// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { TextField, TextFieldProps } from '@mui/material';
import { setHotkeysEnabled } from '@opentalk/common';
import React from 'react';

import { useAppDispatch } from '../hooks';

export const CommonTextField = (props: TextFieldProps) => {
  const dispatch = useAppDispatch();

  return (
    <TextField
      {...props}
      onFocus={(event) => {
        dispatch(setHotkeysEnabled(false));
        props.onFocus && props.onFocus(event);
      }}
      onBlur={(event) => {
        dispatch(setHotkeysEnabled(true));
        props.onBlur && props.onBlur(event);
      }}
    />
  );
};
