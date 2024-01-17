import { jwtDecode } from 'jwt-decode';

import { CodeResponse, RefreshTokenResponse } from './authAdapter';

export enum SessionStatus {
  ANONYMOUS = 'anonymous',
  PENDING = 'pending',
  AUTHORIZED = 'authorized',
}

export function hasActiveSession() {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  const refreshExpiresIn = refreshToken && new Date(getTokenExpirationDate(refreshToken));

  if (!accessToken || !refreshToken || !refreshExpiresIn) {
    return false;
  }
  if (!Number(refreshExpiresIn) || isNaN(Number(refreshExpiresIn))) {
    return false;
  }

  const refreshExpiresInDate = new Date(Number(refreshExpiresIn));
  const currentDate = new Date();
  if (currentDate > refreshExpiresInDate) {
    return false;
  }
  return true;
}

export const getSessionStatus = () => (hasActiveSession() ? SessionStatus.AUTHORIZED : SessionStatus.ANONYMOUS);

export function hasValidToken(token: string | null) {
  if (!token) {
    return false;
  }
  const tokenExpirationTime = getTokenExpirationDate(token);
  const currentDate = new Date();

  const expirationDate = new Date(tokenExpirationTime);
  return currentDate < expirationDate;
}

export const storeToken = (payload: CodeResponse | RefreshTokenResponse) => {
  const { idToken, accessToken, refreshToken } = payload;

  localStorage.setItem('id_token', idToken);
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

export const removeTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('id_token');
};

export enum AuthTypeError {
  SessionExpired = 'error-session-expired',
  OidcConfiguration = 'error-oidc-configuration',
  SystemCurrentlyUnavailable = 'error-system-currently-unavailable',
  RefreshTokenFailed = 'refresh-token-failed',
  CodeCallbackFailed = 'code-callback-failed',
  LoginUserFailed = 'login-user-failed',
}
export interface SerializedError {
  name?: AuthTypeError;
  message?: unknown;
  status?: number;
  stack?: string;
}

export const getTokenExpirationDate = (token: string) => {
  const tokenExpiration = jwtDecode(token).exp as number;
  return tokenExpiration * 1000;
};

export const calculateTokenRenewalTime = (token: string) => {
  const RESPONSE_TIME = 30000; //ms
  const tokenExpirationTime = getTokenExpirationDate(token);
  const currentDate = new Date();

  const timeLeft = tokenExpirationTime - currentDate.getTime();
  const renewalTimeInterval = Math.max(timeLeft - RESPONSE_TIME, 0);

  return renewalTimeInterval;
};

export const generateSerilizadError = (payload: SerializedError) => {
  return {
    name: payload.name || 'unable_to_fetch',
    message: String(payload.message) || 'Failed to fetch',
    status: payload.status || 503,
    stack: payload.stack,
  };
};
