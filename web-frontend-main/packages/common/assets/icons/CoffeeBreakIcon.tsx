// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as CoffeeBreak } from './source/coffee-break.svg';

const CoffeeBreakIcon = (props: SvgIconProps) => <SvgIcon {...props} component={CoffeeBreak} inheritViewBox />;

export default CoffeeBreakIcon;
