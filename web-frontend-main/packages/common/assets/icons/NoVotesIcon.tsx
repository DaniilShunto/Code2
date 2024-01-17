// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as NoVotes } from './source/no-votes.svg';

const NoVotesIcon = (props: SvgIconProps) => <SvgIcon {...props} component={NoVotes} inheritViewBox />;

export default NoVotesIcon;
