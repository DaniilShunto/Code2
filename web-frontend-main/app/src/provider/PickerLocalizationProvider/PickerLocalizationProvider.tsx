// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { LocalizationProvider, LocalizationProviderProps } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Locale } from 'date-fns';
import deLocale from 'date-fns/locale/de';
import enLocale from 'date-fns/locale/en-US';
import { useTranslation } from 'react-i18next';

const localeMap = new Map([
  ['en', enLocale],
  ['de', deLocale],
]);

export interface DateTimeProviderProps extends LocalizationProviderProps<Date, Locale> {
  children: React.ReactNode;
}

const PickerLocalizationProvider = (props: DateTimeProviderProps) => {
  const { i18n } = useTranslation();
  const language = i18n.language.split('-')[0];
  const locale = localeMap.get(language);

  const { children, localeText } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale} localeText={localeText}>
      {children}
    </LocalizationProvider>
  );
};

export default PickerLocalizationProvider;
