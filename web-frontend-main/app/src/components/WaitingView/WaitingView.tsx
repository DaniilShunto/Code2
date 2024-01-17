// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Container, Typography, useTheme } from '@mui/material';
import { RoomId } from '@opentalk/rest-api-rtk-query';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetRoomEventInfoQuery } from '../../api/rest';
import { enterRoom } from '../../api/types/outgoing/control';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useInviteCode } from '../../hooks/useInviteCode';
import { selectFeatures, selectShowmprintContainer } from '../../store/slices/configSlice';
import { selectRoomConnectionState, ConnectionState, selectRoomId } from '../../store/slices/roomSlice';
import ImprintContainer from '../ImprintContainer';
import { useMediaContext } from '../MediaProvider/MediaProvider';
import SelfTest from '../SelfTest';

const WaitingView = () => {
  const connectionState = useAppSelector(selectRoomConnectionState);
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const mediaContext = useMediaContext();
  const { joinWithoutMedia } = useAppSelector(selectFeatures);
  const showImprintContainer = useAppSelector(selectShowmprintContainer);
  const inviteCode = useInviteCode();
  const roomId = useAppSelector(selectRoomId);
  const { data: roomData } = useGetRoomEventInfoQuery({ id: roomId as RoomId, inviteCode }, { skip: !roomId });

  const readyToEnter = connectionState === ConnectionState.ReadyToEnter;

  const moveToRoom = useCallback(async () => {
    if (joinWithoutMedia) {
      await mediaContext.trySetVideo(false);
      await mediaContext.trySetAudio(false);
    }
    dispatch(enterRoom.action());
  }, [dispatch, joinWithoutMedia, mediaContext]);

  return (
    <>
      <Container>
        <SelfTest
          actionButton={
            <Button onClick={moveToRoom} disabled={!readyToEnter}>
              {readyToEnter ? t('joinform-enter-now') : t('joinform-waiting-room-enter')}
            </Button>
          }
          title={roomData?.title}
        >
          <Typography
            variant="body1"
            textAlign={'center'}
            fontSize={'1.37rem'}
            color={theme.palette.text.secondary}
            justifyContent="center"
            width={'100%'}
          >
            {readyToEnter ? t('in-waiting-room-ready') : t('in-waiting-room')}
          </Typography>
        </SelfTest>
      </Container>
      {showImprintContainer && <ImprintContainer />}
    </>
  );
};

export default WaitingView;
