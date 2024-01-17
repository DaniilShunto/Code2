// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { CloseIcon } from '@opentalk/common';
import React from 'react';

export interface ConfirmDialogProps {
  submitButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
  onClose?: () => void;
  message: string;
  title: string;
  open: boolean;
  onMouseDown?: (mouseEvent: React.MouseEvent<HTMLDivElement>) => void;
}

export const ConfirmDialog = ({
  submitButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
  onClose,
  message,
  title,
  open,
  onMouseDown,
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth disablePortal onMouseDown={onMouseDown}>
      <DialogTitle sx={{ textAlign: 'left' }}>{title}</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton onClick={onClose || onCancel}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary" variant="contained">
          {cancelButtonText}
        </Button>
        <Button onClick={onConfirm} color="secondary" variant="contained">
          {submitButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
