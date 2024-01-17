// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Grid } from '@mui/material';
import { EventInvite, InviteStatus, EventId } from '@opentalk/rest-api-rtk-query';
import { sortBy } from 'lodash';

import { useGetEventInvitesQuery } from '../../api/rest';
import { isRegisteredUser } from '../../utils/typeGuardUtils';
import { ParticipantOption } from '../SelectParticipants';
import ParticipantList from './fragments/ParticipantList';

type InvitedParticipantsProps = {
  isUpdatable: boolean;
  selectedUsers?: Array<ParticipantOption>;
  removeSelectedUser?: (invitee: EventInvite) => void;
  eventId: EventId;
};

const inviteeSorter = (user: EventInvite) =>
  isRegisteredUser(user.profile) ? user.profile.displayName.toUpperCase() : user.profile.email.toUpperCase();

const InvitedParticipants = ({
  isUpdatable,
  removeSelectedUser,
  selectedUsers = [],
  eventId,
}: InvitedParticipantsProps) => {
  const { data: invitees = [] } = useGetEventInvitesQuery({ eventId }, { refetchOnMountOrArgChange: true });

  const inviteeMap = invitees.reduce(
    (acc, event) => {
      switch (event.status) {
        case InviteStatus.Pending:
          acc[InviteStatus.Pending].push(event);
          break;
        case InviteStatus.Accepted:
          acc[InviteStatus.Accepted].push(event);
          break;
        case InviteStatus.Declined:
          acc[InviteStatus.Declined].push(event);
          break;
      }
      return acc;
    },
    {
      [InviteStatus.Pending]: [] as Array<EventInvite>,
      [InviteStatus.Accepted]: [] as Array<EventInvite>,
      [InviteStatus.Declined]: [] as Array<EventInvite>,
    }
  );

  const mapSelectUserToEventInvite = () => {
    return selectedUsers.map(selectedUserToInvitee);
  };

  const selectedUserToInvitee = (user: ParticipantOption) => {
    if ('kind' in user) {
      return {
        status: InviteStatus.Added,
        profile: {
          ...user,
        },
      } as EventInvite;
    }

    return {
      status: InviteStatus.Added,
      profile: {
        ...user,
        email: user.email,
      },
    } as EventInvite;
  };

  const mergedEventInvites = sortBy(inviteeMap[InviteStatus.Pending].concat(mapSelectUserToEventInvite()), [
    inviteeSorter,
  ]);

  return (
    <Grid container spacing={2} data-testid="InvitedParticipants">
      <Grid item xs={4}>
        <ParticipantList
          eventId={eventId}
          isUpdatable={isUpdatable}
          key="pending-invitees"
          status={InviteStatus.Pending}
          invitees={mergedEventInvites}
          removeSelectedUser={removeSelectedUser}
        />
      </Grid>
      <Grid item xs={4}>
        <ParticipantList
          eventId={eventId}
          isUpdatable={isUpdatable}
          key="accepted-invitees"
          status={InviteStatus.Accepted}
          invitees={sortBy(inviteeMap[InviteStatus.Accepted], inviteeSorter)}
          removeSelectedUser={removeSelectedUser}
        />
      </Grid>
      <Grid item xs={4}>
        <ParticipantList
          eventId={eventId}
          isUpdatable={false}
          key="declined-invitees"
          status={InviteStatus.Declined}
          invitees={sortBy(inviteeMap[InviteStatus.Declined], inviteeSorter)}
        />
      </Grid>
    </Grid>
  );
};

export default InvitedParticipants;
