// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Copy } from './source/copy.svg';

const CopyIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Copy} inheritViewBox />;

export default CopyIcon;
