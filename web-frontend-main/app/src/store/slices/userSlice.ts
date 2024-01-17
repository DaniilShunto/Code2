// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  GroupId,
  ParticipantId,
  ParticipationKind,
  Timestamp,
  Participant,
  ProtocolAccess,
  WaitingState,
  joinSuccess,
} from '@opentalk/common';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import i18next from 'i18next';

import { RootState } from '../';
import { Role } from '../../api/types/incoming/control';
import { sendChatMessage } from '../../api/types/outgoing/chat';
import { lowerHand, raiseHand } from '../../api/types/outgoing/control';
import { initSentryReportWithUser } from '../../utils/glitchtipUtils';
import { login, startRoom } from '../commonActions';
import { setAudioEnable, setFocusedSpeaker, setScreenShare, setVideoEnable } from './mediaSlice';
import { setProtocolReadUrl, setProtocolWriteUrl } from './protocolSlice';
import { connectionClosed, fetchRoomByInviteId } from './roomSlice';

interface UserState {
  uuid: ParticipantId | null;
  groups: GroupId[];
  role: Role;
  displayName: string;
  avatarUrl?: string;
  loggedIdToken?: string;
  lastActive?: string;
  joinedAt?: string;
  isPresenter: boolean;
  protocolAccess: ProtocolAccess;
}

const initialState: UserState = {
  uuid: null,
  groups: [],
  displayName: '',
  role: Role.User,
  isPresenter: false,
  protocolAccess: 'none' as ProtocolAccess.None, // this will be fixed with the next version of the ts-jest
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    displayNameSet: (state, action: PayloadAction<string>) => {
      state.displayName = action.payload;
    },
    updateRole: (state, { payload: role }: PayloadAction<Role>) => {
      state.role = role;
    },
    setPresenterRole: (state) => {
      state.isPresenter = true;
    },
    revokePresenterRole: (state) => {
      state.isPresenter = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRoomByInviteId.fulfilled, (state) => {
      state.role = Role.Guest;
    });
    builder.addCase(login.fulfilled, (state, { meta }) => {
      state.loggedIdToken = meta.arg;
    });
    builder.addCase(login.rejected, (state) => {
      state.loggedIdToken = undefined;
    });
    builder.addCase(
      startRoom.pending,
      (
        state,
        {
          meta: {
            arg: { displayName },
          },
        }
      ) => {
        state.displayName = displayName;
        if (state.role === Role.Guest) {
          initSentryReportWithUser({ name: state.displayName, lang: i18next.language });
        }
      }
    );
    builder.addCase(joinSuccess, (state, { payload: { isPresenter, avatarUrl, role, participantId, groups } }) => {
      state.role = role;
      state.avatarUrl = avatarUrl;
      state.uuid = participantId;
      state.groups = groups;
      state.joinedAt = new Date().toISOString();
      state.lastActive = state.joinedAt;
      state.isPresenter = isPresenter || false;
    });
    builder.addCase(connectionClosed, (state) => {
      state.uuid = null;
      state.joinedAt = undefined;
    });

    builder.addCase(
      setFocusedSpeaker,
      (state, { payload: { id, timestamp } }: PayloadAction<{ id: ParticipantId; timestamp?: Timestamp }>) => {
        if (id === state.uuid) {
          state.lastActive = timestamp;
        }
      }
    );
    builder.addCase(raiseHand.action, (state) => {
      state.lastActive = new Date().toISOString();
    });
    builder.addCase(lowerHand.action, (state) => {
      state.lastActive = new Date().toISOString();
    });
    builder.addCase(setAudioEnable, (state) => {
      state.lastActive = new Date().toISOString();
    });
    builder.addCase(setVideoEnable, (state) => {
      state.lastActive = new Date().toISOString();
    });
    builder.addCase(setScreenShare, (state) => {
      state.lastActive = new Date().toISOString();
    });
    builder.addCase(sendChatMessage.action, (state) => {
      state.lastActive = new Date().toISOString();
    });
    builder.addCase(setProtocolReadUrl, (state) => {
      state.protocolAccess = ProtocolAccess.Read;
    });
    builder.addCase(setProtocolWriteUrl, (state) => {
      state.protocolAccess = ProtocolAccess.Write;
    });
  },
});

export const actions = userSlice.actions;
export const { updateRole, setPresenterRole, revokePresenterRole } = actions;

const userState = (state: RootState) => state.user;

export const selectOurUuid = createSelector(userState, (state) => state.uuid);
export const selectGroups = createSelector(userState, (state) => state.groups);
export const selectDisplayName = createSelector(userState, (state) => state.displayName);
export const selectAvatarUrl = createSelector(userState, (state) => state.avatarUrl);
export const selectIsPresenter = createSelector(userState, (state) => state.isPresenter);
export const selectUserProtocolAccess = createSelector(userState, (state) => state.protocolAccess);
export const selectIsModerator = createSelector(userState, (state) => state.role === Role.Moderator);
export const selectIsGuest = createSelector(userState, (state) => state.role === Role.Guest);

export const selectUserAsPartialParticipant = createSelector(
  userState,
  (state): Omit<Participant, 'breakoutRoomId' | 'handIsUp' | 'handUpdatedAt'> | undefined => {
    const { displayName, avatarUrl, groups, joinedAt, lastActive } = state;

    if (state.uuid === null || joinedAt === undefined || lastActive === undefined) {
      return undefined;
    }

    const participationKind =
      state.role === Role.User || state.role === Role.Moderator ? ParticipationKind.User : ParticipationKind.Guest;

    return {
      id: state.uuid,
      displayName,
      avatarUrl,
      groups,
      joinedAt,
      lastActive,
      leftAt: null,
      participationKind,
      waitingState: WaitingState.Joined,
      protocolAccess: state.protocolAccess,
      isPresenter: state.isPresenter,
    };
  }
);

export default userSlice.reducer;
