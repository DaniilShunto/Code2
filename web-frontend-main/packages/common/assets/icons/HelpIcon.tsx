// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Help } from './source/help.svg';

const HelpIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Help} inheritViewBox />;

export default HelpIcon;
