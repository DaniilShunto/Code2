// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
export enum SortOption {
  NameASC = 'nameASC',
  NameDESC = 'nameDESC',
  FirstJoin = 'firstJoin',
  LastJoin = 'lastJoin',
  LastActive = 'lastActive',
  RaisedHandFirst = 'raisedHandFirst',
  Random = 'random',
}

export interface SortItem {
  i18nKey: string;
  type: SortOption;
}
