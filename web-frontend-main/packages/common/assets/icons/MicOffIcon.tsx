// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as MicOff } from './source/mic-off.svg';

interface MicOffIconExtraProps {
  disabled?: boolean;
}

const StyledSvgIcon = styled(SvgIcon)<MicOffIconExtraProps>(({ theme, disabled }) => ({
    color: disabled && theme.palette.text.disabled,
    '& .mic-off_svg__mic-off-line': {
        fill: disabled ? theme.palette.text.disabled : theme.palette.warning.main,
    }
}))

const MicOffIcon = (props: SvgIconProps & MicOffIconExtraProps) => <StyledSvgIcon {...props} component={MicOff} inheritViewBox />;

export default MicOffIcon;
