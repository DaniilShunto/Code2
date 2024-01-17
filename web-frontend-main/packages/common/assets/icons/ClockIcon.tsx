// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Clock } from './source/clock.svg';

const ClockIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Clock} inheritViewBox />;

export default ClockIcon;
