// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Breakrooms } from './source/breakrooms.svg';

const BreakroomsIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Breakrooms} inheritViewBox />;

export default BreakroomsIcon;
