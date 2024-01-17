// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import { Step, useFormikWizard } from 'formik-wizard-form';
import { FormikHelpers, FormikValues } from 'formik/dist/types';
import React from 'react';

import Controls from './fragments/Controls';

interface IWizardFormProps<Values> {
  initialValues: Values;
  steps: Step[];
  onSubmit: (values: FormikValues, formikHelpers: FormikHelpers<FormikValues>) => void | Promise<never>;
}

const Form = styled('form')({
  flex: 1,
});

function WizardForm<Values extends FormikValues>({ steps, onSubmit, initialValues }: IWizardFormProps<Values>) {
  const { renderComponent, handlePrev, handleNext, currentStepIndex } = useFormikWizard({
    initialValues,
    onSubmit,
    steps,
    validateOnNext: true,
    validateOnBlur: false,
    validateOnChange: false,
    activeStepIndex: 0,
  });

  return (
    <Form>
      {renderComponent()}
      <Controls
        currentStepIndex={currentStepIndex}
        handlePrev={handlePrev}
        handleNext={handleNext}
        stepCount={steps.length}
      />
    </Form>
  );
}

export default WizardForm;
