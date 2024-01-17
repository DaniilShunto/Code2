// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as ArrowLeft } from './source/arrow-left.svg';

const ArrowLeftIcon = (props: SvgIconProps) => <SvgIcon {...props} component={ArrowLeft} inheritViewBox />;

export default ArrowLeftIcon;
