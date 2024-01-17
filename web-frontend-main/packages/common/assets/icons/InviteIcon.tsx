// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Invite } from './source/invite.svg';

const InviteIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Invite} inheritViewBox />;

export default InviteIcon;
