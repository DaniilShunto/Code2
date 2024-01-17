// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as AddUser } from './source/add-user.svg';

const AddUserIcon = (props: SvgIconProps) => <SvgIcon {...props} component={AddUser} inheritViewBox />;

export default AddUserIcon;
