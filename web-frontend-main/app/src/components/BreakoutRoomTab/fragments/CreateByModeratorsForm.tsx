// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Grid, styled, Switch as MuiSwitch } from '@mui/material';
import { formikDurationFieldProps, formikSwitchProps, DurationField } from '@opentalk/common';
import { FormikProps } from 'formik';
import { FormikValues } from 'formik/dist/types';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CommonFormItem from '../../../commonComponents/CommonFormItem';
import TextWithDivider from '../../TextWithDivider';

const GridItem = styled(Grid)({
  display: 'inline-flex',
});

const Switch = styled(MuiSwitch)(({ theme }) => ({
  marginRight: theme.spacing(-1),
}));

interface ICreateByModeratorsFormProps {
  formik: FormikProps<FormikValues>;
  handleNext: () => void;
  formName: string;
}

const CreateByModeratorsForm = ({ formik, handleNext, formName }: ICreateByModeratorsFormProps) => {
  const { t } = useTranslation();

  const getFormName = (name: string) => (formName ? `${formName}.${name}` : name);

  return (
    <Grid container direction={'column'} spacing={1}>
      <GridItem item xs>
        <DurationField {...formikDurationFieldProps(getFormName('duration'), formik, 0)} min={0} />
      </GridItem>
      <GridItem item xs>
        <CommonFormItem
          {...formikSwitchProps(getFormName('distribution'), formik)}
          control={<Switch color="primary" />}
          label={t('breakout-room-form-field-random-distribution')}
          labelPlacement="start"
        />
      </GridItem>
      <GridItem item>
        <TextWithDivider variant={'caption'}>Assign 10-12 participants per room</TextWithDivider>
      </GridItem>
      <Grid item>
        <Button size={'small'} onClick={handleNext}>
          {t('breakout-room-create-button')}
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateByModeratorsForm;
