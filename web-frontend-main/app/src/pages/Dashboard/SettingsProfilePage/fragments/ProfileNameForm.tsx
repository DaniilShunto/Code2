// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Grid, Typography } from '@mui/material';
import { notifications } from '@opentalk/common';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { useGetMeQuery, useUpdateMeMutation } from '../../../../api/rest';
import TextField from '../../../../commonComponents/TextField';
import { useAppSelector } from '../../../../hooks';
import { selectDisallowCustomDisplayName } from '../../../../store/slices/configSlice';
import { formikProps } from '../../../../utils/formikUtils';

const ProfileNameForm = () => {
  const { t } = useTranslation();
  const { data } = useGetMeQuery();
  const [updateMe, { isLoading }] = useUpdateMeMutation();
  const disallowCustomDisplayName = useAppSelector(selectDisallowCustomDisplayName);

  const validationSchema = yup.object({
    displayName: yup.string().trim().required(t('dashboard-settings-profile-input-required')),
  });

  const formik = useFormik({
    initialValues: {
      displayName: data?.displayName,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      updateMe(values)
        .unwrap()
        .then(() => {
          notifications.success(t('dashboard-settings-general-notification-save-success'));
        })
        .catch(() => {
          notifications.error(t('dashboard-settings-general-notification-save-error'));
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3} direction={'column'}>
        <Grid item>
          <Typography variant={'h1'} component={'h2'}>
            {t('dashboard-settings-profile-name')}
          </Typography>
        </Grid>
        <Grid item container spacing={1} direction={'column'}>
          <Grid item>
            <TextField disabled={disallowCustomDisplayName} {...formikProps('displayName', formik)} fullWidth />
          </Grid>
          <Grid item>
            <Typography variant={'caption'}>{t('dashboard-settings-profile-input-hint')}</Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Button type={'submit'} disabled={isLoading || disallowCustomDisplayName}>
            {t('dashboard-settings-profile-button-save')}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProfileNameForm;
