// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { BreakoutRoomId, RoomId } from '@opentalk/common';
import { selectIsAuthenticated } from '@opentalk/redux-oidc';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import LobbyView from '../../components/LobbyView';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useInviteCode } from '../../hooks/useInviteCode';
import { ConnectionState, selectRoomConnectionState } from '../../store/slices/roomSlice';
import { selectDisplayName } from '../../store/slices/userSlice';
import RoomLoadingView from './fragments/RoomLoadingView';

const MeetingView = React.lazy(() => import('../../components/MeetingView'));
const WaitingView = React.lazy(() => import('../../components/WaitingView'));

const RoomPage = () => {
  const dispatch = useAppDispatch();
  const { roomId, breakoutRoomId } = useParams<'roomId' | 'breakoutRoomId'>() as {
    roomId: RoomId;
    breakoutRoomId?: BreakoutRoomId;
  };
  const inviteCode = useInviteCode();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const displayName = useAppSelector(selectDisplayName);
  const connectionState = useAppSelector(selectRoomConnectionState);

  const renderRoom = useMemo(() => {
    if (!isAuthenticated && !inviteCode) {
      console.warn('meeting page - not logged in - redirect');
      return <LobbyView />;
    }
    switch (connectionState) {
      // Regular state machine flow
      case ConnectionState.Initial:
      case ConnectionState.Setup:
      case ConnectionState.FailedCredentials:
        return <LobbyView />;
      case ConnectionState.Starting:
        return <RoomLoadingView />;
      case ConnectionState.Online:
      case ConnectionState.Leaving:
        return <MeetingView />;
      case ConnectionState.Left:
        return <LobbyView />;
      case ConnectionState.Failed:
        return <RoomLoadingView />;
      // Exception states
      case ConnectionState.ReadyToEnter:
      case ConnectionState.Waiting:
        return <WaitingView />;
      case ConnectionState.Blocked:
        return <RoomLoadingView />;
      default:
        console.error('room state unknown', connectionState);
        return <LobbyView />;
    }
  }, [connectionState, breakoutRoomId, dispatch, displayName, inviteCode, roomId, isAuthenticated]);

  return <>{renderRoom}</>;
};

export default RoomPage;
