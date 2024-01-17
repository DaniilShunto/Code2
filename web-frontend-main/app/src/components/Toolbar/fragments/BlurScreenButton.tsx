// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { PictureIcon } from '@opentalk/common';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectMediaChangeInProgress, selectVideoBackgroundEffects } from '../../../store/slices/mediaSlice';
import { useMediaContext } from '../../MediaProvider';
import ToolbarButton from './ToolbarButton';

const BlurScreenButton = ({ isLobby }: { isLobby?: boolean }) => {
  const { t } = useTranslation();
  const mediaContext = useMediaContext();
  const backgroundEffects = useAppSelector(selectVideoBackgroundEffects);
  const isBlurred = backgroundEffects?.style === 'blur' || false;
  const isLoadingMedia = useAppSelector(selectMediaChangeInProgress);

  const tooltipText = isBlurred
    ? t('toolbar-button-blur-turn-off-tooltip-title')
    : t('toolbar-button-blur-turn-on-tooltip-title');

  return (
    <ToolbarButton
      tooltipTitle={tooltipText}
      active={isBlurred}
      onClick={() => {
        if (!isLoadingMedia) {
          mediaContext.trySetBackground({ style: isBlurred ? 'off' : 'blur' });
        }
      }}
      disabled={isLoadingMedia}
      isLobby={isLobby}
      data-testid="toolbarBlurScreenButton"
    >
      <PictureIcon />
    </ToolbarButton>
  );
};

export default BlurScreenButton;
