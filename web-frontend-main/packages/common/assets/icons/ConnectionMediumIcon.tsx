// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as ConnectionMedium } from './source/connection-medium.svg';

const ConnectionMediumIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} component={ConnectionMedium} inheritViewBox />
);

export default ConnectionMediumIcon;
