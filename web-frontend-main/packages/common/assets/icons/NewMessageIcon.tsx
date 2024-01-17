// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as NewMessage } from './source/new-message.svg';

const NewMessageIcon = (props: SvgIconProps) => <SvgIcon {...props} component={NewMessage} inheritViewBox />;

export default NewMessageIcon;
