// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Trash } from './source/trash.svg';

const TrashIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Trash} inheritViewBox />;

export default TrashIcon;
