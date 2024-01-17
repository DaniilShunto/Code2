// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as SpeakerView } from './source/speaker-view.svg';

const SpeakerViewIcon = (props: SvgIconProps) => <SvgIcon {...props} component={SpeakerView} inheritViewBox />;

export default SpeakerViewIcon;
