// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import 'react-router-dom';

declare module 'react-router-dom' {
  interface RouteObject {
    key?: string;
  }
}
