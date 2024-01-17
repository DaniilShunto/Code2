// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Home } from './source/home.svg';

const HomeIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Home} inheritViewBox />;

export default HomeIcon;
