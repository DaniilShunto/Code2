// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { IconButtonTypeMap, IconButton as MuiIconButton } from '@mui/material';
import { ExtendButtonBase } from '@mui/material/ButtonBase';

/**
 * IconButton with variant re-export
 *
 * Adds the possible variant toolbar to the IconButton of MUI which currently does not have a
 * IconButtonVariantOverrides interface
 */

const IconButton: ExtendButtonBase<IconButtonTypeMap<{ variant?: 'toolbar' }>> = MuiIconButton;

export default IconButton;
