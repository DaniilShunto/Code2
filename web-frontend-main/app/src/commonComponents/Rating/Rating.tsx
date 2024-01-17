// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Rating as MuiRating, RatingProps, styled } from '@mui/material';
import { FormWrapper, FormProps } from '@opentalk/common';
import React from 'react';

const Rating = React.forwardRef<HTMLInputElement, RatingProps & FormProps>(
  ({ label, error, helperText, ...props }, ref) => {
    const Ratings = styled(MuiRating)(({ theme }) => ({
      '&.MuiRating-root': {
        display: 'flex',
        '& .MuiRating-icon, & .MuiRating-iconEmpty': {
          color: theme.palette.primary.main,
        },
      },
    }));

    return (
      <FormWrapper label={label} helperText={helperText} error={error} inline={true}>
        <Ratings {...props} ref={ref} />
      </FormWrapper>
    );
  }
);

export default Rating;
