// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Popover as MuiPopover } from '@mui/material';
import React from 'react';

import SortPopoverMenuItem from './fragments/SortPopoverMenuItem';

interface SortPopoverItem {
  disabled?: boolean;
  i18nKey: string;
  type: string;
}

interface SortPopoverMenuProps<T extends SortPopoverItem> {
  isOpen: boolean;
  onChange(selectedOptionType: string): void;
  onClose(): void;
  selectedOptionType: string;
  items: Array<T>;
  id: string;
  anchorEl: HTMLElement;
}

const SortPopoverMenu = <T extends SortPopoverItem>({
  isOpen,
  onClose,
  items,
  selectedOptionType,
  onChange,
  id,
  anchorEl,
}: SortPopoverMenuProps<T>) => {
  const renderItems = () => {
    return items.map((option) => {
      const isSelected = option.type === selectedOptionType;

      return (
        <SortPopoverMenuItem
          key={option.i18nKey}
          selected={isSelected}
          disabled={option.disabled}
          onSelect={onChange}
          i18nKey={option.i18nKey}
          value={option.type}
        />
      );
    });
  };

  return (
    <MuiPopover
      id={id}
      role="menu"
      open={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      {renderItems()}
    </MuiPopover>
  );
};

export default SortPopoverMenu;
