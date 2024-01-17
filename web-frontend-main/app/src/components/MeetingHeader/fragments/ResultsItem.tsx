// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Chip as MuiChip, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { PollIcon, LegalBallotIcon } from '@opentalk/common';
import { LegalVoteType } from '@opentalk/components';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '../../../hooks';
import { Poll } from '../../../store/slices/pollSlice';
import { setVotePollIdToShow } from '../../../store/slices/uiSlice';

const Chip = styled(MuiChip)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginRight: 0,
  borderRadius: 0,
  borderColor: 'transparent',
  '& .MuiChip-label': {
    paddingRight: 0,
    '&:first-letter': {
      textTransform: 'capitalize',
    },
  },
}));

const CustomMenuItem = styled(MenuItem)(() => ({
  '&:hover': {
    cursor: 'pointer',
  },
}));

interface ResultsItemProps {
  item: LegalVoteType | Poll;
}

const ResultsItem = ({ item }: ResultsItemProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const openItem = (item: LegalVoteType | Poll) => {
    dispatch(setVotePollIdToShow(item.id));
  };

  const label = Object.hasOwn(item, 'name') ? (item as LegalVoteType).name : (item as Poll).topic;

  return (
    <CustomMenuItem key={item.id} onClick={() => openItem(item)}>
      <ListItemIcon>{Object.hasOwn(item, 'choices') ? <PollIcon /> : <LegalBallotIcon />}</ListItemIcon>
      <ListItemText sx={{ whiteSpace: 'normal' }}>{`${label}`}</ListItemText>
      <Chip
        size="medium"
        label={t(`global-state-${item.state}`)}
        color={item.state === 'active' ? 'success' : 'error'}
        variant="filled"
        clickable={false}
      />
    </CustomMenuItem>
  );
};

export default ResultsItem;
