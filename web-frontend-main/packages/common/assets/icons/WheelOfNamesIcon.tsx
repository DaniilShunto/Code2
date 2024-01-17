// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as WheelOfNames } from './source/wheel-of-names.svg';

const WheelOfNamesIcon = (props: SvgIconProps) => <SvgIcon {...props} component={WheelOfNames} inheritViewBox />;

export default WheelOfNamesIcon;
