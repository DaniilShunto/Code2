// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Recordings } from './source/recordings.svg';

const RecordingsIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Recordings} inheritViewBox />;

export default RecordingsIcon;
