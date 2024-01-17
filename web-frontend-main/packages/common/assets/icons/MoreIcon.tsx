// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as More } from './source/more.svg';

const MoreIcon = (props: SvgIconProps) => <SvgIcon {...props} component={More} inheritViewBox />;

export default MoreIcon;
