// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import * as Sentry from '@sentry/browser';

if (window.config.glitchtip && window.config.glitchtip.dsn) {
  Sentry.init({
    dsn: window.config.glitchtip.dsn,
    enabled: Boolean(window.config.glitchtip.dsn),
    release: window.config.version?.frontend,
    beforeSend: (event) => {
      if (window.showReportDialog) {
        window.showReportDialog(event);
      } else {
        Sentry.showReportDialog(event);
      }
      return event;
    },
  });
}
