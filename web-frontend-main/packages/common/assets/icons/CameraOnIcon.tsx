// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as CameraOn } from './source/camera-on.svg';

const CameraOnIcon = (props: SvgIconProps) => <SvgIcon {...props} component={CameraOn} inheritViewBox />;

export default CameraOnIcon;
