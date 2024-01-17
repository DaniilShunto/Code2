// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

import { initialize, mswDecorator } from 'msw-storybook-addon'
import { createOpenTalkTheme } from '../src/assets/themes/opentalk';
import {CssBaseline, ThemeProvider} from '@mui/material';
import {Provider} from "react-redux";
import store from "../src/store";
import {i18n} from './i18next'
import {StylesProvider} from "@mui/styles";
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DateFnsUtils from "@date-io/date-fns";
import enLocale from "date-fns/locale/en-US";
import deLocale from "date-fns/locale/de";
import {LocalizationProvider} from "@mui/lab";
import SuspenseLoading from "../src/commonComponents/SuspenseLoading";
import React, { Suspense } from "react";
import {addDecorator} from '@storybook/react'
import { withA11y} from '@storybook/addon-a11y'

const localeMap = new Map([
  ['en', enLocale],
  ['de', deLocale],
]);

export const parameters = {
  i18n,
  locale: 'de',
  locales: {
    de: 'Deutsch',
    en: 'English',
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  }
}

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'dashboardLight',
    toolbar: {
      icon: 'contrast',
      items: ['dashboardLight', 'dashboardDark'],
      showName: false,
    },
  },
};

addDecorator(withA11y)

export const decorators = [
  mswDecorator,
  (story, { globals }) => {
    let theme
    switch (globals.theme) {
      case 'dashboardLight':
        theme = createOpenTalkTheme('light');
        break;
      case 'dashboardDark':
        theme = createOpenTalkTheme('dark');
        break;
      default:
        theme = createOpenTalkTheme();
    }
    return (
        <Provider store={store}>
          <StylesProvider injectFirst>
            <ThemeProvider theme={theme}>
              <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  utils={DateFnsUtils}
                  locale={localeMap.get(i18n.language)}
              >
                <CssBaseline />
                <Suspense fallback={<SuspenseLoading />}>
                  {story()}
                </Suspense>
              </LocalizationProvider>
            </ThemeProvider>
          </StylesProvider >
        </Provider>
    )
  }
];
initialize()
