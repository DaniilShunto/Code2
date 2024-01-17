// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, MenuItem as MuiMenuItem, Popover as MuiPopover, styled, Stack, MenuList } from '@mui/material';
import { MoreIcon, notificationAction, notifications } from '@opentalk/common';
import { Event, EventId, InviteStatus } from '@opentalk/rest-api-rtk-query';
import React, { KeyboardEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';

import {
  useLazyGetRoomInvitesQuery,
  useDeclineEventInviteMutation,
  useDeleteEventMutation,
  useDeleteEventSharedFolderMutation,
  useMarkFavoriteEventMutation,
  useUnmarkFavoriteEventMutation,
} from '../../../api/rest';
import IconButton from '../../../commonComponents/IconButton';
import { useAppSelector } from '../../../hooks';
import { selectBaseUrl } from '../../../store/slices/configSlice';
import { composeInviteUrl } from '../../../utils/apiUtils';
import getReferrerRouterState from '../../../utils/getReferrerRouterState';
import ConfirmDialog from '../../ConfirmDialog';
import { MeetingCardFragmentProps } from '../MeetingCard';

interface IMeetingCardOptionItem {
  disabled?: boolean;
  i18nKey: string;
  action: () => void;
}

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  justifyContent: 'space-between',
  fontSize: theme.typography.pxToRem(14),
  [theme.breakpoints.down('md')]: {
    fontSize: theme.typography.pxToRem(12),
  },
  '&.Mui-selected, &.Mui-selected:hover, &:hover': {
    backgroundColor: theme.palette.secondary.lighter,
  },
}));

const MoreButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(1),
  padding: theme.spacing(1),

  '& svg': {
    width: theme.typography.pxToRem(20),
    height: theme.typography.pxToRem(20),
  },
}));

const MeetingPopover = ({ event, isMeetingCreator, highlighted }: MeetingCardFragmentProps) => {
  const { t } = useTranslation();
  const { isFavorite, title } = event;
  const eventId = event.id as EventId;
  const roomId = event.room?.id;

  const [markEvent] = useMarkFavoriteEventMutation();
  const [unmarkEvent] = useUnmarkFavoriteEventMutation();
  const [deleteEvent] = useDeleteEventMutation();
  const [declineEventInvitation] = useDeclineEventInviteMutation();
  const [isConfirmDialogVisible, showConfirmDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
  const [deleteSharedFolder] = useDeleteEventSharedFolderMutation();
  const isFirstTryToDeleteSharedFolder = useRef(true);
  const baseUrl = useAppSelector(selectBaseUrl);

  const [getRoomInvites, { data: invites, isLoading: isGetInvitesLoading }] = useLazyGetRoomInvitesQuery();

  const openPopupMenu = (mouseEvent: React.MouseEvent<HTMLButtonElement>) => {
    stopPropagation(mouseEvent);
    setAnchorEl(mouseEvent.currentTarget);
  };

  const stopPropagation = (mouseEvent: React.MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLAnchorElement>) => {
    mouseEvent.stopPropagation();
  };

  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const updateMeeting = () => {
    navigate(`/dashboard/meetings/update/${eventId}/0`, { state: { ...getReferrerRouterState(window.location) } });
  };
  const viewMeetingDetails = () => {
    navigate(`/dashboard/meetings/${eventId}`, { state: { ...getReferrerRouterState(window.location) } });
  };

  const copyMeetingLink = (): void => {
    setAnchorEl(undefined);
    const link = `${baseUrl}/room/${roomId}`;
    navigator.clipboard.writeText(link);
    notifications.success(t('global-copy-link-success'));
  };

  const getGuestLink = async () => {
    if (roomId) {
      try {
        const invitesList = invites ? invites : await getRoomInvites({ roomId }).unwrap();
        const permanentInvite = invitesList.find((invite) => invite.active && invite.expiration === null);

        if (permanentInvite) {
          const inviteURLString = composeInviteUrl(baseUrl, roomId, permanentInvite.inviteCode).toString();
          navigator.clipboard.writeText(inviteURLString);
          notifications.success(t('global-copy-link-success'));
          setAnchorEl(undefined);
        } else {
          notifications.error(t('global-copy-permanent-guest-link-error'), { persist: true });
        }
      } catch (error) {
        notifications.error(t('global-copy-permanent-guest-link-error'));
      }
    }
  };

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  const declineInvite = async () => {
    try {
      await declineEventInvitation({ eventId }).unwrap();
      notifications.success(
        t(`dashbooard-event-decline-invitation-notification`, {
          meetingTitle: title,
        })
      );
    } catch (error) {
      notifications.error(
        t(`error-general`, {
          meetingTitle: title,
        })
      );
    }

    setAnchorEl(undefined);
  };

  const showDialog = () => {
    setAnchorEl(undefined);
    showConfirmDialog(true);
  };

  const deleteMeeting = async () => {
    if ('sharedFolder' in event) {
      try {
        await deleteSharedFolder({ eventId, forceDeletion: false }).unwrap();
      } catch (error) {
        if (isFirstTryToDeleteSharedFolder.current) {
          showConfirmDialog(false);
          setAnchorEl(undefined);
          notificationAction({
            msg: t('dashboard-meeting-shared-folder-delete-error-message'),
            variant: 'error',
            actionBtnText: t('dashboard-meeting-shared-folder-error-retry-button'),
            cancelBtnText: t('dashboard-meeting-shared-folder-error-cancel-button'),
            persist: true,
            onAction: () => {
              isFirstTryToDeleteSharedFolder.current = false;
              deleteMeeting();
            },
            onCancel: () => {
              isFirstTryToDeleteSharedFolder.current = true;
              showConfirmDialog(false);
              setAnchorEl(undefined);
            },
          });
          return;
        } else {
          isFirstTryToDeleteSharedFolder.current = true;
          notifications.error(t('dashboard-meeting-shared-folder-delete-retry-error-message'));
          return;
        }
      }
    }

    deleteEvent(eventId);
    showConfirmDialog(false);
    setAnchorEl(undefined);
  };

  const meetingOptionItems: IMeetingCardOptionItem[] = [
    isFavorite
      ? {
          i18nKey: 'dashboard-meeting-card-popover-remove',
          action: () => {
            unmarkEvent(eventId);
            setAnchorEl(undefined);
          },
        }
      : {
          i18nKey: 'dashboard-meeting-card-popover-add',
          action: () => {
            markEvent(eventId);
            setAnchorEl(undefined);
          },
        },
    ...((event as Event).inviteStatus !== InviteStatus.Declined && !isMeetingCreator
      ? [
          {
            i18nKey: 'global-decline',
            action: declineInvite,
          },
        ]
      : []),
    {
      i18nKey: 'dashboard-meeting-card-popover-details',
      action: viewMeetingDetails,
    },
    {
      i18nKey: 'dashboard-meeting-card-popover-copy-link',
      action: copyMeetingLink,
    },
  ];

  const creatorMeetingOptionItems: IMeetingCardOptionItem[] = [
    { i18nKey: 'dashboard-meeting-card-popover-update', action: updateMeeting },
    ...meetingOptionItems,
    //At this time requests for invites will only be available to creators in the dashboard - extended to moderator later
    {
      i18nKey: 'dashboard-meeting-card-popover-copy-guest-link',
      action: getGuestLink,
      //Prevents doing multiple requests while loading
      disabled: isGetInvitesLoading,
    },
    { i18nKey: 'dashboard-meeting-card-popover-delete', action: showDialog },
  ];

  const options = isMeetingCreator ? creatorMeetingOptionItems : meetingOptionItems;
  const renderMenuOptionItems = () =>
    options.map((option) => (
      <MenuItem disabled={option.disabled} key={option.i18nKey} onClick={option.action} aria-label={t(option.i18nKey)}>
        {t(option.i18nKey)}
      </MenuItem>
    ));

  const handleMoreButtonKeyDownEvent = (event: KeyboardEvent) => {
    const { code } = event;
    if (code === 'ArrowDown') {
      event.preventDefault(); // prevent scrolling
      setAnchorEl(event.target as HTMLButtonElement);
    }
  };

  const handleMoreButtonKeyUpEvent = (event: KeyboardEvent) => {
    const { code } = event;
    if (code === 'Enter' || code === 'Space' || code === 'ArrowDown') {
      setAnchorEl(event.target as HTMLButtonElement);
    }
  };

  return (
    <Stack flexDirection={'row'}>
      <MoreButton
        color="inherit"
        aria-label={t('toolbar-button-more-tooltip-title')}
        size={'small'}
        onMouseDown={openPopupMenu}
        onKeyDown={handleMoreButtonKeyDownEvent}
        onKeyUp={handleMoreButtonKeyUpEvent}
      >
        <MoreIcon />
      </MoreButton>
      <MuiPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onMouseDown={stopPropagation}
      >
        <MenuList autoFocusItem={true}>{renderMenuOptionItems()}</MenuList>
      </MuiPopover>
      <ConfirmDialog
        open={isConfirmDialogVisible}
        onConfirm={deleteMeeting}
        onCancel={() => {
          showConfirmDialog(false);
        }}
        message={t(`dashboard-meeting-card-delete-dialog-message`, {
          subject: title,
        })}
        title={t('dashboard-meeting-card-delete-dialog-title')}
        submitButtonText={t('dashboard-meeting-card-delete-dialog-ok')}
        cancelButtonText={t('dashboard-meeting-card-delete-dialog-cancel')}
        onMouseDown={stopPropagation}
      />
      <Button
        color="secondary"
        variant={highlighted ? 'contained' : 'outlined'}
        to={`/room/${roomId}`}
        component={NavLink}
        target="_blank"
        onMouseDown={stopPropagation}
      >
        {t('dashboard-home-join')}
      </Button>
    </Stack>
  );
};

export default MeetingPopover;
