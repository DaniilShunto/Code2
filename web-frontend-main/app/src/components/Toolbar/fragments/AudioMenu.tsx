// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ThemeProvider, Typography, ListItemText, styled } from '@mui/material';
import { MicOnIcon, notifications } from '@opentalk/common';
import { ErrorIcon, WarningIcon } from '@opentalk/common';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createOpenTalkTheme } from '../../../assets/themes/opentalk';
import { useAppSelector } from '../../../hooks';
import { useFullscreenContext } from '../../../hooks/useFullscreenContext';
import { DeviceId } from '../../../modules/Media/MediaUtils';
import { selectAudioDeviceId } from '../../../store/slices/mediaSlice';
import { useMediaContext } from '../../MediaProvider';
import DeviceList from './DeviceList';
import { MenuSectionTitle, ToolbarMenu, ToolbarMenuProps } from './ToolbarMenuUtils';

const MultilineTypography = styled(Typography)({
  whiteSpace: 'pre-wrap',
});

const AudioMenu = ({ anchorEl, onClose, open }: ToolbarMenuProps) => {
  const { t } = useTranslation();
  const audioIn = useAppSelector(selectAudioDeviceId);
  const mediaContext = useMediaContext();
  const selectedDevice = audioIn || mediaContext.defaultAudioDevice;
  const devices = mediaContext.audioInDevices;
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [loadingChange, setLoadingChange] = useState<boolean>(false);

  const fullscreenHandle = useFullscreenContext();

  // todo remove this here @s.sydow
  useEffect(() => {
    const shouldFetchDevices =
      open &&
      !mediaContext.permissionDenied &&
      (!mediaContext.hasAllAudioDetails || mediaContext.defaultAudioDevice === undefined);
    if (!loadingList && shouldFetchDevices) {
      setLoadingList(true);
      mediaContext
        .getDeviceDetails({ audio: true })
        .catch((e) => notifications.error(`Get audio devices failed: ${e}`))
        .finally(() => setLoadingList(false));
    }
  }, [loadingList, setLoadingList, mediaContext, open]);

  const handleClick = (deviceId: DeviceId) => {
    if (!loadingChange) {
      setLoadingChange(true);
      mediaContext
        .changeAudioInput(deviceId)
        .then(onClose)
        .finally(() => setLoadingChange(false));
    }
  };

  // Todo show spinner while we fetch the permissions?
  return (
    <ThemeProvider theme={createOpenTalkTheme()}>
      <ToolbarMenu
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: -4,
          horizontal: 'center',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        disablePortal={fullscreenHandle.active}
        id="audio-context-menu"
        aria-labelledby="audio-menu-title"
        role="listbox"
      >
        <MenuSectionTitle id="audio-menu-title" sx={{ pt: 1.5, pb: 1.5 }}>
          <MicOnIcon />
          {t('audiomenu-choose-input')}
        </MenuSectionTitle>

        {mediaContext.permissionDenied && (
          <MenuSectionTitle>
            <ErrorIcon />
            <MultilineTypography variant="body2">{t('device-permission-denied')}</MultilineTypography>
          </MenuSectionTitle>
        )}

        {devices === undefined || !mediaContext.hasAllAudioDetails ? (
          <MenuSectionTitle>
            <WarningIcon />
            <ListItemText>{t('devicemenu-wait-for-permission')}</ListItemText>
          </MenuSectionTitle>
        ) : (
          <DeviceList
            devices={devices}
            selectedDevice={selectedDevice}
            onClick={(deviceId: DeviceId) => handleClick(deviceId)}
            ariaLabelId="audio-menu-title"
          />
        )}
      </ToolbarMenu>
    </ThemeProvider>
  );
};
export default AudioMenu;
