// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Faq } from './source/faq.svg';

const FaqIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Faq} inheritViewBox />;

export default FaqIcon;
