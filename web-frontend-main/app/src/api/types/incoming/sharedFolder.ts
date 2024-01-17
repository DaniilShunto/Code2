// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { NamespacedIncoming } from '@opentalk/common';

export interface UpdateSharedFolder {
  message: 'updated';
  read: string;
  readWrite?: string;
}

export type Message = UpdateSharedFolder;

export type SharedFolder = NamespacedIncoming<Message, 'shared_folder'>;

export default SharedFolder;
