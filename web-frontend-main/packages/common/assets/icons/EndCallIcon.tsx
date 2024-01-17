// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as EndCall } from './source/end-call.svg';

const EndCallIcon = (props: SvgIconProps) => <SvgIcon {...props} component={EndCall} inheritViewBox />;

export default EndCallIcon;
