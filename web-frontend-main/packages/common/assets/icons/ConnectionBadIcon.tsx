// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as ConnectionBad } from './source/connection-bad.svg';

const ConnectionBadIcon = (props: SvgIconProps) => <SvgIcon {...props} component={ConnectionBad} inheritViewBox />;

export default ConnectionBadIcon;
