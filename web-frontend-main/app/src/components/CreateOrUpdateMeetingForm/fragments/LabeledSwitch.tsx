// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { FormControlLabel as MuiFormControlLabel, Stack, Switch, SwitchProps, Typography, styled } from '@mui/material';

interface LabeledSwitchProps {
  titleLabel: string;
  switchProps: SwitchProps;
  checked: boolean;
  switchValueLabel: string;
}

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  margin: 0,
  gap: theme.spacing(1),
  verticalAlign: 'baseline',
  width: 'max-content',
}));

const LabeledSwitch = ({ titleLabel, switchProps, checked, switchValueLabel }: LabeledSwitchProps) => {
  return (
    <Stack>
      <Typography pb={1.3}>{titleLabel}</Typography>
      <FormControlLabel checked={checked} control={<Switch {...switchProps} />} label={switchValueLabel} />
    </Stack>
  );
};

export default LabeledSwitch;
