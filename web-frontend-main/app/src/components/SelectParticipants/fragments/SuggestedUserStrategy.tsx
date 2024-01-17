// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Stack, Typography } from '@mui/material';
import { LibravatarDefaultImage, ParticipantAvatar, setLibravatarOptions } from '@opentalk/common';

import { ParticipantOption } from './ParticipantOption';

export const SuggestedUserStrategy = {
  getOptionLabel: (option: ParticipantOption) => {
    if ('firstname' in option) {
      return `${option.firstname} ${option.lastname} ${option.email}`;
    }

    return '';
  },
  renderOption:
    (defaultImage: LibravatarDefaultImage) =>
    (props: React.HTMLAttributes<HTMLLIElement>, option: ParticipantOption) => {
      if ('firstname' in option) {
        return (
          <Box key={option.email} component="li" display="flex" {...props}>
            <Box mr={1}>
              <ParticipantAvatar
                src={setLibravatarOptions(option.avatarUrl, { defaultImage })}
              >{`${option.firstname} ${option.lastname}`}</ParticipantAvatar>
            </Box>
            <Stack>
              <Typography noWrap>
                {option.firstname} {option.lastname}
              </Typography>
              <Typography variant="caption" noWrap>
                {option.email}
              </Typography>
            </Stack>
          </Box>
        );
      }

      return null;
    },
};
