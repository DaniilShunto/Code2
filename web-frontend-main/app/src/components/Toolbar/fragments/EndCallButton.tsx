// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import { EndCallIcon } from '@opentalk/common';
import { selectIsAuthenticated } from '@opentalk/redux-oidc';
import { RoomId } from '@opentalk/rest-api-rtk-query';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useGetMeQuery, useGetRoomQuery } from '../../../api/rest';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { useFullscreenContext } from '../../../hooks/useFullscreenContext';
import { hangUp } from '../../../store/commonActions';
import { selectEventInfo } from '../../../store/slices/roomSlice';
import { isRegisteredUser } from '../../../utils/typeGuardUtils';
import CloseMeetingDialog from '../../CloseMeetingDialog';
import ToolbarButton from './ToolbarButton';

const EndCallButton = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { roomId } = useParams<'roomId'>() as {
    roomId: RoomId;
  };
  const isLoggedInUser = useAppSelector(selectIsAuthenticated);
  const { data: me } = useGetMeQuery(undefined, { skip: !isLoggedInUser });
  const { data: roomData } = useGetRoomQuery(roomId, { skip: !isLoggedInUser });

  const [isConfirmDialogVisible, showConfirmDialog] = useState(false);
  const isMeetingCreator =
    roomData?.createdBy && isRegisteredUser(roomData.createdBy) && me?.id === roomData.createdBy.id;
  const eventInfo = useAppSelector(selectEventInfo);
  const fullscreenContext = useFullscreenContext();

  const StyledEndCallButton = styled(ToolbarButton)(({ theme }) => ({
    svg: {
      fill: theme.palette.error.main,
    },
    ':hover': {
      background: theme.palette.error.main,
      svg: {
        fill: theme.palette.common.white,
      },
    },
  }));

  const hangUpHandler = useCallback(() => dispatch(hangUp()), [dispatch]);

  const onClose = useCallback(() => {
    showConfirmDialog(false);
  }, [showConfirmDialog]);

  const handleEndCall = () => {
    if (isMeetingCreator && !eventInfo?.isAdhoc) {
      showConfirmDialog(true);
      fullscreenContext.setHasActiveOverlay(true);
    } else {
      hangUpHandler();
    }
  };

  return (
    <>
      <StyledEndCallButton
        tooltipTitle={t('toolbar-button-end-call-tooltip-title')}
        onClick={handleEndCall}
        active={false}
        data-testid="toolbarEndCallButton"
      >
        <EndCallIcon color="error" />
      </StyledEndCallButton>

      {isConfirmDialogVisible && (
        <CloseMeetingDialog open={isConfirmDialogVisible} onClose={onClose} container={fullscreenContext.rootElement} />
      )}
    </>
  );
};

export default EndCallButton;
