// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Stack, styled, Switch } from '@mui/material';
import { formikDurationFieldProps, formikProps, formikSwitchProps, DurationField } from '@opentalk/common';
import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CommonFormItem from '../../../commonComponents/CommonFormItem';
import TextField from '../../../commonComponents/TextField';
import { useAppSelector } from '../../../hooks';
import { selectParticipantsTotal } from '../../../store/slices/participantsSlice';
import TextWithDivider from '../../TextWithDivider';

const NumberInput = styled(TextField)(({ theme }) => ({
  maxWidth: '4rem',
  '& input': {
    paddingRight: theme.spacing(0),
    textAlign: 'center',
  },
}));

const CreateButton = styled(Button)({
  alignSelf: 'flex-start',
});

const DurationFieldAligned = styled(DurationField)({
  alignSelf: 'flex-start',
});

interface ICreateByRoomsFormProps {
  handleNext: () => void;
  formName?: string;
}

const CreateByRoomsForm = ({ handleNext, formName }: ICreateByRoomsFormProps) => {
  const { t } = useTranslation();
  const { ...formik } = useFormikContext();
  const participantsTotal = useAppSelector(selectParticipantsTotal);
  const getFormName = (name: string) => (formName ? `${formName}.${name}` : name);

  const rooms = get(formik.values, getFormName('rooms'));
  const participantsPerRoom = Math.max(2, Math.floor(participantsTotal / rooms + 0.5));
  const maxRooms = Math.max(2, Math.floor(participantsTotal / 2));

  return (
    <Stack spacing={2} direction="column" justifyContent="flex-start">
      <DurationFieldAligned
        {...formikDurationFieldProps(getFormName('duration'), formik, 0)}
        ButtonProps={{
          size: 'small',
        }}
        min={0}
      />
      <CommonFormItem
        {...formikProps(getFormName('rooms'), formik)}
        label={t('breakout-room-form-field-rooms')}
        labelPlacement="start"
        control={<NumberInput type={'number'} inputProps={{ min: 2, max: maxRooms }} />}
      />
      <CommonFormItem
        {...formikSwitchProps(getFormName('distribution'), formik)}
        control={<Switch color="primary" />}
        label={t('breakout-room-form-field-random-distribution')}
        labelPlacement="start"
      />
      <CommonFormItem
        {...formikSwitchProps(getFormName('includeModerators'), formik)}
        control={<Switch color="primary" />}
        label={t('breakout-room-form-field-include-moderators')}
        labelPlacement="start"
      />
      <TextWithDivider variant={'caption'}>
        {t('breakout-room-assignable-participants-per-rooms', {
          participantsPerRoom: `${participantsPerRoom}-${participantsPerRoom + 1}`,
        })}
      </TextWithDivider>
      <CreateButton size={'small'} onClick={handleNext}>
        {t('breakout-room-create-button')}
      </CreateButton>
    </Stack>
  );
};

export default CreateByRoomsForm;
