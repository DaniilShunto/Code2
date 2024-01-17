// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Poll } from './source/poll.svg';

const PollIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Poll} inheritViewBox />;

export default PollIcon;
