// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Forward } from './source/forward.svg';

const ForwardIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Forward} inheritViewBox />;

export default ForwardIcon;
