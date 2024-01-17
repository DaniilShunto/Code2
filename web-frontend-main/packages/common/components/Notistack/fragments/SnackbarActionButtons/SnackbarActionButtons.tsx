// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Button } from '@mui/material';
import React from 'react';

import { CloseIcon } from '../../../../assets/icons';
import IconButton from '../../../IconButton';
import { ISnackbarActionButtonProps } from '../utils';

const SnackbarActionButtons = ({
  onCancel,
  onAction,
  actionBtnText,
  cancelBtnText,
  hideCloseButton,
  actionBtnAttributes = {},
  cancelBtnAttributes = {}
}: Omit<ISnackbarActionButtonProps, 'msg'>) => {
  return (
    <Box display="flex" gap={1}>
      {actionBtnText && (
        <Button onClick={onAction} variant={'text'} color={'inherit'} {...actionBtnAttributes}>
          {actionBtnText}
        </Button>
      )}
      {!hideCloseButton && (
        <>
          {cancelBtnText && (
            <Button onClick={onCancel} color={'inherit'} {...cancelBtnAttributes}>
              {cancelBtnText}
            </Button>
          )}
          {!cancelBtnText && (
            <IconButton onClick={onCancel}>
              <CloseIcon />
            </IconButton>
          )}
        </>
      )}
    </Box>
  );
};

export default SnackbarActionButtons;
