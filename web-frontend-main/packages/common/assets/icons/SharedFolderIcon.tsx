// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Protocol } from './source/shared-folder.svg';

const SharedFolderIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Protocol} inheritViewBox />;

export default SharedFolderIcon;
