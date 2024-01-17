// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as FullscreenView } from './source/fullscreen-view.svg';

const FullscreenViewIcon = (props: SvgIconProps) => <SvgIcon {...props} component={FullscreenView} inheritViewBox />;

export default FullscreenViewIcon;
