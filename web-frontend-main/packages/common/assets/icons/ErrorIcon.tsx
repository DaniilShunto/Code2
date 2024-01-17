// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Error } from './source/error.svg';

const ErrorIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Error} inheritViewBox />;

export default ErrorIcon;
