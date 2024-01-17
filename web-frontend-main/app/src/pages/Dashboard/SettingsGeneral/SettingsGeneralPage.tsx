// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Grid } from '@mui/material';
import React from 'react';

import LanguageSelector from './fragments/LanguageSelector';

const SettingsGeneralPage = () => (
  <Grid container direction={'column'} data-testid="dashboardSettingsGeneral" spacing={5}>
    <Grid item>
      <LanguageSelector />
    </Grid>
    {/* TODO add action ThemeSelector, currently has only presentation function
    <Grid item>
      <Divider />
    </Grid>
    <Grid item>
      <ThemeSelector />
    </Grid> */}
  </Grid>
);

export default SettingsGeneralPage;
