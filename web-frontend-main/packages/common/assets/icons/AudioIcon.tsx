// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Audio } from './source/audio.svg';

const AudioIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Audio} inheritViewBox />;

export default AudioIcon;
