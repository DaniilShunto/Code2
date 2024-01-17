// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Typography, styled } from '@mui/material';
import React, { forwardRef } from 'react';

import { ModerationTabKey } from '../../../config/moderationTabs';

interface SideTabPanelProps {
  value: ModerationTabKey;
  children?: React.ReactNode;
  hidden?: boolean;
  tabTitle?: string;
}

const TabTitle = styled(Typography)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
  fontSize: '1.25rem',
}));

const TabContainer = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const SideTabPanel = forwardRef<unknown, SideTabPanelProps>(({ children, value, hidden, tabTitle }, ref) => {
  return (
    <Box
      {...ref}
      flex={1}
      display={hidden ? 'none' : 'flex'}
      role="tabpanel"
      aria-hidden={hidden}
      id={`tabpanel-${value}`}
      aria-labelledby={value}
      flexDirection={'column'}
      maxWidth={'100%'}
      maxHeight={'100%'}
      overflow="hidden"
    >
      {tabTitle && <TabTitle>{tabTitle}</TabTitle>}
      {!hidden && <TabContainer>{children}</TabContainer>}
    </Box>
  );
});

export default SideTabPanel;
