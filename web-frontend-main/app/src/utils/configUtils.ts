// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

export const checkConfigError = () => {
  const config = window.config;

  if (config === undefined) {
    console.error('Missing config');
    return true;
  }

  if (config.insecure === undefined) {
    console.error('Missing insecure flag');
    return true;
  } else if (typeof config.insecure !== 'boolean') {
    console.error('Invalid insecure flag');
    return true;
  }

  if (config.baseUrl === undefined) {
    console.error('Missing base url');
    return true;
  } else {
    try {
      new URL(config.baseUrl);
    } catch (error) {
      console.error(`Invalid base url -`, error);
      return true;
    }
  }

  if (config.controller === undefined) {
    console.error('Missing controller url');
    return true;
  }

  if (config.oidcConfig === undefined) {
    console.error('Missing oidc config');
    return true;
  }

  if (config.oidcConfig.authority === undefined) {
    console.error(`Missing authority url`);
    return true;
  } else {
    try {
      new URL(config.oidcConfig.authority);
    } catch (error) {
      console.error(`Invalid authority url -`, error);
      return true;
    }
  }

  return false;
};
