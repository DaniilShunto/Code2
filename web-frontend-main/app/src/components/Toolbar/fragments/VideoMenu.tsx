// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Divider,
  FormControlLabel as MuiFormControlLabel,
  ListItem,
  Slider,
  styled,
  Switch,
  ThemeProvider,
  Typography,
  Avatar,
  Stack,
  MenuItem as MuiMenuItem,
  ListItemText,
  FormGroup,
  MenuList,
} from '@mui/material';
import {
  CameraOnIcon,
  ErrorIcon,
  SettingsIcon,
  WarningIcon,
  CloseIcon,
  VideoSetting,
  notifications,
} from '@opentalk/common';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createOpenTalkTheme } from '../../../assets/themes/opentalk';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import { useFullscreenContext } from '../../../hooks/useFullscreenContext';
import browser from '../../../modules/BrowserSupport';
import { DeviceId } from '../../../modules/Media/MediaUtils';
import { selectVideoBackgrounds } from '../../../store/slices/configSlice';
import { selectQualityCap, selectVideoDeviceId, selectVideoBackgroundEffects } from '../../../store/slices/mediaSlice';
import { mirroredVideoSet, selectMirroredVideoEnabled } from '../../../store/slices/uiSlice';
import { useMediaContext } from '../../MediaProvider';
import DeviceList from './DeviceList';
import { ToolbarMenu, ToolbarMenuProps, MenuSectionTitle } from './ToolbarMenuUtils';

const SliderContainer = styled(ListItem)(({ theme }) => ({
  background: theme.palette.secondary.lightest,
  borderRadius: theme.borderRadius.medium,
  margin: theme.spacing(0, 2),
  width: 'auto',
}));

const MenuItem = styled(MuiMenuItem)({
  '&.MuiMenuItem-root:hover': {
    backgroundColor: 'transparent',
  },
});

const FormControlLabel = styled(MuiFormControlLabel)({
  flex: 1,
  margin: 0,
  justifyContent: 'space-between',
});

const BackgroundOptionsContainer = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(0.5, 1.5),
}));

const VideoBackgroundImage = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active, theme }) => ({
  aspectRatio: '16/9',
  height: '3.5rem',
  width: 'auto',
  cursor: 'pointer',
  borderRadius: active ? theme.borderRadius.small : 0,
  outline: ` ${active ? '3px' : 0} solid ${theme.palette.warning.main}`,
}));

const BackgroundImageList = styled(MenuList)(({ theme }) => ({
  margin: theme.spacing(1, 2, 0),
  display: 'grid',
  justifyContent: 'space-evenly',
  gridTemplateColumns: 'repeat(3, auto)',
  gridGap: theme.spacing(2),
}));

const BackgroundImageItem = styled(MenuItem)(({ theme }) => ({
  width: 'fit-content',
  padding: 0,
  '&.Mui-focusVisible': {
    '& > .MuiAvatar-root': {
      outline: `solid ${theme.palette.primary.main}`,
    },
  },
}));

const ClearBackground = styled(VideoBackgroundImage)(({ theme }) => ({
  border: `1px solid ${theme.palette.secondary.main}`,
  backgroundColor: theme.palette.secondary.lightest,
  color: theme.palette.secondary.main,
}));

const MultilineTypography = styled(Typography)({
  whiteSpace: 'pre-wrap',
});

const VideoMenu = ({ anchorEl, onClose, open }: ToolbarMenuProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const videoInDevice = useAppSelector(selectVideoDeviceId);
  const qualityCap = useAppSelector(selectQualityCap);
  const backgroundEffects = useAppSelector(selectVideoBackgroundEffects);
  const mirroringEnabled = useAppSelector(selectMirroredVideoEnabled);
  const videoBackgrounds = useAppSelector(selectVideoBackgrounds);

  const fullscreenHandle = useFullscreenContext();

  const mediaContext = useMediaContext();
  const selectedDevice = videoInDevice || mediaContext.defaultVideoDevice;
  const devices = mediaContext.videoDevices;
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [loadingChange, setLoadingChange] = useState<boolean>(false);

  const isBlurred = backgroundEffects.style === 'blur';

  const isBrowserSafari = browser.isSafari();
  const setBlur = useCallback(
    (enabled: boolean) => {
      if (!loadingChange) {
        setLoadingChange(true);
        mediaContext.trySetBackground({ style: enabled ? 'blur' : 'off' }).finally(() => setLoadingChange(false));
      }
    },
    [mediaContext, loadingChange]
  );

  const setImageBackground = useCallback(
    (imageUrl: string) => {
      if (!loadingChange) {
        setLoadingChange(true);
        mediaContext.trySetBackground({ style: 'image', imageUrl }).finally(() => {
          setLoadingChange(false);
        });
      }
    },
    [mediaContext, loadingChange]
  );

  const toggleMirroring = () => dispatch(mirroredVideoSet(!mirroringEnabled));

  // todo remove this here @s.sydow
  useEffect(() => {
    const shouldFetchDevices =
      open &&
      !mediaContext.permissionDenied &&
      (!mediaContext.hasAllVideoDetails || mediaContext.defaultVideoDevice === undefined);
    if (!loadingList && shouldFetchDevices) {
      setLoadingList(true);
      mediaContext
        .getDeviceDetails({ video: true })
        .catch((e) => notifications.error(`Get video devices failed: ${e}`))
        .finally(() => setLoadingList(false));
    }
  }, [loadingList, setLoadingList, mediaContext, open]);

  // We need this mapping for screen readers to read slider labels properly
  // A function passed to the getAriaValueText prop of the Slider must have signature
  // (number) => string
  const getSliderLabel = (value: VideoSetting) => {
    switch (value) {
      case VideoSetting.Off:
        return t('quality-audio-only');

      case VideoSetting.Low:
        return t('quality-low');

      case VideoSetting.Medium:
        return t('quality-medium');

      case VideoSetting.High:
        return t('quality-high');

      default:
        return 'Unknown slider value';
    }
  };

  const qualityMarks = [
    {
      value: VideoSetting.Off,
      label: getSliderLabel(VideoSetting.Off),
    },
    {
      value: VideoSetting.Low,
      label: getSliderLabel(VideoSetting.Low),
    },
    {
      value: VideoSetting.Medium,
      label: getSliderLabel(VideoSetting.Medium),
    },
    {
      value: VideoSetting.High,
      label: getSliderLabel(VideoSetting.High),
    },
  ];

  const handleClick = (deviceId: DeviceId) => {
    if (!loadingChange) {
      setLoadingChange(true);
      mediaContext
        .changeVideoInput(deviceId)
        .then(onClose)
        .finally(() => setLoadingChange(false));
    }
  };

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
        id="video-context-menu"
        aria-labelledby="video-menu-title"
        role="menu"
      >
        <MenuSectionTitle id="video-menu-title" sx={{ pt: 1.5, pb: 1.5 }}>
          <CameraOnIcon />
          {t('videomenu-choose-input')}
        </MenuSectionTitle>

        {mediaContext.permissionDenied && (
          <MenuSectionTitle>
            <ErrorIcon />
            <MultilineTypography variant="body2">{t('device-permission-denied')}</MultilineTypography>
          </MenuSectionTitle>
        )}

        {devices === undefined || !mediaContext.hasAllVideoDetails ? (
          <MenuSectionTitle>
            <WarningIcon />
            <ListItemText>{t('devicemenu-wait-for-permission')}</ListItemText>
          </MenuSectionTitle>
        ) : (
          <DeviceList
            devices={devices}
            selectedDevice={selectedDevice}
            onClick={(deviceId: DeviceId) => handleClick(deviceId)}
            ariaLabelId="video-menu-title"
          />
        )}

        <Divider variant="middle" />

        <MenuSectionTitle>
          <SettingsIcon />
          {t('videomenu-settings')}
        </MenuSectionTitle>
        <Typography fontWeight={'normal'} id="quality-slider" sx={{ pt: 1, pb: 2, px: 2 }}>
          {t('quality-cap-setting')}
        </Typography>
        <SliderContainer sx={{ px: 3 }}>
          <Slider
            value={qualityCap}
            onChangeCommitted={(ev, value) => mediaContext.setMaxQuality(value as VideoSetting)}
            aria-labelledby="quality-slider"
            valueLabelDisplay="off"
            step={1}
            marks={qualityMarks}
            min={VideoSetting.Off}
            max={VideoSetting.High}
            getAriaValueText={(value) => getSliderLabel(value)}
          />
        </SliderContainer>

        <Divider variant="middle" />

        <MenuSectionTitle>{t('videomenu-background')}</MenuSectionTitle>
        <FormGroup>
          <BackgroundOptionsContainer spacing={1}>
            {!isBrowserSafari && (
              <FormControlLabel
                control={<Switch onChange={(_, enabled) => setBlur(enabled)} value={isBlurred} checked={isBlurred} />}
                label={
                  <Typography fontWeight={'normal'}>
                    {t(isBlurred ? 'videomenu-blur-on' : 'videomenu-blur-off')}
                  </Typography>
                }
                labelPlacement="start"
              />
            )}
            <FormControlLabel
              control={<Switch onChange={toggleMirroring} value={mirroringEnabled} checked={mirroringEnabled} />}
              label={
                <Typography fontWeight={'normal'}>
                  {t(mirroringEnabled ? 'videomenu-mirroring-on' : 'videomenu-mirroring-off')}
                </Typography>
              }
              labelPlacement="start"
            />
          </BackgroundOptionsContainer>
        </FormGroup>

        {!isBrowserSafari && videoBackgrounds.length > 0 && (
          <>
            <Divider variant="middle" />
            <Typography fontWeight={'normal'} id="background-images-title" sx={{ px: 2 }}>
              {t('videomenu-background-images')}
            </Typography>
            <BackgroundImageList aria-labelledby="background-images-title" role="listbox">
              <BackgroundImageItem onClick={() => setBlur(false)} aria-label={t('videomenu-background-no-image')}>
                <ClearBackground variant="square" active={backgroundEffects.style === 'off'}>
                  <CloseIcon />
                </ClearBackground>
              </BackgroundImageItem>
              {videoBackgrounds.map((image) => {
                const selectedEnabled = backgroundEffects.imageUrl === image.url;
                return (
                  <BackgroundImageItem
                    key={image.url}
                    onClick={() => (!selectedEnabled ? setImageBackground(image.url) : setBlur(false))}
                    aria-label={image.altText}
                  >
                    <VideoBackgroundImage
                      src={image.thumb}
                      key={image.url}
                      alt={image.altText}
                      variant="square"
                      active={selectedEnabled}
                    />
                  </BackgroundImageItem>
                );
              })}
            </BackgroundImageList>
          </>
        )}
      </ToolbarMenu>
    </ThemeProvider>
  );
};

export default VideoMenu;
