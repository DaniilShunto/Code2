// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';

import { createOpenTalkTheme } from '../../assets/themes/opentalk';
import SuspenseLoading from '../../commonComponents/SuspenseLoading';

const SplashScreenPage = () => (
  <ThemeProvider theme={createOpenTalkTheme()}>
    <CssBaseline />
    <SuspenseLoading />
  </ThemeProvider>
);

export default SplashScreenPage;
