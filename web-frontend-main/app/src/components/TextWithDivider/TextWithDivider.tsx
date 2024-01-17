// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Typography as MuiTypography, TypographyProps } from '@mui/material';
import React from 'react';

const Wrapper = styled('div')({
  width: '100%',
  overflow: 'hidden',
  textAlign: 'center',
});

const Typography = styled(MuiTypography)({
  display: 'inline-block',
  position: 'relative',
  maxWidth: 'calc(100% - 5em)',
  marign: '0 auto',
  '&::before, &::after': {
    backgroundColor: '#385865',
    content: '""',
    position: 'absolute',
    height: 1,
    top: 0,
    bottom: 0,
    margin: 'auto',
    width: '9em',
  },
  '&::before': {
    right: '100%',
    marginRight: '0.5em',
  },
  '&::after': {
    left: '100%',
    marginLeft: '0.5em',
  },
});

const TextWithDivider = ({ children, ...props }: TypographyProps) => {
  return (
    <Wrapper>
      <Typography {...props}>{children}</Typography>
    </Wrapper>
  );
};

export default TextWithDivider;
