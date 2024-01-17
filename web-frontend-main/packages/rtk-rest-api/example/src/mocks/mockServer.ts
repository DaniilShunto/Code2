// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { setupServer } from 'msw/node';

import { store } from '../app/store';
import { handlers } from './handlers';

export const mockServer = () => {
  const server = setupServer(...handlers);

  return { server, store };
};
