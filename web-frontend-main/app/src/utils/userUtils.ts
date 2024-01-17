// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { User, UserRole } from '@opentalk/rest-api-rtk-query';

import { isRegisteredUser } from './typeGuardUtils';

export const isModerator = (user: User) => {
  return isRegisteredUser(user) && user.role === UserRole.MODERATOR;
};
