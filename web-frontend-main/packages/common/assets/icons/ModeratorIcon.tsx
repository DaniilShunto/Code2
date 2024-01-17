// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Moderator } from './source/moderator.svg';

const ModeratorIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Moderator} inheritViewBox />;

export default ModeratorIcon;
