// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Avatar } from './source/avatar.svg';

const AvatarIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Avatar} inheritViewBox />;

export default AvatarIcon;
