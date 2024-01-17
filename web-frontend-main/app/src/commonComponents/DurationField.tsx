// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Box,
  Button,
  ButtonProps,
  Chip as MuiChip,
  FormHelperText,
  InputLabel,
  Popover,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { ClockIcon } from '@opentalk/common';
import { isNumber } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MenuTitle } from '../components/Toolbar/fragments/ToolbarMenuUtils';
import { IFormikCustomFieldPropsReturnDurationValue } from '../utils/formikUtils';
import TextField from './TextField';

interface IDurationFieldProps extends IFormikCustomFieldPropsReturnDurationValue {
  name: string;
  //Proposed TODO: change string option to 'custom', since that is the only one used and adapt the whole component to those type constraints.
  //For unlimited duration either go with 0 to have it only as number or keep it as null, but apply everywhere.
  durationOptions?: Array<number | string | null>;
  ButtonProps?: ButtonProps;
}

const DURATION_OPTIONS: Array<number | string | null> = [null, 5, 10, 15, 30, 'custom'];

const NumberInput = styled(TextField)({
  maxWidth: '4rem',
  '& input': {
    paddingRight: 0,
    textAlign: 'center',
  },
});

const Chip = styled(MuiChip)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  '& .MuiChip-label': {
    padding: theme.spacing(0.5, 1),
  },
}));

const StyledClockIcon = styled(ClockIcon)({
  width: '1rem',
  fill: 'currentColor',
  marginRight: '1ex',
});

const Container = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: '17.875rem',
}));

const DurationField = ({
  name,
  value,
  setFieldValue,
  durationOptions = DURATION_OPTIONS,
  ButtonProps,
  error,
  helperText,
}: IDurationFieldProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [showCustomDurationField, setShowCustomDurationField] = React.useState<boolean>(
    typeof value === 'number' && !durationOptions.includes(value)
  );
  const [customDurationFieldValue, setCustomDurationFieldValue] = React.useState<number>(
    value !== null && value && durationOptions.includes(value) ? (value as number) : 1
  );
  const [selectedChip, setSelectedChip] = useState<number | string | null>(isNumber(value) ? value : null);
  const { t } = useTranslation();

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };
  const renderButtonText = () => (value ? `${value} min` : t('field-duration-unlimited-time'));

  const onChipSelected = (duration: number) => {
    setSelectedChip(duration <= 0 ? null : duration);
    setShowCustomDurationField(false);
  };

  const renderDurationOptions = () => (
    <Stack spacing={1} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'space-between'} alignItems={'baseline'}>
      {durationOptions.map((duration, index) =>
        duration === 'custom' ? (
          <Chip
            label={t('field-duration-custom')}
            onClick={() => setShowCustomDurationField(true)}
            variant={showCustomDurationField ? 'filled' : 'outlined'}
            key={index}
          />
        ) : (
          <Chip
            label={duration ? `${duration} min` : t('field-duration-unlimited-time')}
            onClick={() => onChipSelected(duration as number)}
            variant={
              (selectedChip === duration || (duration === 0 && selectedChip === null)) && !showCustomDurationField
                ? 'filled'
                : 'outlined'
            }
            key={index}
          />
        )
      )}
    </Stack>
  );

  const handleSave = (event: React.MouseEvent<HTMLElement>) => {
    handlePopoverClose(event);
    if (showCustomDurationField) {
      setFieldValue(name, customDurationFieldValue);
    } else {
      setFieldValue(name, selectedChip);
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    handlePopoverClose(event);
    setTimeout(() => {
      setSelectedChip(isNumber(value) ? value : null);
    }, 100);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <Button variant={'text'} onClick={handlePopoverOpen} {...ButtonProps}>
        <StyledClockIcon />
        {renderButtonText()}
      </Button>
      <Popover
        open={open}
        onClose={handlePopoverClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 118,
          horizontal: 'left',
        }}
      >
        <Container>
          <Stack spacing={1}>
            <MenuTitle>{t('field-duration-button-text')}</MenuTitle>
            {renderDurationOptions()}
            {showCustomDurationField && (
              <InputLabel>
                <Stack spacing={1}>
                  <NumberInput
                    type={'number'}
                    inputProps={{ min: 1 }}
                    onChange={(e) => setCustomDurationFieldValue(parseInt(e.target.value))}
                    value={customDurationFieldValue}
                  />
                </Stack>
                <Typography variant="caption">{t('field-duration-input-label')}</Typography>
              </InputLabel>
            )}
          </Stack>
          <Stack flexDirection={'row'} justifyContent={'space-between'} mt={2}>
            <Button variant={'text'} size={'small'} onClick={handleClose}>
              {t('field-duration-button-close')}
            </Button>
            <Button size={'small'} onClick={handleSave}>
              {t('field-duration-button-save')}
            </Button>
          </Stack>
        </Container>
      </Popover>
      {error && <FormHelperText error>{helperText}</FormHelperText>}
    </Box>
  );
};

export default DurationField;
