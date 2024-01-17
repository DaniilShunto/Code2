// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ParticipantId } from '@opentalk/common';

import { selectParticipants } from '../store/slices/participantsSlice';
import { selectDisplayName, selectOurUuid } from '../store/slices/userSlice';
import { useAppSelector } from './';

export const useDisplayName = () => {
  const participants = useAppSelector(selectParticipants);
  const ourUuid = useAppSelector(selectOurUuid);
  const displayName = useAppSelector(selectDisplayName);
  return {
    resolve: (id: ParticipantId) => {
      if (ourUuid === id) {
        return displayName;
      } else {
        return participants[id]?.displayName;
      }
    },
  };
};
