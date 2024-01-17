// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Stack, styled } from '@mui/material';

import LayoutSelection from '../fragments/LayoutSelection';
import MeetingTimer from '../fragments/MeetingTimer';
import RoomTitle from '../fragments/RoomTitle';
import Drawer from './fragments/Drawer';
import MobilePagination from './fragments/MobilePagination';

const HeaderContainer = styled(Stack)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr minmax(0, 3fr) 1fr minmax(0, 1fr) 2fr',
  columnGap: '0.25rem',
  margin: theme.spacing(1, 0),
  marginInline: '0.5rem',
}));

const MobileMeetingHeader = () => {
  return (
    <HeaderContainer>
      <Drawer />
      <RoomTitle />
      <LayoutSelection />
      <MobilePagination />
      <MeetingTimer />
    </HeaderContainer>
  );
};

export default MobileMeetingHeader;
