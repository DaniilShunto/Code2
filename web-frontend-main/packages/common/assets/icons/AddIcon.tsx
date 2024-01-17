// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Add } from './source/add.svg';

const AddIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Add} inheritViewBox />;

export default AddIcon;
