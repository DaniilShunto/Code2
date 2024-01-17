// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Close } from './source/close.svg';

const CloseIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Close} inheritViewBox />;

export default CloseIcon;
