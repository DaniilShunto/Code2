// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Tooltip } from '@mui/material';
import { ReactElement } from 'react';

interface ContitionalToolTipProps {
  showToolTip: boolean;
  title?: string;
  children: ReactElement<JSX.Element, string>;
}
export const ContitionalToolTip: React.FC<ContitionalToolTipProps> = ({ showToolTip, title, children }) => {
  if (showToolTip && title) {
    return (
      <Tooltip placement={'top'} title={title}>
        {children}
      </Tooltip>
    );
  }

  return children;
};
