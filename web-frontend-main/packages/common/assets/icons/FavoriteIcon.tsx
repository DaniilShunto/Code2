// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Favorite } from './source/favorite.svg';

const FavoriteIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Favorite} inheritViewBox />;

export default FavoriteIcon;
