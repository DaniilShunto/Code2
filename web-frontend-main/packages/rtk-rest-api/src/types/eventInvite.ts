// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Opaque } from 'type-fest';

import { Email, InviteStatus, UserId } from './common';
import { User, UserRole } from './user';

export type EventInviteId = Opaque<string, 'eventInviteId'>;

/**
 * New event invite object
 *
 * RequestBody for POST /events/{event_id}/invites
 */
type CreateEventInviteEmailPayload = {
  email: Email;
};

type CreateEventInviteInviteePayload = {
  invitee: UserId;
  role: UserRole;
};

export type CreateEventInvitePayload = CreateEventInviteInviteePayload | CreateEventInviteEmailPayload;

export type UpdateEventInvitePayload = {
  role: UserRole;
};

/**
 * Event invite object
 *
 */
export interface EventInvite {
  profile: User;
  status: InviteStatus;
}
