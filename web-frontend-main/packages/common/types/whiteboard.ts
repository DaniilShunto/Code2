// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

export interface WhiteboardState {
  status: 'initialized' | 'not_initialized';
  url: string;
}
