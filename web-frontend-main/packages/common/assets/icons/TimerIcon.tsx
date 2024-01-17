// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Timer } from './source/timer.svg';

const TimerIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Timer} inheritViewBox />;

export default TimerIcon;
