// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Badge, Popover } from '@mui/material';
import { keyframes } from '@mui/system';
import { IconButton, SpeakerQueueIcon } from '@opentalk/common';
import { useState } from 'react';

import { useAppSelector } from '../../../hooks';
import { selectParticipantsWaitingCount } from '../../../store/slices/participantsSlice';
import WaitingParticipantsList from './WaitingParticipantsList';

const blink = keyframes`from { opacity: 1; } to { opacity: 0.3; }`;

const WaitingListButton = styled(IconButton)(({ theme }) => ({
  background: theme.palette.background.video,
  borderRadius: '0.25rem',
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    color: theme.palette.secondary.contrastText,
    background: theme.palette.primary.main,
    animation: `${blink} 1s ease alternate`,
    animationIterationCount: 'infinite',
  },
}));

const WaitingParticipantsPopover = () => {
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const isPopoverOpen = Boolean(anchorElement);

  const participantsInWaitingRoomCount = useAppSelector(selectParticipantsWaitingCount);

  return participantsInWaitingRoomCount === 0 ? (
    <>{null}</>
  ) : (
    <StyledBadge
      badgeContent={participantsInWaitingRoomCount}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <WaitingListButton
        aria-controls="waiting-list-popover"
        aria-expanded={isPopoverOpen ? 'true' : undefined}
        onClick={(event) => setAnchorElement(event.currentTarget)}
      >
        <SpeakerQueueIcon />
      </WaitingListButton>
      <Popover
        open={Boolean(anchorElement)}
        anchorEl={anchorElement}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={() => setAnchorElement(null)}
        disablePortal
      >
        <WaitingParticipantsList id="waiting-list-popover" />
      </Popover>
    </StyledBadge>
  );
};

export default WaitingParticipantsPopover;
