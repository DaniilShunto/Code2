// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '../../hooks';
import { useAppSelector } from '../../hooks';
import { selectAudioEnabled, selectVideoEnabled } from '../../store/slices/mediaSlice';
import { abortedReconnection } from '../../store/slices/roomSlice';
import { useMediaContext } from '../MediaProvider';

const ReconnectionDialog = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const mediaContext = useMediaContext();
  const audioEnabled = useAppSelector(selectAudioEnabled);
  const videoEnabled = useAppSelector(selectVideoEnabled);

  const disableMedia = async () => {
    if (audioEnabled) {
      await mediaContext.trySetAudio(false);
    }
    if (videoEnabled) {
      await mediaContext.trySetVideo(false);
    }
  };

  const abort = () => {
    disableMedia();
    dispatch(abortedReconnection());
  };

  return (
    <Dialog open fullWidth maxWidth={'xs'}>
      <DialogTitle>{t('reconnection-loop-dialogbox-title')}</DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button fullWidth onClick={abort}>
          {t('reconnection-loop-abort-button')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReconnectionDialog;
