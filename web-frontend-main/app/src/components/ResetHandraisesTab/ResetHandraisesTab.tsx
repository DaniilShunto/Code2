// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button } from '@mui/material';
import { Participant } from '@opentalk/common';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { resetRaisedHands } from '../../api/types/outgoing/moderation';
import { useAppDispatch } from '../../hooks';

export interface MutedParticipant extends Participant {
  selected: boolean;
}

const ResetHandraisesTab = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const resetAllHandraises = useCallback(() => {
    dispatch(resetRaisedHands.action());
  }, [dispatch]);

  return <Button onClick={resetAllHandraises}>{t('reset-handraises-button')}</Button>;
};

export default ResetHandraisesTab;
