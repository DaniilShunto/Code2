// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, styled } from '@mui/material';
import { notifications } from '@opentalk/common';
import { AssetId, RoomId } from '@opentalk/rest-api-rtk-query';
import { format } from 'date-fns';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetRoomAssetsQuery, useDeleteRoomAssetMutation } from '../../../../api/rest';
import SuspenseLoading from '../../../../commonComponents/SuspenseLoading';
import { useDownloadAction } from '../../../../hooks/download';

interface EventAssetTableProps {
  roomId: RoomId;
  isMeetingCreator: boolean;
}

const DownloadButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const AssetTable = ({ roomId, isMeetingCreator }: EventAssetTableProps) => {
  const { t } = useTranslation();
  const downloadRoomAsset = useDownloadAction();
  const { data: assets, isLoading, isError } = useGetRoomAssetsQuery(roomId, { refetchOnMountOrArgChange: true });
  const [deleteRoomAsset] = useDeleteRoomAssetMutation();
  const [disabledAssetActionRows, setDisabledAssetActionRows] = useState<AssetId[]>([]);
  const isAssetRowDisabled = useCallback(
    (assetId: AssetId) => disabledAssetActionRows.includes(assetId),
    [disabledAssetActionRows]
  );

  const handleDownload = useCallback(
    (assetId: AssetId, filename: string) => {
      setDisabledAssetActionRows((state) => [...state, assetId]);
      return downloadRoomAsset(roomId, assetId, filename).then(() =>
        setDisabledAssetActionRows((state) => state.filter((id) => id !== assetId))
      );
    },
    [downloadRoomAsset, roomId]
  );

  const handleDelete = useCallback(
    (assetId: AssetId) => {
      setDisabledAssetActionRows((state) => [...state, assetId]);
      return deleteRoomAsset({ roomId, assetId })
        .catch((error) => {
          console.error(`Error occured when deleting asset ${assetId}: `, error);
          notifications.error(t('asset-delete-error'));
        })
        .then(() => setDisabledAssetActionRows((state) => state.filter((id) => id !== assetId)));
    },
    [deleteRoomAsset, roomId, t]
  );

  const renderTableRows = () => {
    return assets?.map((asset) => {
      const isDisabled = isAssetRowDisabled(asset.id);
      return (
        <TableRow key={asset.id}>
          <TableCell>{asset.filename}</TableCell>
          <TableCell>{format(new Date(asset.createdAt), 'HH:mm dd.MM.yyyy')}</TableCell>
          <TableCell>
            <DownloadButton
              color="secondary"
              onClick={() => handleDownload(asset.id, asset.filename)}
              disabled={isDisabled}
            >
              {t('action-download')}
            </DownloadButton>
            {isMeetingCreator && (
              <Button color="error" onClick={() => handleDelete(asset.id)} disabled={isDisabled}>
                {t('action-delete')}
              </Button>
            )}
          </TableCell>
        </TableRow>
      );
    });
  };

  if (isLoading) return <SuspenseLoading />;

  if (isError || !assets || assets.length === 0) return null;

  return (
    <TableContainer component={Paper} sx={{ mt: 2, mb: 2, maxHeight: 250 }}>
      <Table padding="normal" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>{t('title-filename')}</TableCell>
            <TableCell>{t('state-created')}</TableCell>
            <TableCell>{t('title-actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderTableRows()}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default AssetTable;
