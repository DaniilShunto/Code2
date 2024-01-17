// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Event, EventException } from '@opentalk/rest-api-rtk-query';
import React from 'react';

import { useGetMeQuery } from '../../api/rest';
import OverviewCard from './fragments/OverviewCard';
import StandardCard from './fragments/StandardCard';

interface MeetingCardBaseProps {
  event: Event | EventException;
  highlighted?: boolean;
}
interface MeetingCardProps extends MeetingCardBaseProps {
  overview?: boolean;
}

export interface MeetingCardFragmentProps extends MeetingCardBaseProps {
  isMeetingCreator: boolean;
}

const MeetingCard = ({ event, overview, highlighted }: MeetingCardProps) => {
  const { data: me } = useGetMeQuery();
  const isMeetingCreator = me?.id === event.createdBy.id;

  return overview ? (
    <OverviewCard event={event} isMeetingCreator={isMeetingCreator} highlighted={highlighted} />
  ) : (
    <StandardCard event={event} isMeetingCreator={isMeetingCreator} highlighted={highlighted} />
  );
};

export default MeetingCard;
