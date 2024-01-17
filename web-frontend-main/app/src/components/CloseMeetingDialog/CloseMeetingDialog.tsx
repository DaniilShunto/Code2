// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { CloseIcon } from '@opentalk/common';
import { notifications } from '@opentalk/common';
import { RoomId } from '@opentalk/rest-api-rtk-query';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { useAppDispatch } from '../../hooks';
import { useFullscreenContext } from '../../hooks/useFullscreenContext';
import { hangUp } from '../../store/commonActions';
import { deleteRoomMetaData } from '../../store/slices/internalSlice';

export interface CloseMeetingDialogProps {
  open: boolean;
  onClose: () => void;
  container: HTMLElement | null;
}

export const CloseMeetingDialog = ({ open, onClose }: CloseMeetingDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { roomId } = useParams<'roomId'>() as {
    roomId: RoomId;
  };

  const [disableLeaveAndDeleteButton, setDisableLeaveAndDeleteButton] = useState(true);

  const checkboxHandling = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setDisableLeaveAndDeleteButton(!event.target.checked);
  }, []);

  const hangUpHandler = useCallback(() => dispatch(hangUp()), [dispatch]);

  const leaveAndDeleteAllData = useCallback(async () => {
    try {
      await dispatch(deleteRoomMetaData(roomId));
      hangUpHandler();
      navigate('/dashboard');
    } catch (e) {
      console.error('error on delete room meta data: %s', JSON.stringify(e));
      notifications.error(t('meeting-delete-metadata-submit-error'));
    }
  }, [t, navigate, hangUpHandler, dispatch, roomId]);

  const fullscreenHandler = useFullscreenContext();

  useEffect(() => {
    fullscreenHandler.setHasActiveOverlay(true);

    return () => {
      fullscreenHandler.setHasActiveOverlay(false);
    };
  }, []);

  return (
    <Dialog open={open} maxWidth="sm" fullWidth container={fullscreenHandler.rootElement}>
      <DialogTitle sx={{ textAlign: 'left' }}>{t('meeting-delete-metadata-dialog-title')}</DialogTitle>

      <Box position="absolute" top={0} right={0}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent>
        <Typography>{t(`meeting-delete-metadata-dialog-message`)}</Typography>

        <Grid mt={1}>
          <FormControlLabel
            key="checkbox-confirm"
            control={
              <Checkbox
                checked={!disableLeaveAndDeleteButton}
                id="checkbox-confirm"
                data-testid="checkbox-confirm"
                onChange={checkboxHandling}
              />
            }
            label={t(`meeting-delete-metadata-dialog-checkbox`)}
            labelPlacement={'end'}
          />
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={leaveAndDeleteAllData}
          color="secondary"
          variant="contained"
          disabled={disableLeaveAndDeleteButton}
        >
          {t('meeting-delete-metadata-button-leave-and-delete')}
        </Button>
        <Button onClick={hangUpHandler} color="primary" variant="contained">
          {t('meeting-delete-metadata-button-leave-without-delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CloseMeetingDialog;
