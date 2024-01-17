// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  GroupId,
  ParticipationKind,
  TargetId,
  Participant,
  ProtocolAccess,
  sortParticipantsWithConfig,
  SortOption,
  ChatMessage as ChatMessageType,
  ChatScope,
  FilterableParticipant,
} from '@opentalk/common';
import { automodStore, legalVoteStore } from '@opentalk/components';
import { createSelector } from '@reduxjs/toolkit';
import i18next, { t } from 'i18next';
import _, { intersection } from 'lodash';
import { some } from 'lodash';

import { ProtocolParticipant } from '../components/ProtocolTab/ProtocolTab';
import { selectCurrentBreakoutRoomId } from './slices/breakoutSlice';
import { selectChatMessagesByScope } from './slices/chatSlice';
import { selectGlobalEvents, RoomEvent } from './slices/eventSlice';
import { selectFocusedSpeaker } from './slices/mediaSlice';
import { selectUnmutedSubscribers } from './slices/mediaSubscriberSlice';
import { selectHandUp, selectHandUpdatedAt } from './slices/moderationSlice';
import {
  selectAllOnlineParticipants,
  selectAllOnlineParticipantsInConference,
  selectAllParticipants,
} from './slices/participantsSlice';
import { selectAllPollVotes } from './slices/pollSlice';
import { selectParticipantsReady } from './slices/timerSlice';
import {
  selectParticipantsSearchValue,
  selectParticipantsSortOption,
  selectPinnedParticipantId,
} from './slices/uiSlice';
import { selectGroups, selectUserAsPartialParticipant } from './slices/userSlice';

export const selectUserAsParticipant = createSelector(
  selectUserAsPartialParticipant,
  selectCurrentBreakoutRoomId,
  selectHandUp,
  selectHandUpdatedAt,
  (partialParticipant, breakoutRoomId, handIsUp, handUpdatedAt): Participant | undefined => {
    if (partialParticipant === undefined) {
      return undefined;
    }

    return {
      ...partialParticipant,
      handIsUp,
      handUpdatedAt,
      breakoutRoomId,
    };
  }
);

export const selectCombinedParticipantsAndUserInCoference = createSelector(
  selectAllOnlineParticipantsInConference,
  selectUserAsParticipant,
  (participants, user) => (user ? [...participants, user] : participants)
);

export const selectCombinedUserFirstAndParticipantsInConference = createSelector(
  selectAllOnlineParticipantsInConference,
  selectUserAsParticipant,
  (participants, user) => (user ? [user, ...participants] : participants)
);

export const selectCombinedParticipantsAndUser = createSelector(
  selectAllOnlineParticipants,
  selectUserAsParticipant,
  (participants, user) => (user ? [...participants, user] : participants)
);

export const selectParticipantsWithourGuestAndSip = createSelector(selectCombinedParticipantsAndUser, (participants) =>
  participants.filter(
    (participant) =>
      !(
        participant.participationKind.match(ParticipationKind.Guest) ||
        participant.participationKind.match(ParticipationKind.Sip)
      )
  )
);

export const selectJoinedFirstTimestamp = createSelector(
  selectAllParticipants,
  selectUserAsParticipant,
  (participants, user) =>
    (user ? [...participants, user] : participants)
      .map((participant) => participant.joinedAt)
      .sort((a, b) => a.localeCompare(b))[0]
);

export const selectCombinedParticipantsAndUserCount = createSelector(
  selectCombinedParticipantsAndUser,
  (users) => users.length
);

export const selectAllProtocolParticipants = createSelector(
  selectCombinedParticipantsAndUser,
  selectUserAsParticipant,
  (participants, user) => {
    if (user) {
      const allProtocolParticipants = participants.filter(
        (participant) =>
          participant.participationKind !== ParticipationKind.Guest &&
          participant.participationKind !== ParticipationKind.Sip
      );
      const hasSelectedParticipants = some(allProtocolParticipants, ['protocolAccess', ProtocolAccess.Write]);
      const newParticipants = allProtocolParticipants.map((participant): ProtocolParticipant => {
        const isSelected = hasSelectedParticipants
          ? participant.protocolAccess === ProtocolAccess.Write
          : participant.id === user.id;
        return {
          id: participant.id,
          displayName: participant.displayName,
          avatarUrl: participant.avatarUrl,
          isSelected,
        };
      });
      return newParticipants;
    }
    return [];
  }
);

export const selectCombinedSpeakerId = createSelector(
  selectPinnedParticipantId,
  selectFocusedSpeaker,
  (pinnedParticipantId, focusedSpeakerId) => pinnedParticipantId ?? focusedSpeakerId
);

export const selectAllGroupParticipants = createSelector(
  [selectCombinedParticipantsAndUser, selectGroups],
  (participants, groups) => {
    const NO_GROUP_ID = t('no-group-participants-label') as GroupId;
    const groupDictionary = new Map<GroupId, Array<Participant>>();

    groupDictionary.set(NO_GROUP_ID, []);
    groups.forEach((group) => {
      groupDictionary.set(group, []);
    });

    participants.forEach((participant) => {
      const groups = participant.groups;
      if (intersection(groups, [...groupDictionary.keys()]).length === 0) {
        groupDictionary.get(NO_GROUP_ID)?.push(participant);
        return;
      }

      groups.forEach((group) => {
        groupDictionary.get(group)?.push(participant);
      });
    });

    return groupDictionary;
  }
);

export const sortParticipants = sortParticipantsWithConfig({ language: i18next.language });

/**
 * @private
 */
const filterParticipants = <T extends FilterableParticipant>(participants: T[], searchValue: string) => {
  return participants.filter((participant) =>
    participant.displayName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
  );
};

const sortAndFilterParticipants = (participants: Participant[], sortOption: SortOption, searchValue: string) => {
  return filterParticipants(sortParticipants(participants, sortOption), searchValue);
};

export const selectParticipantGroupsSortedAndFiltered = createSelector(
  [selectAllGroupParticipants, selectParticipantsSortOption, selectParticipantsSearchValue],
  (groups, sortOption, searchValue) => {
    const groupDictionary = new Map<GroupId, Array<Participant>>();
    groups.forEach((participants, groupId) => {
      const sortedAndFilteredParticipants = sortAndFilterParticipants(participants, sortOption, searchValue);
      groupDictionary.set(groupId, sortedAndFilteredParticipants);
    });
    return groupDictionary;
  }
);

export const selectAllParticipantsSortedAndFiltered = createSelector(
  [selectCombinedParticipantsAndUser, selectParticipantsSortOption, selectParticipantsSearchValue],
  (participants, sortOption, searchValue) => sortAndFilterParticipants(participants, sortOption, searchValue)
);

export const selectCombinedMessageAndEvents = (scope: ChatScope, targetId: TargetId | undefined) =>
  createSelector(selectGlobalEvents(scope), selectChatMessagesByScope(scope, targetId), (events, messages) => {
    const merged: Array<ChatMessageType | RoomEvent> = (messages as Array<ChatMessageType | RoomEvent>).concat(events);
    return _.sortBy(merged, ['timestamp']);
  });

export const selectParticipantsReadyList = createSelector(
  selectAllOnlineParticipantsInConference,
  selectParticipantsReady,
  (selectCombinedParticipantsAndUser, participantsReady) =>
    selectCombinedParticipantsAndUser.map((participant) => ({
      isReady: participantsReady.includes(participant.id),
      ...participant,
    }))
);

export const selectUnmutedParticipants = createSelector(
  selectAllOnlineParticipants,
  selectUnmutedSubscribers,
  (participants, unmutedSubscribers): Participant[] => {
    return participants.filter(({ id }) => unmutedSubscribers.find(({ participantId }) => id === participantId));
  }
);

export const selectVotingUsers = createSelector(selectCombinedParticipantsAndUser, (records) => {
  return records.filter((record) => {
    return record.role === 'user' || record.participationKind === 'user';
  });
});

export const selectTalkingStickParticipants = createSelector(
  selectCombinedParticipantsAndUserInCoference,
  automodStore.selectAutomoderationParticipantIds,
  (onlineParticipants, talkingStickIds): Participant[] => {
    const participantsInTalkingStick: Participant[] = [];

    talkingStickIds.forEach((participantId) => {
      const foundParticipant = onlineParticipants.find((participant) => participant.id === participantId);

      if (foundParticipant) {
        participantsInTalkingStick.push(foundParticipant);
      }
    });

    return participantsInTalkingStick;
  }
);

export const selectPollsAndVotingsCount = createSelector(
  legalVoteStore.selectAllVotes,
  selectAllPollVotes,
  (votings, polls) => {
    return votings.length + polls.length;
  }
);
