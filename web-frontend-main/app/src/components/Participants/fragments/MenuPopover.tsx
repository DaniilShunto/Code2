// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { MenuItem as MuiMenuItem, Popover as MuiPopover, styled, Typography } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

export interface IMenuOptionItem {
  disabled?: boolean;
  i18nKey: string;
  action: () => void;
}

interface IMenuPopoverProps<T> {
  open: boolean;
  setAnchorEl: Dispatch<SetStateAction<T | undefined>>;
  anchorEl: (T & Element) | undefined;
  onClose?: () => void;
  options: IMenuOptionItem[];
}

const MenuItem = styled(MuiMenuItem)({
  justifyContent: 'space-between',
  '& .MuiTypography-root': {
    fontWeight: 400,
  },
});

function MenuPopover<T>({ setAnchorEl, anchorEl, open, onClose, options }: IMenuPopoverProps<T>) {
  const { t } = useTranslation();

  const handleClose = () => {
    setAnchorEl(undefined);
    onClose && onClose();
  };

  const renderMenuOptionItems = () =>
    options.map((option) => (
      <MenuItem disabled={option.disabled} key={option.i18nKey} onClick={option.action}>
        <Typography>{t(option.i18nKey)}</Typography>
      </MenuItem>
    ));

  return (
    <MuiPopover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      {renderMenuOptionItems()}
    </MuiPopover>
  );
}

export default MenuPopover;
