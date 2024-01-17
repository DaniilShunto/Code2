// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as CameraOff } from './source/camera-off.svg';

const CameraOffIcon = (props: SvgIconProps) => <SvgIcon {...props} component={CameraOff} inheritViewBox />;

export default CameraOffIcon;
