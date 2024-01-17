// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Settings } from './source/dashboard-legal.svg';

const LegalLinksIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Settings} inheritViewBox />;

export default LegalLinksIcon;
