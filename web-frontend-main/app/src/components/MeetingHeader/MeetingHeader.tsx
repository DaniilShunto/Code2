// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { useMediaQuery, useTheme } from '@mui/material';

import MobileMeetingHeader from './Mobile/MobileMeetingHeader';
import DesktopMeetingHeader from './fragments/DesktopMeetingHeader';

const MeetingHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return isMobile ? <MobileMeetingHeader /> : <DesktopMeetingHeader />;
};

export default MeetingHeader;
