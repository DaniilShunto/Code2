// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Meetings } from './source/meetings.svg';

const MeetingsIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Meetings} inheritViewBox />;

export default MeetingsIcon;
