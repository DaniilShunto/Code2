// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as SignOut } from './source/sign-out.svg';

const SignOutIcon = (props: SvgIconProps) => <SvgIcon {...props} component={SignOut} inheritViewBox />;

export default SignOutIcon;
