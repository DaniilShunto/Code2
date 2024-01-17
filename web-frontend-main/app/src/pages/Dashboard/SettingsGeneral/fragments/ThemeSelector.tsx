// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Grid, Typography, FormControlLabel, Radio } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { useGetMeQuery, useUpdateMeMutation } from '../../../../api/rest';
import { ReactComponent as ThemeBrightModeIcon } from '../../../../assets/images/theme-bright-mode.svg';
import { ReactComponent as ThemeDarkModeIcon } from '../../../../assets/images/theme-dark-mode.svg';
import { ReactComponent as ThemeSystemModeIcon } from '../../../../assets/images/theme-system-mode.svg';
import RadioGroup from '../../../../commonComponents/RadioGroup/RadioGroup';
import { dashboardTheme } from '../../../../config/dashboardSettings';
import { formikRadioGroupProps } from '../../../../utils/formikUtils';

const ThemeSelector = () => {
  const { t } = useTranslation();
  const { data } = useGetMeQuery();
  const [updateMe] = useUpdateMeMutation();

  const themeSettingsSchema = yup.object({
    dashboardTheme: yup.mixed().oneOf(dashboardTheme).required(),
  });

  const formik = useFormik({
    initialValues: {
      dashboardTheme: data?.dashboardTheme || 'system',
    },
    validationSchema: themeSettingsSchema,
    onSubmit: async ({ dashboardTheme }) => {
      try {
        await updateMe({ dashboardTheme });
      } catch (err) {
        console.error(`theme selector err: ${err}`);
      }
    },
  });

  const renderThemeIcon = (value: string) => {
    switch (value) {
      case 'dark':
        return <ThemeDarkModeIcon />;
      case 'light':
        return <ThemeBrightModeIcon />;
      default:
        return <ThemeSystemModeIcon />;
    }
  };

  return (
    <Grid container item direction={'column'} spacing={3}>
      <Grid item>
        <Typography variant={'h1'} component={'h2'}>
          {t('dashboard-settings-general-appearance')}
        </Typography>
      </Grid>
      <Grid item sx={{ '&&': { pl: 0 } }}>
        <RadioGroup {...formikRadioGroupProps('dashboardTheme', formik)}>
          <Grid container justifyContent={{ lg: 'flex-start', md: 'space-between' }}>
            {dashboardTheme.map((value) => (
              <Grid item key={value}>
                <FormControlLabel
                  control={
                    <Grid item container alignItems={'center'} justifyContent={'flex-start'}>
                      <Radio
                        value={value}
                        size="medium"
                        color="secondary"
                        sx={{ pl: 0 }}
                        onChange={() => formik.handleSubmit()}
                      />
                      <Typography variant="body1">{t(`dashboard-settings-general-theme-${value}`)}</Typography>
                    </Grid>
                  }
                  label={renderThemeIcon(value)}
                  labelPlacement={'top'}
                />
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
      </Grid>
    </Grid>
  );
};

export default ThemeSelector;
