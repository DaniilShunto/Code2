// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { CloseIcon, formatDate } from '@opentalk/common';
import { SingleEvent } from '@opentalk/rest-api-rtk-query';
import { truncate } from 'lodash';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

interface EventConflictDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
  event: SingleEvent;
  isUpdate?: boolean;
}

export const EventConflictDialog = ({ onConfirm, onCancel, event, isUpdate }: EventConflictDialogProps) => {
  const { t } = useTranslation();
  const startDate = formatDate(new Date(event.startsAt.datetime)).getDateString();
  const startTime = formatDate(new Date(event.startsAt.datetime)).getTimeString();
  const endTime = formatDate(new Date(event.endsAt.datetime)).getTimeString();

  const eventTitle = truncate(event.title, { length: 20 });
  const eventTime = `${startDate} ${startTime} - ${endTime}`;

  return (
    <Dialog open maxWidth="sm" fullWidth disablePortal>
      <DialogTitle sx={{ textAlign: 'left' }}>{t('dashboard-create-meeting-dialog-title')}</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton onClick={onCancel}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <Trans
          i18nKey={`dashboard-${isUpdate ? 'update' : 'create'}-meeting-dialog-message`}
          values={{ eventTitle, eventTime }}
          components={{
            eventTitle: <Typography variant={'h1'} mb={2} mt={2} />,
            eventTime: <Typography component={'span'} variant={'h6'} />,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color="primary" variant="contained">
          {t(`dashboard-${isUpdate ? 'update' : 'create'}-meeting-dialog-ok`)}
        </Button>
        <Button onClick={onCancel} color="secondary" variant="contained">
          {t('dashboard-create-meeting-dialog-cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventConflictDialog;
