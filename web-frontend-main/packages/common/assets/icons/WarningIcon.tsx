// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Warning } from './source/warning.svg';

const WarningIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Warning} inheritViewBox />;

export default WarningIcon;
