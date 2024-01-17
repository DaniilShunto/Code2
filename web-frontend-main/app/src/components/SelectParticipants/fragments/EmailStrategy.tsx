// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Stack, Typography } from '@mui/material';
import { ParticipantAvatar } from '@opentalk/common';
import * as Yup from 'yup';

import { ParticipantOption } from './ParticipantOption';

const schema = Yup.string().email();

export const EmailStrategy = {
  getOptionLabel: (option: ParticipantOption) => {
    return option.email;
  },
  renderOption: (noOptionsText: string) => (props: React.HTMLAttributes<HTMLLIElement>, option: ParticipantOption) => {
    if (!schema.isValidSync(option.email)) {
      return (
        <Box key="no-options" component="li" display="flex" style={props.style} className={props.className}>
          <Typography noWrap>{noOptionsText}</Typography>
        </Box>
      );
    }

    return (
      <Box key={option.email} component="li" display="flex" {...props}>
        <Box mr={1}>
          <ParticipantAvatar specialCharacter="@" />
        </Box>
        <Stack>
          <Typography variant="caption" noWrap>
            {option.email}
          </Typography>
        </Stack>
      </Box>
    );
  },
};
