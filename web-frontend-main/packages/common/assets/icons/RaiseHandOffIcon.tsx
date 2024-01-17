// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as RaiseHandOff } from './source/raise-hand-off.svg';

const RaiseHandOffIcon = (props: SvgIconProps) => <SvgIcon {...props} component={RaiseHandOff} inheritViewBox />;

export default RaiseHandOffIcon;
