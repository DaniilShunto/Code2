// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as LegalBallot } from './source/legal-ballot.svg';

const LegalBallotIcon = (props: SvgIconProps) => <SvgIcon {...props} component={LegalBallot} inheritViewBox />;

export default LegalBallotIcon;
