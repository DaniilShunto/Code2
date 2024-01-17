// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SnackbarProvider as DefaultSnackbarProvider } from '@opentalk/common';
import { ReactNode } from 'react';

import { TimeLimitNotification } from '../../components/TimeLimitNotification/TimeLimitNotification';
import { useFullscreenContext } from '../FullscreenProvider';

declare module 'notistack' {
  interface VariantOverrides {
    timeLimit: true;
  }
  interface OptionsObject {
    minutes?: number;
  }
}

const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const fullscreenHandle = useFullscreenContext();

  return (
    <>
      <DefaultSnackbarProvider
        Components={{ timeLimit: TimeLimitNotification }}
        domRoot={fullscreenHandle.rootElement ? fullscreenHandle.rootElement : undefined}
      >
        {children}
      </DefaultSnackbarProvider>
    </>
  );
};

export default SnackbarProvider;
