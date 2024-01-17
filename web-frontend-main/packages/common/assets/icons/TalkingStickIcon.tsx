// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as TalkingStick } from './source/talking-stick.svg';

const TalkingStickIcon = (props: SvgIconProps) => <SvgIcon {...props} component={TalkingStick} inheritViewBox />;

export default TalkingStickIcon;
