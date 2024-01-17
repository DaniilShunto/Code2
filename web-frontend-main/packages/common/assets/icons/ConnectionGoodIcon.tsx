// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as ConnectionGood } from './source/connection-good.svg';

const ConnectionGoodIcon = (props: SvgIconProps) => <SvgIcon {...props} component={ConnectionGood} inheritViewBox />;

export default ConnectionGoodIcon;
