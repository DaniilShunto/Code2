// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Locale } from 'date-fns';
import en from 'date-fns/locale/en-US/index.js';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function useLocale() {
  const { i18n } = useTranslation();
  const language = i18n.language.split('-')[0] as string;
  const [locale, setLocale] = useState<Locale | undefined>(undefined);

  const loadLocale = useCallback(async () => {
    if (language === 'en') {
      // Prevent the case of loading known unsuported locale from date-fns.
      return en;
    }

    try {
      const locale = await import(`date-fns/locale/${language}/index.js`).then((module) => module.default);
      return locale;
    } catch {
      return en;
    }
  }, [language]);

  useEffect(() => {
    loadLocale().then((locale) => setLocale(locale));
  }, [loadLocale]);

  return locale;
}
