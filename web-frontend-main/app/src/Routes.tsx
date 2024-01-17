// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

import SuspenseLoading from './commonComponents/SuspenseLoading';
import BetaBadge from './components/BetaBadge';
import routeArray from './config/routes';
import { useAppSelector } from './hooks';
import { selectIsBetaRelease, selectOidcConfig } from './store/slices/configSlice';

const Routes = () => {
  const oidcConfig = useAppSelector(selectOidcConfig);
  const isBetaRelease = useAppSelector(selectIsBetaRelease);
  const routes = useRoutes(routeArray(oidcConfig.redirectPath, oidcConfig.popupRedirectPath));

  return (
    <Suspense fallback={<SuspenseLoading />}>
      {isBetaRelease && <BetaBadge />}
      {routes}
    </Suspense>
  );
};

export default Routes;
