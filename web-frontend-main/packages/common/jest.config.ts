// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import path from 'path';

module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '@mui/styled-engine': path.resolve(__dirname, '../../app/node_modules/@mui/styled-engine'),
    '^.+\\.svg$': 'jest-svg-transformer',
  },
  setupFilesAfterEnv: ['./setupTests.ts'],
};
