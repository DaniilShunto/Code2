// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as RaiseHandOn } from './source/raise-hand-on.svg';

const RaiseHandOnIcon = (props: SvgIconProps) => <SvgIcon {...props} component={RaiseHandOn} inheritViewBox />;

export default RaiseHandOnIcon;
