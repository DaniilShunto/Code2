// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { RaiseHandOffIcon, RaiseHandOnIcon } from '@opentalk/common';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { lowerHand, raiseHand } from '../../../api/types/outgoing/control';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectRaiseHandsEnabled, selectHandUp } from '../../../store/slices/moderationSlice';
import ToolbarButton from './ToolbarButton';

const HandraiseButton = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const hasHandUp = useAppSelector(selectHandUp);
  const hasHandraisesEnabled = useAppSelector(selectRaiseHandsEnabled);

  const toggleRaisedHand = () => {
    hasHandUp ? dispatch(lowerHand.action()) : dispatch(raiseHand.action());
  };

  const renderTooltipText = () => {
    if (!hasHandraisesEnabled) {
      return 'toolbar-button-handraises-disabled';
    }
    return hasHandUp ? 'toolbar-button-lower-hand-tooltip-title' : 'toolbar-button-raise-hand-tooltip-title';
  };

  return (
    <ToolbarButton
      tooltipTitle={t(renderTooltipText())}
      active={hasHandUp}
      onClick={toggleRaisedHand}
      data-testid="toolbarHandraiseButton"
      disabled={!hasHandraisesEnabled}
    >
      {hasHandUp ? <RaiseHandOnIcon /> : <RaiseHandOffIcon />}
    </ToolbarButton>
  );
};

export default HandraiseButton;
