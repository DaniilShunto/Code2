// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { FormControl, FormHelperText, InputLabel as MuiInputLabel, Stack, styled } from '@mui/material';
import type { CSSObject } from '@mui/material';
import React, { useMemo } from 'react';

export type FormProps = {
  label?: string;
  helperText?: string;
  valid?: boolean;
  fullWidth?: boolean;
  error?: boolean;
  stacked?: boolean;
  /**
   * Width control property, when placed as `true` keeps content at `max-content` width.
   */
  inline?: boolean;
};

type FormWrapperProps = {
  children: React.ReactElement | Array<React.ReactElement | null> | null;
} & FormProps;

const InputLabel = styled(MuiInputLabel)({
  transform: 'unset',
});

export const FormWrapper = ({
  error = false,
  label,
  helperText,
  fullWidth = false,
  children,
  stacked,
  inline,
}: FormWrapperProps) => {
  const content = (
    <>
      {label && <span>{label}</span>}
      {children}
      {error && <FormHelperText error>{helperText}</FormHelperText>}
    </>
  );

  const sx = useMemo(() => {
    const output: CSSObject = {};
    if (inline) {
      output.width = 'max-content';
    }
    return output;
  }, [inline]);

  return (
    <FormControl variant="standard" fullWidth={fullWidth} sx={sx}>
      <InputLabel disableAnimation shrink>
        {stacked ? <Stack spacing={2}>{content}</Stack> : content}
      </InputLabel>
    </FormControl>
  );
};
