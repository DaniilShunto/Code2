// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { List } from '@mui/material';
import React from 'react';

interface SelectableListProps {
  children: React.ReactNode;
  className?: string;
}

export const SelectableList = ({ children, className }: SelectableListProps) => {
  return (
    <List className={className} role="listbox">
      {children}
    </List>
  );
};

export default SelectableList;
