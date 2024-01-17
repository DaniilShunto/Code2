// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import convertToCamelCase from 'camelcase-keys';

import { ConfigState } from '../../store/slices/configSlice';
import { fetchWithAuth, fetchWithInvite, getControllerBaseUrl } from '../../utils/apiUtils';

/**
 * Retrieves the configured TURN servers from the Rest API.
 * If there are currently valid turn credentials inside the store, we return them.
 */

export type StunCredentials = {
  uris: Array<string>;
};

export interface TurnCredentials extends StunCredentials {
  username: string;
  password: string;
  ttl: number;
}

function isTurnCredentials(credentials: TurnCredentials | StunCredentials): credentials is TurnCredentials {
  return (credentials as TurnCredentials).username !== undefined;
}

export type StunTurnCredentials = Array<TurnCredentials | StunCredentials>;

function turnCredentialsValid(credentials: StunTurnCredentials) {
  const buffer = 20_000; //in ms
  if (credentials.length === 0) {
    return false;
  }
  const now = Date.now();
  return credentials.every((credential) => {
    // no expiry time for STUN
    if (isTurnCredentials(credential)) {
      return credential.ttl * 1000 + buffer > now;
    }
    return true;
  });
}

function getIceConfig(credentials: StunTurnCredentials): RTCIceServer[] {
  return credentials.map((credential) => {
    if (isTurnCredentials(credential)) {
      return { urls: credential.uris, credential: credential.password, username: credential.username };
    } else {
      return { urls: credential.uris };
    }
  });
}

export class TurnProvider {
  private readonly turnUrl: URL;
  private readonly inviteCode?: string;
  private credentials: StunTurnCredentials = [];
  private fetchCredentials?: Promise<void>;

  constructor(config: ConfigState, inviteCode?: string) {
    this.inviteCode = inviteCode;
    this.turnUrl = new URL('v1/turn', getControllerBaseUrl(config));
  }

  private async fetchTurn() {
    const config = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    let response;
    if (this.inviteCode) {
      response = await fetchWithInvite(this.turnUrl, config, this.inviteCode);
    } else {
      response = await fetchWithAuth(this.turnUrl, config);
    }

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      this.credentials = [];
    } else {
      this.credentials = convertToCamelCase(await response.json(), { deep: true }) as StunTurnCredentials;
    }
  }

  public async get(): Promise<RTCIceServer[]> {
    if (this.fetchCredentials) {
      await this.fetchCredentials;
    }

    if (!turnCredentialsValid(this.credentials)) {
      this.fetchCredentials = this.fetchTurn();
      await this.fetchCredentials;
      this.fetchCredentials = undefined;
    }

    return getIceConfig(this.credentials);
  }
}
