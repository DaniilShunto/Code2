// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { notifications } from '@opentalk/common';
import { AssetId, RoomId } from '@opentalk/rest-api-rtk-query';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '.';
import { selectControllerUrl } from '../store/slices/configSlice';
import { fetchWithAuth } from '../utils/apiUtils';

const downloadRoomAsset = async (baseURL: string, roomId: RoomId, assetId: AssetId, filename: string) => {
  const downloadURL = new URL(`v1/rooms/${roomId}/assets/${assetId}`, baseURL);

  const response = await fetchWithAuth(downloadURL);
  if (response.status !== 200) {
    throw Error(`Something went wrong when trying to download asset. Request returned status: ${response.status}`);
  }

  const blob = await response.blob();

  const hiddenElement = document.createElement('a');
  const url = window.URL || window.webkitURL;
  const blobURL = url.createObjectURL(blob);

  hiddenElement.href = blobURL;
  hiddenElement.target = '_blank';
  hiddenElement.download = filename;
  hiddenElement.click();

  hiddenElement.parentNode?.removeChild(hiddenElement);
  url.revokeObjectURL(blobURL);
};

export const useDownloadAction = () => {
  const { t } = useTranslation();
  const controllerUrl = useAppSelector(selectControllerUrl);

  return useCallback(
    (roomId: RoomId, assetId: AssetId, filename: string) => {
      return downloadRoomAsset(controllerUrl, roomId, assetId, filename).catch((error) => {
        console.error(`Error downloading asset ${assetId}: `, error);
        notifications.error(t('asset-download-error'));
      });
    },
    [controllerUrl, t]
  );
};
