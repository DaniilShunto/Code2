// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Picture } from './source/picture.svg';

const PictureIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Picture} inheritViewBox />;

export default PictureIcon;
