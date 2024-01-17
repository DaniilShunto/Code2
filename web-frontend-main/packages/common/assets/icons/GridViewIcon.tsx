// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as GridView } from './source/grid-view.svg';

const GridViewIcon = (props: SvgIconProps) => <SvgIcon {...props} component={GridView} inheritViewBox />;

export default GridViewIcon;
