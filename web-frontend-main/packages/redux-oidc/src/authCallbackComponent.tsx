import { ReactNode, useEffect } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAuthContext } from './authProvider';
import { selectIsAuthenticated, selectAuthIsPending } from './store';
import { codeCallback } from './store/authActions';

export interface AuthCallbackContext {
  children?: ReactNode[] | ReactNode;
  redirectUrl?: string;
}
const AuthCallbackComponent = ({ children, redirectUrl = '/' }: AuthCallbackContext) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = useAuthContext();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthPending = useSelector(selectAuthIsPending);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code && auth) {
      const clientId = auth.configuration.clientId;
      const tokenEndpoint = auth.getConfigurationEndpoints().tokenEndpoint;
      const baseUrl = auth?.getBaseUrl();
      /**
       * Once user is back from sing in provider
       * get the code from the auth provider and call codeCallback to get access tokens
       */
      dispatch(codeCallback({ clientId, redirectUri: auth.configuration.redirectUri, tokenEndpoint, baseUrl, code }));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isAuthPending) {
      navigate(auth?.getSavedRedirectUrl() || redirectUrl);
    }
  }, [isAuthenticated, isAuthPending]);

  return <>{children}</>;
};

export default AuthCallbackComponent;
