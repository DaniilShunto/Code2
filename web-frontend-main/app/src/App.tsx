// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ThemeProvider, CssBaseline } from '@mui/material';
import { notificationAction } from '@opentalk/common';
import { differenceInMonths } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import Provider from './Provider';
import Routes from './Routes';
import { createOpenTalkTheme } from './assets/themes/opentalk';
import ConfirmBrowserDialog, { isBrowserConfirmed } from './components/ConfirmBrowserDialog/ConfirmBrowserDialog';
import { localStorageItems } from './config/storage';
import AppErrorBoundary from './errorBoundaries/AppErrorBoundary';
import browser from './modules/BrowserSupport';
import ErrorConfigPage from './pages/ErrorConfigPage';
import store from './store';
import { checkConfigError } from './utils/configUtils';

const App = () => {
  const signature = browser.getBrowserSignature();
  const [isConfirmed, setBrowserConfirmed] = useState(isBrowserConfirmed());
  const hasConfigError = checkConfigError();
  const { t } = useTranslation();

  if (hasConfigError) return <ErrorConfigPage />;

  const handleClick = useCallback(() => {
    localStorage.setItem(localStorageItems.browserConfirmed, signature);
    setBrowserConfirmed(true);
  }, []);

  useEffect(() => {
    const isSafari = browser.isSafari();
    if (isSafari) {
      const safariNotificationLastSeenTimestamp = localStorage.getItem(localStorageItems.safariNotificationKey);
      const now = new Date();
      const lastSeenDate = safariNotificationLastSeenTimestamp
        ? new Date(safariNotificationLastSeenTimestamp)
        : undefined;
      const showNotification = !lastSeenDate || differenceInMonths(now, lastSeenDate) > 0;
      if (showNotification) {
        notificationAction({
          msg: t('safari-warning-notification'),
          variant: 'warning',
          cancelBtnText: t('global-ok'),
          persist: true,
          key: localStorageItems.safariNotificationKey,
          onCancel: () => localStorage.setItem(localStorageItems.safariNotificationKey, now.toISOString()),
        });
      }
    }
  }, [t]);

  if (!isConfirmed) {
    return (
      <ThemeProvider theme={createOpenTalkTheme()}>
        <CssBaseline />
        <ConfirmBrowserDialog handleClick={handleClick} />
      </ThemeProvider>
    );
  }

  return (
    <Router basename={new URL(window.config.baseUrl).pathname}>
      <StoreProvider store={store}>
        <AppErrorBoundary>
          <Provider>
            <Routes />
          </Provider>
        </AppErrorBoundary>
      </StoreProvider>
    </Router>
  );
};

export default App;
