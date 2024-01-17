// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as WoolBall } from './source/wool-ball.svg';

const WoolBallIcon = (props: SvgIconProps) => <SvgIcon {...props} component={WoolBall} inheritViewBox />;

export default WoolBallIcon;
