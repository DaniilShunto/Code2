// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Grid, Typography, MenuItem, Button } from '@mui/material';
import { notifications } from '@opentalk/common';
import { useFormik } from 'formik';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { useGetMeQuery, useUpdateMeMutation } from '../../../../api/rest';
import Select from '../../../../commonComponents/Select/Select';
import { dashboardLanguages } from '../../../../config/dashboardSettings';
import { formikProps } from '../../../../utils/formikUtils';

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const { data } = useGetMeQuery();
  const [updateMe, { isLoading }] = useUpdateMeMutation();
  const getDefaultLanguage = useCallback(() => {
    if (i18n.resolvedLanguage.startsWith('en')) {
      return 'en-US';
    }
    if (i18n.resolvedLanguage.startsWith('de')) {
      return 'de-DE';
    }
    return i18n.resolvedLanguage;
  }, [i18n.resolvedLanguage]);

  const languageSettingsSchema = yup.object({
    language: yup.mixed().oneOf(Object.keys(dashboardLanguages)).required(),
  });

  const formik = useFormik({
    initialValues: {
      language: data?.language || getDefaultLanguage(),
    },
    validationSchema: languageSettingsSchema,
    onSubmit: async ({ language }) => {
      try {
        await updateMe({ language });
        i18n.changeLanguage(language);
        notifications.success(t('dashboard-settings-general-notification-save-success'));
      } catch (err) {
        notifications.error(t('error-general'));
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container item spacing={3}>
        <Grid item xs={12}>
          <Typography variant={'h1'} component={'h2'}>
            {t('dashboard-settings-general-language')}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Select {...formikProps('language', formik)} fullWidth data-testid="languageSelect">
            {Object.entries(dashboardLanguages).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12}>
          <Button type={'submit'} disabled={isLoading}>
            {t('dashboard-settings-profile-button-save')}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default LanguageSelector;
