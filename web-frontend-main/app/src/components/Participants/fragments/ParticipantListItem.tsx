// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  styled,
  ListItem as MuiListItem,
  ListItemAvatar as MuiListItemAvatar,
  ListItemText as MuiListItemText,
  Typography,
  Box,
  Badge,
} from '@mui/material';
import {
  MicOffIcon,
  MicOnIcon,
  RaiseHandOnIcon,
  ShareScreenOnIcon,
  MoreIcon,
  ProtocolIcon,
  MediaSessionType,
  ParticipationKind,
  useDateFormat,
  ChatScope,
  PhoneIcon,
  TelephoneStrokeIcon,
} from '@opentalk/common';
import { notifications, Participant, ProtocolAccess, SortOption, ParticipantAvatar } from '@opentalk/common';
import React, { CSSProperties, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Role } from '../../../api/types/incoming/control';
import { grantModeratorRole, revokeModeratorRole } from '../../../api/types/outgoing/control';
import { grantPresenterRole, revokePresenterRole } from '../../../api/types/outgoing/media';
import { banParticipant, kickParticipant, enableWaitingRoom } from '../../../api/types/outgoing/moderation';
import IconButton from '../../../commonComponents/IconButton';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectAudioEnabled, selectShareScreenEnabled } from '../../../store/slices/mediaSlice';
import { selectSubscriberStateById } from '../../../store/slices/mediaSubscriberSlice';
import { selectHandUp } from '../../../store/slices/moderationSlice';
import { chatConversationStateSet, selectParticipantsSortOption } from '../../../store/slices/uiSlice';
import { selectIsModerator, selectOurUuid, selectUserProtocolAccess } from '../../../store/slices/userSlice';
import MenuPopover, { IMenuOptionItem } from './MenuPopover';

const Avatar = styled(ParticipantAvatar)({
  width: '2.25rem',
  height: '2.25rem',
  fontSize: '0.75rem',
});

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 'initial',
});

const ListItem = styled(MuiListItem)(({ theme }) => ({
  padding: theme.spacing(1, 1, 1, 0),
  cursor: 'pointer',
  '& .more-icon': {
    color: 'transparent',
  },
  ':hover': {
    opacity: 0.8,
    '& .more-icon': {
      color: theme.palette.primary.contrastText,
    },
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, 30%)',
    background: theme.palette.text.disabled,
    width: '100%',
  },
}));

const MicOffIconStyled = styled(MicOffIcon)({
  opacity: '0.5',
});

const PhoneOffIconStyled = styled(TelephoneStrokeIcon)({
  opacity: '0.5',
});

const ListItemText = styled(MuiListItemText)(({ theme }) => ({
  padding: theme.spacing(0, 1),
  '& p': {
    fontWeight: 400,
    lineHeight: 1,
  },
}));

const IconsContainer = styled(Box)({
  alignItems: 'center',
  display: 'flex',
  '& svg': {
    width: '0.8em',
    height: '0.8em',
  },
});

const JoinedText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
}));

type ParticipantRowProps = {
  data: Participant[];
  index: number;
  style: CSSProperties;
};

const ParticipantListItem = ({ data, index, style }: ParticipantRowProps) => {
  const participant = data[index];
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
  const sortType = useAppSelector(selectParticipantsSortOption);
  const isModerator = useAppSelector(selectIsModerator);
  const { t } = useTranslation();
  const isSipParticipant = participant.participationKind === ParticipationKind.Sip;
  const dispatch = useAppDispatch();
  const open = Boolean(anchorEl);
  const ownId = useAppSelector(selectOurUuid);
  const ownAudioEnabled = useAppSelector(selectAudioEnabled);
  const ownScreenShareEnabled = useAppSelector(selectShareScreenEnabled);
  const userProtocolAccess = useAppSelector(selectUserProtocolAccess);
  const ownHandRaised = useAppSelector(selectHandUp);

  const { active: audioActive } = useAppSelector(
    selectSubscriberStateById(
      {
        participantId: participant.id,
        mediaType: MediaSessionType.Video,
      },
      'audio'
    )
  );

  const { active: screenShareActive } = useAppSelector(
    selectSubscriberStateById(
      {
        participantId: participant.id,
        mediaType: MediaSessionType.Screen,
      },
      'video'
    )
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRemoval = () => {
    if (participant.participationKind === ParticipationKind.User) {
      dispatch(banParticipant.action({ target: participant.id }));
      notifications.info(t('meeting-notification-user-was-banned', { user: participant.displayName }));
      return;
    }
    if (participant.participationKind === ParticipationKind.Guest) {
      dispatch(kickParticipant.action({ target: participant.id }));
      dispatch(enableWaitingRoom.action());
      notifications.info(t('meeting-notification-user-was-kicked', { user: participant.displayName }));
      return;
    }
    if (participant.participationKind === ParticipationKind.Sip) {
      dispatch(kickParticipant.action({ target: participant.id }));
      notifications.info(t('meeting-notification-user-was-kicked', { user: participant.displayName }));
      return;
    }
    setAnchorEl(undefined);
    notifications.error(t('dashboard-meeting-notification-error'));
  };

  const handleModerationRight = () => {
    participant?.role === Role.Moderator
      ? dispatch(revokeModeratorRole.action({ target: participant.id }))
      : dispatch(grantModeratorRole.action({ target: participant.id }));
    setAnchorEl(undefined);
  };

  const handlePresenterRoleRight = () => {
    participant.isPresenter
      ? dispatch(revokePresenterRole.action({ participantIds: [participant.id] }))
      : dispatch(grantPresenterRole.action({ participantIds: [participant.id] }));
  };

  const moderatorRights = () => {
    switch (participant.role) {
      case Role.Moderator:
        return [
          {
            i18nKey: 'participant-menu-revoke-moderator',
            action: handleModerationRight,
          },
        ];
      case Role.User:
        return [
          {
            i18nKey: 'participant-menu-grant-moderator',
            action: handleModerationRight,
          },
          {
            i18nKey: participant.isPresenter ? 'revoke-presenter-role' : 'grant-presenter-role',
            action: handlePresenterRoleRight,
          },
        ];
      case Role.Guest:
        return [
          {
            i18nKey: participant.isPresenter ? 'revoke-presenter-role' : 'grant-presenter-role',
            action: handlePresenterRoleRight,
          },
        ];
      default:
        return [];
    }
  };

  const participantMenuOptionItems: IMenuOptionItem[] = [
    {
      i18nKey: 'participant-menu-send-message',
      action: () =>
        dispatch(
          chatConversationStateSet({
            scope: ChatScope.Private,
            targetId: participant.id,
          })
        ),
    },
  ];

  const moderatorMenuOptionItems: IMenuOptionItem[] = [
    ...participantMenuOptionItems,
    {
      i18nKey: 'participant-menu-remove-participant',
      action: handleRemoval,
    },
    ...moderatorRights(),
  ];

  const renderIcon = useCallback(() => {
    const isParticipantMe = participant.id === ownId;
    const isHandRaised = isParticipantMe ? ownHandRaised : participant.handIsUp;
    const isScreenShareEnabled = isParticipantMe ? ownScreenShareEnabled : screenShareActive;
    const isAudioEnabled = isParticipantMe ? ownAudioEnabled : audioActive;

    if (isHandRaised) {
      return <RaiseHandOnIcon />;
    } else if (isScreenShareEnabled) {
      return <ShareScreenOnIcon />;
    } else if (isAudioEnabled) {
      return isSipParticipant ? <PhoneIcon /> : <MicOnIcon />;
    }
    return isSipParticipant ? <PhoneOffIconStyled /> : <MicOffIconStyled />;
  }, [
    participant.handIsUp,
    participant.id,
    isSipParticipant,
    audioActive,
    screenShareActive,
    ownAudioEnabled,
    ownScreenShareEnabled,
    ownHandRaised,
  ]);

  const renderMenu = () => (
    <>
      <IconButton aria-label="open participant more menu" onClick={handleClick}>
        <MoreIcon className={'more-icon'} />
      </IconButton>
      {open && (
        <MenuPopover
          open={true}
          setAnchorEl={setAnchorEl}
          anchorEl={anchorEl}
          options={isModerator ? moderatorMenuOptionItems : participantMenuOptionItems}
        />
      )}
    </>
  );

  const getContextText = () => {
    switch (sortType) {
      case SortOption.RaisedHandFirst: {
        const handUpTimestamp = new Date(participant?.handUpdatedAt ?? new Date());
        const formattedHandUpTime = useDateFormat(handUpTimestamp, 'time');
        return t('participant-hand-raise-text', { handUpdated: formattedHandUpTime });
      }
      case SortOption.LastActive: {
        const lastActiveTimestamp = new Date(participant?.lastActive ?? new Date());
        const formattedLastActiveTime = useDateFormat(lastActiveTimestamp, 'time');
        return t('participant-last-active-text', { lastActive: formattedLastActiveTime });
      }
      default: {
        const joinedTimestamp = new Date(participant?.joinedAt ?? new Date());
        const formattedJoinedTime = useDateFormat(joinedTimestamp, 'time');
        return t('participant-joined-text', { joinedTime: formattedJoinedTime });
      }
    }
  };

  const isProtocolEditor = (participant: Participant) => {
    if (participant.id === ownId && userProtocolAccess === ProtocolAccess.Write) {
      return true;
    }
    if (participant.protocolAccess && participant.protocolAccess === ProtocolAccess.Write) {
      return true;
    }
    return false;
  };

  const renderAvatar = useCallback(() => {
    {
      const isGuestUser = participant.role === Role.Guest;

      if (isGuestUser) {
        {
          return (
            <StyledBadge badgeContent={t('guest-label')}>
              <Avatar src={participant?.avatarUrl} alt={participant?.displayName} isSipParticipant={isSipParticipant}>
                {participant?.displayName}
              </Avatar>
            </StyledBadge>
          );
        }
      }
      return (
        <Avatar src={participant?.avatarUrl} alt={participant?.displayName} isSipParticipant={isSipParticipant}>
          {participant?.displayName}
        </Avatar>
      );
    }
  }, [participant.role]);

  return (
    <ListItem style={style}>
      <Box display="flex" flexWrap="nowrap" alignItems="center" width="100%">
        <ListItemAvatar>{renderAvatar()}</ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant={'body1'} noWrap translate="no" mb={0.5}>
              {participant?.displayName}
            </Typography>
          }
          secondary={
            <JoinedText variant={'caption'} translate="no">
              {getContextText()}
            </JoinedText>
          }
        />

        {participant.id !== ownId && renderMenu()}
        {isProtocolEditor(participant) && (
          <IconsContainer>
            <ProtocolIcon />
          </IconsContainer>
        )}
        <IconsContainer>{renderIcon()}</IconsContainer>
      </Box>
    </ListItem>
  );
};

export default ParticipantListItem;
