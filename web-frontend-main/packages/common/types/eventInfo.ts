// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { EventId } from '@opentalk/rest-api-rtk-query';

export interface EventInfo {
  title: string;
  id: EventId;
  isAdhoc: boolean;
}
