// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as SendMessage } from './source/send-message.svg';

const SendMessageIcon = (props: SvgIconProps) => <SvgIcon {...props} component={SendMessage} inheritViewBox />;

export default SendMessageIcon;
