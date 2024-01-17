// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { BackendModules } from '@opentalk/common';
import { LegalVoteProvider, AutomodProvider } from '@opentalk/components';
import React, { ReactNode } from 'react';

import { automod, legalVote } from '../../api/types/outgoing';
import { useAppSelector } from '../../hooks';
import { selectCombinedUserFirstAndParticipantsInConference, selectVotingUsers } from '../../store/selectors';

interface EnterpriseProviderProps {
  children: React.ReactNode | ReactNode[];
  moduleKey: BackendModules | undefined;
}

// we need to provide API functions to enterprise components
// community components don't need the additional providers
const EnterpriseProvider = ({ children, moduleKey }: EnterpriseProviderProps) => {
  const votingUsers = useAppSelector(selectVotingUsers);
  //We want to have the user that will trigger auto moderation features as first in the list
  const configurationParticipants = useAppSelector(selectCombinedUserFirstAndParticipantsInConference);

  switch (moduleKey) {
    case BackendModules.LegalVote:
      return (
        <LegalVoteProvider apiMessages={legalVote.actions} votingUsers={votingUsers}>
          {children}
        </LegalVoteProvider>
      );
    case BackendModules.Automod:
      return (
        <AutomodProvider apiMessages={automod.actions} configurationParticipants={configurationParticipants}>
          {children}
        </AutomodProvider>
      );
    default:
      return <>{children}</>;
  }
};

export default EnterpriseProvider;
