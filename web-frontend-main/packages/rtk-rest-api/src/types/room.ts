// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { InviteCode, RoomId } from '@opentalk/common';
import { Opaque } from 'type-fest';

import { CallIn, DateTime } from './common';
import { BaseUser } from './user';

export type { RoomId };
export type SipId = Opaque<string, 'sipId'>;
export type AssetId = Opaque<string, 'assetId'>;

// RequestBodies

/**
 * New Room
 *
 * RequestBody of POST /rooms
 */
export type CreateRoomPayload = {
  password?: string;
  enableSip: boolean;
};

/**
 * Modify Room
 *
 * RequestBody of PATCH /rooms/{uuid}
 */
export type UpdateRoomPayload = {
  password?: string;
};

// Response Objects

/**
 * Public information about a room
 *
 * Usually retrieved by calling GET /rooms/{uuid}
 */
export type PublicRoom = {
  id: RoomId;
  createdAt: DateTime;
  createdBy: BaseUser;
};

// TODO(r.floren): Should we put them here into the same interface?
/**
 * Private information about a room
 * Usually retrieved by calling POST /rooms
 */
export type PrivateRoom = PublicRoom & {
  password?: string;
};

/**
 * Payload for creating or updating a SIP-Configuration
 *
 * password: Numeric string with exactly 10 characters to secure room access. Is automatically generated when not set on creation.
 * lobby: Enable/Disable a lobby for users that join through SIP. Defaults to false when not set on creation.
 */
export type UpdateRoomSipConfigPayload = {
  password?: string;
  lobby?: boolean;
};

export type RoomSipConfigResponse = {
  room: RoomId;
  password?: string;
  callIn: CallIn;
  lobby: boolean;
};

/*
 * Types relating to room assets
 * An asset is a file object like document or recording that was created for or during a conference session.
 */

export type RoomAssetNamespace = 'whiteboard';

export interface RoomAsset {
  id: AssetId;
  filename: string;
  createdAt: DateTime;
  namespace: RoomAssetNamespace;
}

export type RoomAssets = Array<RoomAsset>;

export type RoomInvite = {
  inviteCode: InviteCode;
  room: string;
  active: boolean;
  expiration: DateTime | null;
  created: DateTime;
  createdBy: BaseUser;
  updated: DateTime;
  updatedBy: BaseUser;
};

export type RoomInvites = Array<RoomInvite>;

export type CreateRoomInvitePayload = {
  expiration?: DateTime;
};

export type RoomEventInfo = {
  id: RoomId;
  inviteCode?: InviteCode;
};
