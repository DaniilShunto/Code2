// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Visible } from './source/visible.svg';

const VisibleIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Visible} inheritViewBox />;

export default VisibleIcon;
