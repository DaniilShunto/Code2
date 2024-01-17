import { removeTokens } from './utils';

export interface AuthAdapterConfiguration {
  authority: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  baseUrl: string;
  signOutRedirectUri: string;
}

export interface CodeResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
  idToken: string;
  scope: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
  idToken: string;
  scope: string;
}

export interface AuthenticationProviderUrls {
  authorizationEndpoint: string;
  endSessionEndpoint: string;
  revocationEndpoint: string;
  tokenEndpoint: string;
  userInfoEndpoint: string;
}

export class AuthAdapater {
  private _configuration: AuthAdapterConfiguration;

  constructor(configuration: AuthAdapterConfiguration) {
    this._configuration = configuration;
  }

  /**
   * Using the configuration authority creates
   * OIDC endpoints for different usecases
   */
  public getConfigurationEndpoints(): AuthenticationProviderUrls {
    return {
      authorizationEndpoint: `${this._configuration.authority}/protocol/openid-connect/auth`,
      endSessionEndpoint: `${this._configuration.authority}/protocol/openid-connect/logout`,
      revocationEndpoint: `${this._configuration.authority}/protocol/openid-connect/revoke`,
      tokenEndpoint: `${this._configuration.authority}/protocol/openid-connect/token`,
      userInfoEndpoint: `${this._configuration.authority}/protocol/openid-connect/userinfo`,
    };
  }

  public getBaseUrl() {
    return this._configuration.baseUrl;
  }

  public getLoginUrl() {
    return `${this.getConfigurationEndpoints().authorizationEndpoint}?response_type=code&client_id=${
      this._configuration.clientId
    }&redirect_uri=${this._configuration.redirectUri}&scope=${this._configuration.scope}`;
  }

  public getSavedLocation = () => sessionStorage.getItem('saved_location') || undefined;
  public saveLocationForRedirect = (location: string) => sessionStorage.setItem('saved_location', location);

  /**
   * Redirect user to sign in provider
   */
  public startOidcSignIn(redirectUrl = window.location.pathname) {
    this.saveLocationForRedirect(redirectUrl);
    window.location.replace(this.getLoginUrl());
  }

  public getAccessToken = () => localStorage.getItem('access_token');

  public getIdToken = () => localStorage.getItem('id_token');

  public async signOut(signOutUrl?: string): Promise<void> {
    const logoutUrl = new URL(this.getConfigurationEndpoints().endSessionEndpoint);
    logoutUrl.searchParams.append('client_id', this._configuration.clientId);

    const idToken = localStorage.getItem('id_token');
    if (idToken) {
      logoutUrl.searchParams.append('id_token_hint', idToken);
    }
    logoutUrl.searchParams.append(
      'post_logout_redirect_uri',
      signOutUrl ? signOutUrl : this._configuration.signOutRedirectUri
    );
    window.location.replace(logoutUrl);
    removeTokens();
  }
}
