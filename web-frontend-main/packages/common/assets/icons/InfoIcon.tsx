// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Info } from './source/info.svg';

const InfoIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Info} inheritViewBox />;

export default InfoIcon;
