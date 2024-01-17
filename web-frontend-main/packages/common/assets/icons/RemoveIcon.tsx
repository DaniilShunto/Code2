// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Remove } from './source/remove.svg';

const RemoveIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Remove} inheritViewBox />;

export default RemoveIcon;
