// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Email, User } from '@opentalk/rest-api-rtk-query';

export type EmailUser = {
  email: Email;
};

export type ParticipantOption = EmailUser | User;
