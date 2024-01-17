// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button as MuiButton, ButtonProps } from '@mui/material';
import { styled } from '@mui/material';
import { BackIcon } from '@opentalk/common';
import React from 'react';

type BackButtonProps = Omit<ButtonProps, 'variant' | 'startIcon' | 'endIcon'>;

const Button = styled(MuiButton)({
  '& .MuiButton-startIcon': {
    '& > *:nth-of-type(1)': {
      fontSize: '0.75rem',
    },
  },
});

const BackButton = (props: BackButtonProps) => {
  return <Button {...props} variant={'text'} color={props.color || 'secondary'} startIcon={<BackIcon />} />;
};

export default BackButton;
