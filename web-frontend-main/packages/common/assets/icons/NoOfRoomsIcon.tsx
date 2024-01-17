// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as NoOfRooms } from './source/no-of-rooms.svg';

const NoOfRoomsIcon = (props: SvgIconProps) => <SvgIcon {...props} component={NoOfRooms} inheritViewBox />;

export default NoOfRoomsIcon;
