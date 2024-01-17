// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import { MicOffIcon, MicOnIcon } from '@opentalk/common';
import React, { useCallback, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectAudioEnabled, selectMediaChangeInProgress } from '../../../store/slices/mediaSlice';
import { useMediaContext } from '../../MediaProvider';
import AudioIndicator from './AudioIndicator';
import AudioMenu from './AudioMenu';
import ToolbarButton from './ToolbarButton';

const MicOnStyled = styled(MicOnIcon)({
  zIndex: 1,
});

const AudioButton = ({ isLobby }: { isLobby?: boolean }) => {
  const mediaContext = useMediaContext();
  const audioEnabled = useAppSelector(selectAudioEnabled);
  const isAudioOn = audioEnabled && mediaContext.hasMicrophone;
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isLoadingMedia = useAppSelector(selectMediaChangeInProgress);

  const closeMenu = () => setShowMenu(false);
  const openMenu = () => setShowMenu(true);
  const { t } = useTranslation();

  const switchAudio = useCallback((value: boolean) => mediaContext.trySetAudio(value), [mediaContext]);

  const toggleAudio = useCallback(() => {
    if (!isLoadingMedia) {
      switchAudio(!audioEnabled);
    }
  }, [isLoadingMedia, switchAudio, audioEnabled]);

  const indicator = useMemo(
    () =>
      isAudioOn ? (
        <>
          <AudioIndicator shape={'circle'} />
          <MicOnStyled />
        </>
      ) : (
        <MicOffIcon />
      ),
    [isAudioOn]
  );

  const tooltipText = () => {
    if (mediaContext.permissionDenied) {
      return t('device-permission-denied');
    }
    if (audioEnabled) {
      return t('toolbar-button-audio-turn-off-tooltip-title');
    }
    return t('toolbar-button-audio-turn-on-tooltip-title');
  };

  const contextTitle = t('toolbar-button-audio-context-title');

  return (
    <div ref={menuRef}>
      <ToolbarButton
        tooltipTitle={tooltipText()}
        onClick={toggleAudio}
        hasContext
        contextDisabled={!mediaContext.hasMicrophone}
        disabled={!mediaContext.hasMicrophone || isLoadingMedia}
        openMenu={openMenu}
        active={audioEnabled}
        isLobby={isLobby}
        data-testid="toolbarAudioButton"
        contextTitle={contextTitle}
        contextMenuId="audio-context-menu"
        contextMenuExpanded={showMenu}
      >
        {indicator}
      </ToolbarButton>
      <AudioMenu open={showMenu} onClose={closeMenu} anchorEl={menuRef.current} />
    </div>
  );
};

export default AudioButton;
