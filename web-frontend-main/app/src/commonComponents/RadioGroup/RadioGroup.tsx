// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { RadioGroup as MuiRadioGroup, RadioGroupProps as MuiRadioGroupProps } from '@mui/material';
import { FormWrapper, FormProps } from '@opentalk/common';
import React from 'react';

type RadioGroupProps = MuiRadioGroupProps &
  FormProps & {
    setFieldValue?: (field: string, value: string, shouldValidate?: boolean) => void;
  };

const RadioGroup = ({ children, setFieldValue, name, error, helperText, ...props }: RadioGroupProps) => (
  <FormWrapper error={error} helperText={helperText} {...props} fullWidth>
    <MuiRadioGroup
      {...props}
      onChange={(_, value) => setFieldValue && name && setFieldValue(name, value, true)}
      data-testid="radioGroupTest"
    >
      {children}
    </MuiRadioGroup>
  </FormWrapper>
);

export default RadioGroup;
