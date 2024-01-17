// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { InviteCode } from '@opentalk/common';
import { useSearchParams } from 'react-router-dom';

/**
 * Only source of truth for getting invite code inside components
 */
export const useInviteCode = () => {
  const [urlSearchParam] = useSearchParams();
  //Type assertion used since we cannot defined the type of query param directly.
  const inviteCode = (urlSearchParam.get('invite') as InviteCode | null) ?? undefined;

  return inviteCode;
};
