// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Statistics } from './source/statistics.svg';

const StatisticsIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Statistics} inheritViewBox />;

export default StatisticsIcon;
