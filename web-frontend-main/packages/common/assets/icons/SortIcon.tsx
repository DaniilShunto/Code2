// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Sort } from './source/sort.svg';

const SortIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Sort} inheritViewBox />;

export default SortIcon;
