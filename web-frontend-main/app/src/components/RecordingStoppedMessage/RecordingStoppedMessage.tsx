// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import { Trans } from 'react-i18next';

import { useAppSelector } from '../../hooks';
import { useInviteCode } from '../../hooks/useInviteCode';
import { selectEventInfo } from '../../store/slices/roomSlice';

const RecordingLink = styled('a')(({ theme }) => ({
  color: theme.palette.common.white,
}));

const RecordingStoppedMessage = () => {
  const eventInfo = useAppSelector(selectEventInfo);
  const inviteCode = useInviteCode();

  // Guest in this context is either a not registered user or a registered user,
  // that joined a room via invite link (was not explicitly invited via dashboard)
  const isGuest = inviteCode !== undefined;
  if (isGuest) {
    return <Trans i18nKey={'recording-stopped-message'} />;
  }

  const messageLink = `/dashboard/meetings/${eventInfo?.id}`;
  return (
    <Trans
      i18nKey={'recording-stopped-message-with-link'}
      values={{ messageLink }}
      components={{
        messageContent: <div />,
        messageLink: <RecordingLink target="_blank" href={messageLink} />,
      }}
    />
  );
};

export default RecordingStoppedMessage;
