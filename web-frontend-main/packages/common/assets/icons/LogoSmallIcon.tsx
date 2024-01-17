// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as LogoSmall } from './source/logo-small.svg';

const LogoSmallIcon = (props: SvgIconProps) => <SvgIcon {...props} component={LogoSmall} inheritViewBox />;

export default LogoSmallIcon;