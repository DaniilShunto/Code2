// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Whiteboard } from './source/whiteboard.svg';

const WhiteboardIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Whiteboard} inheritViewBox />;

export default WhiteboardIcon;
