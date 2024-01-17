// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Gong } from './source/gong.svg';

const GongIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Gong} inheritViewBox />;

export default GongIcon;
