// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Typography, Stack } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { ArrowDownIcon } from '@opentalk/common';
import { EventType, isTimelessEvent } from '@opentalk/rest-api-rtk-query';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import MeetingCard from '../../../../components/MeetingCard';
import { MeetingsProp } from '../EventsOverviewPage';

interface MeetingsOverviewProp {
  entries: MeetingsProp[];
  expandAccordion: string;
}

const Accordion = styled(({ children, ...props }: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props}>
    {children}
  </MuiAccordion>
))({
  backgroundColor: 'transparent',
  width: '100%',
  ':before': {
    display: 'none',
  },
});

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<ArrowDownIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
  backgroundColor: 'transparent',
  borderBottom: `3px solid ${theme.palette.secondary.dark}`,
  justifyContent: 'flex-start',
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(-2),
    flexGrow: 'unset',
    paddingRight: theme.spacing(1),
  },
  '&:before': {
    backgroundColor: 'none',
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
  marginLeft: theme.spacing(-2),
}));

const EventsOverview = ({ entries, expandAccordion }: MeetingsOverviewProp) => {
  const [expanded, setExpanded] = useState<string[]>([]);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? [...expanded, panel] : expanded.filter((e) => e !== panel));
  };
  const { t } = useTranslation();

  const isContainingRecurringEvents = useMemo(() => {
    return entries.find((meetings) =>
      meetings?.events?.find((event) => !isTimelessEvent(event) && event.type === EventType.Recurring)
    );
  }, [entries]);

  useEffect(() => {
    if (expandAccordion === 'all') {
      setExpanded(entries.map((event) => event.title));
    } else {
      setExpanded([expandAccordion]);
    }
  }, [expandAccordion, entries]);

  return (
    <Stack spacing={1} overflow={'auto'} flex={'1 1 auto'} height={0}>
      {isContainingRecurringEvents && (
        <Typography variant="h2" component={'h2'}>
          {t('dashboard-events-note-limited-view')}
        </Typography>
      )}
      {entries.map((entry) => (
        <Accordion
          data-testid="EventAccordion"
          expanded={expanded.includes(entry.title)}
          onChange={handleChange(entry.title)}
          key={entry.title}
          TransitionProps={{ unmountOnExit: true }}
        >
          <AccordionSummary aria-controls={`${entry.title}-control`} id={`${entry.title}-panel`}>
            <Typography>{entry.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {entry.events?.map((event) => (
              <MeetingCard
                key={`${isTimelessEvent(event) ? event.id : event.startsAt?.datetime}`}
                event={event}
                overview
              />
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
};

export default EventsOverview;
