// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as ArrowDown } from './source/arrow-down.svg';

const ArrowDownIcon = (props: SvgIconProps) => <SvgIcon {...props} component={ArrowDown} inheritViewBox />;

export default ArrowDownIcon;
