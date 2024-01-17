// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import DateFnsAdapter from '@date-io/date-fns';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton as MuiIconButton,
  Paper,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { CloseIcon, notifications, formikDateTimePickerProps, FormWrapper } from '@opentalk/common';
import { DateTime, RoomId } from '@opentalk/rest-api-rtk-query';
import { useFormik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { useCreateRoomInviteMutation } from '../../../api/rest';
import { createOpenTalkTheme } from '../../../assets/themes/opentalk';
import { useAppSelector } from '../../../hooks';
import { selectCurrentBreakoutRoomId } from '../../../store/slices/breakoutSlice';
import { selectBaseUrl } from '../../../store/slices/configSlice';
import { selectRoomId } from '../../../store/slices/roomSlice';
import { composeInviteUrl } from '../../../utils/apiUtils';
import DateTimePicker from '../../DateTimePicker';

const theme = createOpenTalkTheme();

const IconButton = styled(MuiIconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
}));

interface DialogTitleProps {
  id: string;
  children: React.ReactNode;
  onClose?: () => void;
}

const InviteDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle {...other}>
      <Typography style={{ color: theme.palette.secondary.dark }}>{children}</Typography>
      {onClose && (
        <IconButton aria-label="close-button" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
};

const InviteGuestDialog = (props: Omit<DialogProps, 'children'>) => {
  const dateFns = new DateFnsAdapter();
  const { t } = useTranslation();
  const baseUrl = useAppSelector(selectBaseUrl);
  const roomId = useAppSelector(selectRoomId);
  const currentBreakoutRoomId = useAppSelector(selectCurrentBreakoutRoomId);
  const [createGuestLink, { data, reset, isSuccess }] = useCreateRoomInviteMutation();
  const inviteUrl =
    isSuccess && data && roomId ? composeInviteUrl(baseUrl, roomId, data.inviteCode, currentBreakoutRoomId) : null;

  const endOfToday = dateFns.endOfDay(new Date());
  const minTimeDate = dateFns.addMinutes(new Date(), 5);

  const validationSchema = yup.object({
    expirationDate: yup.date().nullable().min(minTimeDate, t('dialog-invite-guest-expiration-date-error')),
  });

  const formik = useFormik({
    initialValues: {
      expirationDate: endOfToday,
    },
    validationSchema,
    onSubmit: (values) => submit(values.expirationDate),
  });

  const resetValues = () => {
    reset();
    formik.resetForm();
  };

  const onClose = () => {
    props.onClose && props.onClose({}, 'escapeKeyDown');
    resetValues();
  };

  const submit = async (expirationDate: Date | null) => {
    const id = roomId as unknown;

    createGuestLink({
      id: id as RoomId,
      expiration: expirationDate ? (expirationDate.toISOString() as DateTime) : undefined,
    })
      .unwrap()
      .catch(() => {
        notifications.error(t('global-copy-permanent-guest-link-error'));
      });
  };

  const onChangeExpirationDate = (expirationDate: Date | null) => {
    formik.setFieldValue('expirationDate', expirationDate);
  };

  const copyToClipboard = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl.toString());
      notifications.success(t('global-copy-link-success'));
    } else {
      notifications.error(t('global-copy-permanent-guest-link-error'));
    }
  };

  return (
    <Dialog {...props} fullWidth PaperComponent={Paper} aria-labelledby="dialog-invite-guest-title">
      <InviteDialogTitle id="dialog-invite-guest-title" onClose={onClose}>
        {t('dialog-invite-guest-title')}
      </InviteDialogTitle>
      {inviteUrl ? (
        <Stack>
          <DialogContent>
            <Typography style={{ color: theme.palette.secondary.dark }} gutterBottom>
              {inviteUrl.toString()}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={copyToClipboard} color="primary">
              {t('dialog-invite-guest-button-copy')}
            </Button>
          </DialogActions>
        </Stack>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <FormWrapper label={t('dialog-invite-guest-expiration-date')} stacked fullWidth>
              <DateTimePicker
                {...formikDateTimePickerProps('expirationDate', {
                  ...formik,
                  handleChange: onChangeExpirationDate as never,
                })}
                ampm={false}
                value={formik.values.expirationDate ? formik.values.expirationDate.toString() : ''}
                clearable
                clearButtonLabel={t('dialog-invite-guest-no-expiration')}
                placeholder={t('dialog-invite-guest-no-expiration')}
                minTimeDate={minTimeDate}
              />
            </FormWrapper>
          </DialogContent>
          <DialogActions>
            <Button type={'submit'} color="primary">
              {t('dialog-invite-guest-button-submit')}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
};

export default InviteGuestDialog;
