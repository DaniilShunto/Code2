// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { closeSnackbar, notificationAction } from '@opentalk/common';

import { sendRecordingConsentSignal } from '../api/types/outgoing/recording';
import StartRecordingConsentDialog from '../components/StartRecordingConsentDialog';
import localMediaContext from '../modules/Media/LocalMedia';
import localScreenContext from '../modules/Media/LocalScreen';
import { AppDispatch } from '../store';

export const showConsentNotification = (dispatch: AppDispatch) =>
  new Promise((resolve) => {
    const key = 'recording-consent-dialog';

    const setRecordingConsent = (consent: boolean) => {
      dispatch(sendRecordingConsentSignal.action({ consent }));
      closeSnackbar(key);
      if (!consent) {
        localMediaContext.reconfigure({ audio: false, video: false }).catch((e) => {
          console.error(`failed to switch off camera and mic when consent was denied: ${e}`);
        });
        localScreenContext.release();
      }
      resolve(consent);
    };

    notificationAction({
      key: key,
      persist: true,
      variant: 'warning',
      hideCloseButton: true,
      msg: (
        <StartRecordingConsentDialog
          onAcceptButton={() => setRecordingConsent(true)}
          onDeclineButton={() => setRecordingConsent(false)}
        />
      ),
    });
  });
