// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { CameraOffIcon, CameraOnIcon } from '@opentalk/common';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectMediaChangeInProgress, selectVideoEnabled } from '../../../store/slices/mediaSlice';
import { useMediaContext } from '../../MediaProvider';
import ToolbarButton from './ToolbarButton';
import VideoMenu from './VideoMenu';

const VideoButton = ({ isLobby }: { isLobby?: boolean }) => {
  const mediaContext = useMediaContext();
  const videoEnabled = useAppSelector(selectVideoEnabled);
  const isCameraOn = videoEnabled && mediaContext.hasCamera;
  const menuRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const isLoadingMedia = useAppSelector(selectMediaChangeInProgress);

  const { t } = useTranslation();

  const tooltipText = () => {
    if (mediaContext.permissionDenied) {
      return t('device-permission-denied');
    }
    if (videoEnabled) {
      return t('toolbar-button-video-turn-off-tooltip-title');
    }
    return t('toolbar-button-video-turn-on-tooltip-title');
  };

  const contextTitle = t('toolbar-button-video-context-title');

  return (
    <div ref={menuRef}>
      <ToolbarButton
        tooltipTitle={tooltipText()}
        onClick={(event) => {
          /* Firefox fix!
			When button is focused firefox enables when hitting space to click the button
		  	event?.detail === 0 -> means that the click is not made with mouse - keep in mind for hotkeys
		  */
          if (event?.detail === 0) {
            event.preventDefault();
            return;
          }
          if (!isLoadingMedia) {
            mediaContext.trySetVideo(!videoEnabled);
          }
        }}
        hasContext
        contextDisabled={!mediaContext.hasCamera}
        contextTitle={contextTitle}
        contextMenuId="video-context-menu"
        contextMenuExpanded={showMenu}
        disabled={!mediaContext.hasCamera || isLoadingMedia}
        active={videoEnabled}
        openMenu={() => {
          setShowMenu(true);
        }}
        isLobby={isLobby}
        data-testid="toolbarVideoButton"
      >
        {isCameraOn ? <CameraOnIcon /> : <CameraOffIcon />}
      </ToolbarButton>
      <VideoMenu
        anchorEl={menuRef.current}
        onClose={() => {
          setShowMenu(false);
        }}
        open={showMenu}
      />
    </div>
  );
};

export default VideoButton;
