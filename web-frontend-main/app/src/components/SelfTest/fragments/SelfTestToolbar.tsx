// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Stack } from '@mui/material';
import React, { ReactNode } from 'react';

import browser from '../../../modules/BrowserSupport';
import AudioButton from '../../Toolbar/fragments/AudioButton';
import BlurScreenButton from '../../Toolbar/fragments/BlurScreenButton';
import VideoButton from '../../Toolbar/fragments/VideoButton';

interface SelfTestToolbarProps {
  actionButton?: ReactNode;
}

export const SelfTestToolbar = ({ actionButton }: SelfTestToolbarProps) => (
  <Stack direction={'row'} spacing={2}>
    <AudioButton isLobby />
    <VideoButton isLobby />
    {!browser.isSafari() && <BlurScreenButton isLobby />}
    {actionButton}
  </Stack>
);
