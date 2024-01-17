// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Stack, styled, Switch, Typography } from '@mui/material';
import {
  formikDurationFieldProps,
  formikProps,
  formikSwitchProps,
  DurationField,
  TimerKind,
  TimerStyle,
} from '@opentalk/common';
import { DurationValueOptions } from '@opentalk/common';
import { FormikValues, useFormik } from 'formik';
import { useCallback, useMemo } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { startTimer } from '../../../api/types/outgoing/timer';
import { TextField } from '../../../commonComponents';
import CommonFormItem from '../../../commonComponents/CommonFormItem';
import { useAppDispatch } from '../../../hooks';

const Container = styled(Stack)({
  display: 'flex',
  flex: 1,
  justifyContent: 'space-between',
});

const SubmitButton = styled(Button)({
  '&.MuiButton-root': {
    flexGrow: 0,
  },
});

interface Texts {
  header: string;
  button: string;
}

interface TimerState {
  texts: Texts;
  durationOptions: Array<DurationValueOptions>;
  defaultValue: number;
  min: number;
}

const getTimerState = (timerStyle: TimerStyle, t: TFunction<'translation', undefined>): TimerState => {
  if (timerStyle === TimerStyle.CoffeeBreak) {
    return {
      texts: {
        header: t('coffee-break-tab-title'),
        button: t('coffee-break-form-button-submit'),
      },
      durationOptions: [5, 10, 15, 30, 'custom'],
      defaultValue: 5,
      min: 1,
    };
  } else {
    return {
      texts: {
        header: t('timer-tab-title'),
        button: t('timer-form-button-submit'),
      },
      durationOptions: [null, 1, 2, 5, 'custom'],
      defaultValue: 1,
      min: 1,
    };
  }
};

const CreateTimerForm = ({ timerStyle }: { timerStyle: TimerStyle }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { texts, durationOptions, defaultValue, min } = useMemo(() => getTimerState(timerStyle, t), [timerStyle, t]);

  const getTimerForStart = useCallback(
    (values: FormikValues) => {
      return {
        kind: !values.duration ? TimerKind.Stopwatch : TimerKind.Countdown,
        style: timerStyle,
      };
    },
    [timerStyle]
  );

  const validationSchema = yup.object({
    duration: yup.number().nullable(true),
  });

  const formik = useFormik({
    initialValues: { duration: defaultValue, title: undefined, enableReadyCheck: true },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values: FormikValues) => {
      dispatch(
        startTimer.action({
          title: values.title,
          enableReadyCheck: values.enableReadyCheck,
          duration: values.duration ? values.duration * 60 : values.duration,
          ...getTimerForStart(values),
        })
      );
    },
  });

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  return (
    <Container>
      <Stack spacing={2} mb={2}>
        <Typography>{t('global-duration')}</Typography>
        <DurationField
          {...formikDurationFieldProps('duration', formik, defaultValue)}
          durationOptions={durationOptions}
          ButtonProps={{
            size: 'small',
          }}
          min={min}
          allowEmpty={timerStyle === TimerStyle.CoffeeBreak}
        />

        {timerStyle === TimerStyle.Normal && (
          <>
            <TextField {...formikProps('title', formik)} placeholder={t('global-title')} fullWidth />
            <Stack spacing={1}>
              <CommonFormItem
                {...formikSwitchProps('enableReadyCheck', formik)}
                control={<Switch color="primary" />}
                label={t('timer-form-ready-to-continue')}
                labelPlacement="start"
              />
            </Stack>
          </>
        )}
      </Stack>

      <SubmitButton onClick={handleSubmit}>{texts.button}</SubmitButton>
    </Container>
  );
};

export default CreateTimerForm;
