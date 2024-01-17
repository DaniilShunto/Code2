// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Theme, useMediaQuery } from '@mui/material';
import { DateTimePicker as MuiDateTimePicker, PickersActionBarAction, PickersLocaleText } from '@mui/x-date-pickers';
import { isSameDay } from 'date-fns';
import { isEmpty } from 'lodash';

import PickerLocalizationProvider from '../../provider/PickerLocalizationProvider';
import { IFormikCustomFieldPropsReturnValue } from '../../utils/formikUtils';

type DateTimePickerProps = {
  value: string | number;
  ampm?: boolean;
  minTimeDate?: Date;
  clearable?: boolean;
  clearButtonLabel?: string;
  okButtonLabel?: string;
  cancelButtonLabel?: string;
  placeholder?: string;
} & Pick<IFormikCustomFieldPropsReturnValue, 'onChange' | 'helperText' | 'error'>;

const DateTimePicker = ({
  value,
  onChange,
  helperText,
  minTimeDate = new Date(),
  clearable = false,
  clearButtonLabel = 'Clear',
  okButtonLabel = 'OK',
  cancelButtonLabel = 'Cancel',
  ampm = false,
  placeholder,
  error,
}: DateTimePickerProps) => {
  const isScreenHeightTooSmall = useMediaQuery((theme: Theme) => {
    const query = theme.breakpoints.up('sm') + ' and (max-height:900px)';
    return query;
  });

  // There are cases, when the screen height is too small to fit the popper of the desktop variant
  // Therefore we need an offset for the popper relativ to it's anchor
  const getOffsetModifier = () => {
    let skidding = 0;
    let distance = 0;
    if (isScreenHeightTooSmall) {
      skidding = 50;
      distance = -200;
    }
    return { name: 'offset', options: { offset: [skidding, distance] } };
  };

  // Clearable date pickers can have a null value
  // For not clearable date pickers we set empty values to the current date
  let actualValue;
  if (clearable) {
    actualValue = isEmpty(value) ? null : new Date(value);
  } else {
    actualValue = isEmpty(value) ? new Date() : new Date(value);
  }

  let minTime;
  if (actualValue && isSameDay(actualValue, minTimeDate)) {
    minTime = minTimeDate;
  } else {
    minTime = undefined;
  }

  const actions: PickersActionBarAction[] = clearable ? ['clear', 'accept', 'cancel'] : ['accept', 'cancel'];

  const actionButtonLabels: Pick<
    PickersLocaleText<Date>,
    'okButtonLabel' | 'cancelButtonLabel' | 'clearButtonLabel'
  > = {
    okButtonLabel,
    cancelButtonLabel,
    clearButtonLabel,
  };

  return (
    // This provider is needed to customize and translate action button labels
    // Another option would be to introduce custom action components, which will make more work at the moment
    <PickerLocalizationProvider localeText={actionButtonLabels}>
      <MuiDateTimePicker
        value={actualValue}
        onChange={onChange}
        ampm={ampm}
        minDate={minTimeDate}
        minTime={minTime}
        slotProps={{
          textField: { helperText, placeholder, error },
          actionBar: { actions },
          popper: { placement: 'bottom-start', modifiers: [getOffsetModifier()] },
        }}
      />
    </PickerLocalizationProvider>
  );
};

export default DateTimePicker;
