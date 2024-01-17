// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Debriefing } from './source/debriefing.svg';

const DebriefingIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Debriefing} inheritViewBox />;

export default DebriefingIcon;
