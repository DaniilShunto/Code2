// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Participant, SortOption } from '../types';
import { shuffleArrayItems } from './arrayUtils';

export type SortableParticipant = Pick<
  Participant,
  'displayName' | 'joinedAt' | 'handUpdatedAt' | 'lastActive' | 'handIsUp'
>;

export const sortParticipantsWithConfig =
  (config: { language: string }) =>
  <T extends SortableParticipant>(participants: T[], sortOption: SortOption): T[] => {
    const localParticipants = [...participants];

    switch (sortOption) {
      case SortOption.NameASC:
        return localParticipants.sort((a, b) =>
          a.displayName.localeCompare(b.displayName, config.language, { ignorePunctuation: true })
        );
      case SortOption.NameDESC:
        return localParticipants.sort((a, b) =>
          b.displayName.localeCompare(a.displayName, config.language, { ignorePunctuation: true })
        );
      case SortOption.FirstJoin:
        return localParticipants.sort((a, b) => Date.parse(a.joinedAt) - Date.parse(b.joinedAt));
      case SortOption.LastJoin:
        return localParticipants.sort((a, b) => Date.parse(b.joinedAt) - Date.parse(a.joinedAt));
      case SortOption.RaisedHandFirst:
        return localParticipants
          .sort((a, b) => {
            const dateA = a.handUpdatedAt !== undefined ? Date.parse(a.handUpdatedAt) : 0;
            const dateB = b.handUpdatedAt !== undefined ? Date.parse(b.handUpdatedAt) : 0;
            return dateB - dateA;
          })
          .sort((p) => (p.handIsUp ? -1 : 1));
      case SortOption.LastActive:
        return localParticipants.sort((a, b) => Date.parse(b.lastActive) - Date.parse(a.lastActive));
      case SortOption.Random:
        return localParticipants.length > 1 ? shuffleArrayItems(localParticipants) : localParticipants;
      default:
        return localParticipants;
    }
};
