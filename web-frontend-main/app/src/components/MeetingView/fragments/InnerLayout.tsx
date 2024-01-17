// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { useMediaQuery, useTheme } from '@mui/material';

import MobileInnerLayout from '../Mobile/MobileInnerLayout';
import DesktopInnerLayout from './DesktopInnerLayout';

const InnerLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return isMobile ? <MobileInnerLayout /> : <DesktopInnerLayout />;
};

export default InnerLayout;
