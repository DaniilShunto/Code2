// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Done } from './source/done.svg';

const DoneIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Done} inheritViewBox />;

export default DoneIcon;
