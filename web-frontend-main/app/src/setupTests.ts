// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { TariffId } from '@opentalk/common';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { TextEncoder } from 'util';

global.console = {
  ...console,
};

global.TextEncoder = TextEncoder;

window.config = {
  controller: 'localhost:8000',
  insecure: false,
  baseUrl: 'http://localhost:3000',
  helpdeskUrl: '/helpdesk',
  beta: { isBeta: true },
  oidcConfig: {
    clientId: 'Frontend',
    redirectPath: '/auth/callback',
    scope: 'openid profile email',
    popupRedirectPath: '/auth/popup_callback',
    authority: 'http://localhost',
    signOutRedirectUri: '/dashboard',
  },
  changePassword: {
    active: false,
    url: 'DUMMY',
  },
  speedTest: {
    ndtDownloadWorkerJs: '',
    ndtServer: '',
    ndtUploadWorkerJs: '',
  },
  features: {
    userSearch: true,
    muteUsers: true,
    resetHandraises: true,
    addUser: false,
    joinWithoutMedia: false,
    sharedFolder: false,
  },
  videoBackgrounds: [],
  maxVideoBandwidth: 600000,
  libravatarDefaultImage: 'robohash',
  errorReportAddress: 'report@opentalk.eu',
  tariff: {
    id: '' as TariffId,
    name: '',
    quotas: {},
    enabledModules: [],
  },
};

const handlers = [
  rest.get('http://OP/.well-known/openid-configuration', async (req, res, ctx) => {
    return res(
      ctx.json({
        issuer: 'http://localhost/',
        authorization_endpoint: 'http://localhost/auth',
        token_endpoint: 'http://localhost/token',
        revocation_endpoint: 'revoke',
      })
    );
  }),
];

// Start msw node mock server
const server = setupServer(...handlers);

global.beforeAll(() => server.listen());
global.afterEach(() => server.resetHandlers());

const mockLocalMedia = (jest: typeof globalThis.jest) => {
  const getInstance = () => ({
    initializeWebRtcContext: jest.fn(),
    //broken -- see https://github.com/facebook/jest/issues/10894
    reconfigure: () => Promise.resolve(), //jest.fn(() => Promise.resolve()),
    requestPermission: () => Promise.resolve(), //jest.fn().mockResolvedValue(undefined),
    getLevelNode: () => Promise.resolve(undefined), // jest.fn().mockResolvedValue(undefined),
    getSpeechDetectionNode: () => Promise.resolve(undefined),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  });

  return {
    __esModule: true,
    LocalMedia: {
      enumerateDevices: () => Promise.resolve([]), // jest.fn().mockResolvedValue([]),
      getInstance: jest.fn(getInstance),
    },
    default: getInstance(),
  };
};

const mockLocalScreen = (jest: typeof globalThis.jest) => {
  const getInstance = () => ({
    initializeWebRtcContext: jest.fn(),
    requestPermission: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  });

  return {
    __esModule: true,
    LocalScreen: {
      getInstance: jest.fn(getInstance),
    },
    default: getInstance(),
  };
};

jest.mock('./modules/Media/LocalMedia', () => mockLocalMedia(jest));
jest.mock('./modules/Media/LocalScreen', () => mockLocalScreen(jest));
jest.mock('./modules/WebRTC', () => {
  const { idFromDescriptor, descriptorFromId, MediaStreamState } = jest.requireActual('./modules/WebRTC/WebRTC');
  return {
    __esModule: true,
    getMediaStream: () => ({ getTracks: () => [] }),
    requestVideoQuality: () => {
      return;
    },
    idFromDescriptor,
    descriptorFromId,
    MediaStreamState,
  };
});

global.beforeEach(() => {
  Object.defineProperty(global.navigator, 'mediaDevices', {
    writable: true,
    value: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
  });

  // to prevent console warning: unstable_flushDiscreteUpdates
  // https://github.com/testing-library/react-testing-library/issues/470
  Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
    set: () => {
      console.log('setting muted');
    },
  });
});
