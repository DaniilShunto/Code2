// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Search } from './source/search.svg';

const SearchIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Search} inheritViewBox />;

export default SearchIcon;
