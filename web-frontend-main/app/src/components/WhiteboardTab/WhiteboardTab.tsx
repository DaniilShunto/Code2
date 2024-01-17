// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Button, Link as MUILink, Stack, styled } from '@mui/material';
import { RoomId } from '@opentalk/rest-api-rtk-query';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AssetRef } from '../../api/types/incoming/whiteboard';
import { generateWhiteboardPdf, startWhiteboard } from '../../api/types/outgoing/whiteboard';
import { useAppSelector } from '../../hooks';
import { useDownloadAction } from '../../hooks/download';
import { selectIsWhiteboardAvailable, selectWhiteboardAssets } from '../../store/slices/whiteboardSlice';

const Link = styled(MUILink)(() => ({
  cursor: 'pointer',
}));

const WhiteboardTab = () => {
  const { t } = useTranslation();
  const whiteboardAssets = useAppSelector(selectWhiteboardAssets);
  const showWhiteboard = useAppSelector(selectIsWhiteboardAvailable);
  const dispatch = useDispatch();
  const downloadAsset = useDownloadAction();

  const { roomId } = useParams<'roomId'>() as { roomId: RoomId };

  const handleStartWhiteboard = useCallback(() => {
    dispatch(startWhiteboard.action());
  }, [dispatch]);

  const createPdf = useCallback(() => {
    dispatch(generateWhiteboardPdf.action());
  }, [dispatch]);

  const handleDownload = useCallback(
    ({ assetId, filename }: AssetRef) => {
      return downloadAsset(roomId, assetId, filename);
    },
    [roomId]
  );

  return (
    <Stack height="100%" spacing={1}>
      <Box mb={'0.5rem'} width={'100%'} height={'100%'} overflow={'auto'} alignSelf={'flex-start'}>
        <Stack spacing={2}>
          {whiteboardAssets.map((asset) => {
            return (
              <Link key={asset.assetId} onClick={() => handleDownload(asset)}>
                {asset.filename}
              </Link>
            );
          })}
        </Stack>
      </Box>
      {showWhiteboard ? (
        <Button onClick={createPdf}>{t('whiteboard-create-pdf-button')}</Button>
      ) : (
        <Button onClick={handleStartWhiteboard}>{t('whiteboard-start-whiteboard-button')}</Button>
      )}
    </Stack>
  );
};

export default WhiteboardTab;
