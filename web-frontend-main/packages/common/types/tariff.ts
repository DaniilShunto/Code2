// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Opaque } from 'type-fest';

export enum BackendModules {
  Breakout = 'breakout',
  JoinWithoutMedia = 'media',
  Chat = 'chat',
  Timer = 'timer',
  Polls = 'polls',
  Moderation = 'moderation',
  Whiteboard = 'whiteboard',
  Protocol = 'protocol',
  LegalVote = 'legal_vote',
  Automod = 'automod',
  Recording = 'recording'
}

export type TariffId = Opaque<string, 'tariffId'>;

export interface Tariff {
  id: TariffId,
  name: string,
  quotas: Record<string, number>,
  enabledModules: Array<BackendModules>
}