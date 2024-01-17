// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Unlocked } from './source/unlocked.svg';

const UnlockedIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Unlocked} inheritViewBox />;

export default UnlockedIcon;
