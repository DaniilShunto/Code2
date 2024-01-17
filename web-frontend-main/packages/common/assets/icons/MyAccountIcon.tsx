// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as MyAccount } from './source/my-account.svg';

const MyAccountIcon = (props: SvgIconProps) => <SvgIcon {...props} component={MyAccount} inheritViewBox />;

export default MyAccountIcon;
