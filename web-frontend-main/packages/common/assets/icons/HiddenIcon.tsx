// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Hidden } from './source/hidden.svg';

const HiddenIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Hidden} inheritViewBox />;

export default HiddenIcon;
