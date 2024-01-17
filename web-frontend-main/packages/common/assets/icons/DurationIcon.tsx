// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Duration } from './source/duration.svg';

const DurationIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Duration} inheritViewBox />;

export default DurationIcon;
