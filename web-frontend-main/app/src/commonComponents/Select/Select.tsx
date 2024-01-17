// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { InputBase, Select as MuiSelect, SelectProps as MuiSelectProps } from '@mui/material';
import { ArrowDownIcon } from '@opentalk/common';
import { FormWrapper, FormProps } from '@opentalk/common';
import React from 'react';

type SelectProps = MuiSelectProps & FormProps;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, valid, fullWidth, helperText, label, error, ...props }, ref) => {
    return (
      <FormWrapper label={label} helperText={helperText} error={error} fullWidth={fullWidth}>
        <MuiSelect
          ref={ref}
          variant={'standard'}
          input={<InputBase error={error} checked={valid} />}
          IconComponent={ArrowDownIcon}
          {...props}
        >
          {children}
        </MuiSelect>
      </FormWrapper>
    );
  }
);
export default Select;
