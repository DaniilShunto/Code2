// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

export interface SharedFolderData {
  read: {
    url: string;
    password: string;
  };
  readWrite?: {
    url: string;
    password: string;
  };
}