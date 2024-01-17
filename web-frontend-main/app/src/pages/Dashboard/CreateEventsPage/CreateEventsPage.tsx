// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Step, StepLabel, Stepper, styled } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import CreateOrUpdateMeetingForm from '../../../components/CreateOrUpdateMeetingForm';

const Container = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'auto 1fr',
  height: '100%',
  overflow: 'hidden auto',
  gap: theme.spacing(2),
}));

const ActiveStep = styled(Step)(({ theme }) => ({
  //Safari icon, Other browsers icon
  '& .MuiSvgIcon-root.MuiStepIcon-root.Mui-active, & .MuiSvgIcon-root circle': {
    color: theme.palette.secondary.dark,
  },
}));

const CreateEventsPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { t } = useTranslation();

  const StepperHeader = () => (
    <Stepper activeStep={0}>
      <ActiveStep>
        <StepLabel>{t('global-meeting')}</StepLabel>
      </ActiveStep>
      <Step>
        <StepLabel>{t('global-participants')}</StepLabel>
      </Step>
    </Stepper>
  );

  return (
    <Container>
      <StepperHeader />
      {activeStep === 0 && <CreateOrUpdateMeetingForm onForwardButtonClick={() => setActiveStep(1)} />}
    </Container>
  );
};

export default CreateEventsPage;
