// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import MeetingHeader from '../../MeetingHeader';
import Toolbar from '../../Toolbar';
import MobileCinemaContainer from './MobileCinemaContainer';

const MobileInnerLayout = () => {
  return (
    <>
      <MeetingHeader />
      <MobileCinemaContainer />
      <Toolbar />
    </>
  );
};

export default MobileInnerLayout;
