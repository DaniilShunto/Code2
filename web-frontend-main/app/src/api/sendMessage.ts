// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import type { Action, Namespaced, Namespaces } from '@opentalk/common';

import { getCurrentConferenceRoom } from '../modules/WebRTC';
import type { Message } from './types/outgoing';

export default function sendMessage(message: Namespaced<Action, Namespaces>) {
  const currentConferenceRoom = getCurrentConferenceRoom();
  if (currentConferenceRoom === undefined) {
    throw new Error('can not send message to currentConferenceRoom');
  }
  currentConferenceRoom.sendMessage(message as Message /*TODO remove conversion*/);
}
