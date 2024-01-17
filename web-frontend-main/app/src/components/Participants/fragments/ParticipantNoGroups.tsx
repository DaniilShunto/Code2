// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { useAppSelector } from '../../../hooks';
import { selectAllParticipantsSortedAndFiltered } from '../../../store/selectors';
import ParticipantSimpleList from './ParticipantSimpleList';

const ParticipantNoGroups = () => {
  const participants = useAppSelector(selectAllParticipantsSortedAndFiltered);

  return <ParticipantSimpleList participants={participants} />;
};

export default ParticipantNoGroups;
