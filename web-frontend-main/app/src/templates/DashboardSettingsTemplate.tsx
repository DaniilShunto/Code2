// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Container as MuiContainer, styled } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';

const Container = styled(MuiContainer)({
  maxWidth: 944,
  margin: 0,
  overflow: 'auto',
});

const DashboardSettingsTemplate = () => {
  return (
    <Container maxWidth={false} disableGutters>
      <Outlet />
    </Container>
  );
};

export default DashboardSettingsTemplate;
