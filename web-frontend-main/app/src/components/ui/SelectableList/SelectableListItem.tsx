// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ListItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    paddingTop: '1em',
    paddingBottom: '1em',
    userSelect: 'none',
    background: '#ccc',
    color: '#111',
    '&:hover': {
      background: '#aaa',
    },
  },
  checkbox: {
    top: 0,
    left: 0,
    width: '100%',
    cursor: 'inherit',
    height: '100%',
    margin: 0,
    opacity: 0,
    padding: 0,
    zIndex: 1,
    position: 'absolute',
  },
  checkboxSpace: {
    width: '1.875rem',
    position: 'relative',
    padding: '0 0.2em',
  },
});

interface SelectableListProps {
  disabled?: boolean;
  selected?: boolean;
  focused?: boolean;
  label: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler;
  className?: string;
}

export const SelectableListItem = ({
  children,
  disabled,
  selected,
  label,
  onClick,
  className: classNameProps,
}: SelectableListProps) => {
  const classNames = useStyles();
  return (
    <ListItem
      className={`${classNames.root} ${classNameProps}`}
      disabled={disabled}
      selected={selected}
      onClick={onClick}
    >
      <div className={classNames.checkboxSpace}>
        <input type="checkbox" checked={selected || undefined} aria-labelledby={`checkbox-list-${label}`} />
      </div>
      <div aria-label={`checkbox-list-${label}`}>{children}</div>
    </ListItem>
  );
};
export default SelectableListItem;
