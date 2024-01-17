// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Secure } from './source/secure.svg';

const SecureIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Secure} inheritViewBox />;

export default SecureIcon;
