// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Locked } from './source/locked.svg';

const LockedIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Locked} inheritViewBox />;

export default LockedIcon;
