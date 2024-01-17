// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Collapse, ListItemText } from '@mui/material';

import { ListItem } from './PrimaryNavigation';

interface NavigationProps {
  href?: string;
  target?: string;
  Icon: JSX.Element;
  collapsedBar: boolean;
  label: string;
  disabled?: boolean;
  isSubmenuOpen?: boolean;
  onClick?: () => void;
}

const PrimaryNavigationEntry = (props: NavigationProps) => {
  return (
    <ListItem isSubmenuOpen={props.isSubmenuOpen}>
      <Button
        onClick={props.onClick}
        href={props.href || ''}
        disabled={props.disabled}
        disableRipple
        target={props.target}
      >
        {props.Icon}
        <Collapse orientation="horizontal" in={!props.collapsedBar}>
          <ListItemText>{props.label}</ListItemText>
        </Collapse>
      </Button>
    </ListItem>
  );
};

export default PrimaryNavigationEntry;
