// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Protocol } from './source/protocol.svg';

const ProtocolIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Protocol} inheritViewBox />;

export default ProtocolIcon;
