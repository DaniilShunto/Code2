// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Container, Grid, IconButton, InputAdornment, Typography } from '@mui/material';
import { CopyIcon } from '@opentalk/common';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import TextField from './TextField';

export default {
  title: 'components/TextField',
  component: TextField,
  parameters: {
    docs: {
      description: {
        component: 'This component wraps InputBase from Mui -> https://mui.com/api/button/',
      },
    },
    controls: { include: ['value', 'label'] },
  },
  argTypes: {
    value: {
      type: { name: 'string', required: false },
      defaultValue: 'Isolde Pushen',
    },
    label: {
      type: { name: 'string', required: false },
      defaultValue: 'Label me',
    },
  },
} as ComponentMeta<typeof TextField>;

export const Basic: ComponentStory<typeof TextField> = (props) => (
  <Container sx={{ overflow: 'auto' }}>
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item container spacing={2}>
        <Grid item xs={12}>
          <Typography variant={'h1'}>Primary</Typography>
        </Grid>
        <Grid item>
          <TextField {...props} />
        </Grid>
        <Grid item>
          <TextField
            label={'with Icon'}
            defaultValue={'copy me'}
            disabled
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => alert('copied')}
                  onMouseDown={() => alert('copied')}
                  edge="end"
                >
                  <CopyIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </Grid>
        <Grid item>
          <TextField
            label={'Icon and Active'}
            defaultValue={'active'}
            endAdornment={
              <InputAdornment position="end">
                <CopyIcon />
              </InputAdornment>
            }
          />
        </Grid>
        <Grid item>
          <TextField label={'error input'} defaultValue={'Error'} error helperText={'this is a helper text'} />
        </Grid>
        <Grid item>
          <TextField label={'Valid input'} defaultValue={'Iam valid'} checked />
        </Grid>
      </Grid>
      <Grid item container spacing={2}>
        <Grid item>
          <TextField defaultValue={'without label'} />
        </Grid>
        <Grid item>
          <TextField defaultValue={'without label error'} error helperText={'error message'} />
        </Grid>
        <Grid item>
          <TextField defaultValue={'without label valid'} checked />
        </Grid>
      </Grid>
      <Grid item container spacing={2}>
        <Grid item xs={6}>
          <TextField placeholder={'firstname'} label={'firstname'} fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField placeholder={'lastname'} label={'lastname'} fullWidth />
        </Grid>
        <Grid item xs={8}>
          <TextField placeholder={'city'} label={'city'} fullWidth />
        </Grid>
        <Grid item xs={4}>
          <TextField placeholder={'zipcode'} label={'zipcode'} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField
            placeholder={'bio'}
            label={'bio'}
            fullWidth
            multiline
            maxRows={5}
            defaultValue={
              'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
            }
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant={'h1'}>Secondary</Typography>
      </Grid>
      <Grid item container spacing={2}>
        <Grid item>
          <TextField {...props} color={'secondary'} />
        </Grid>
        <Grid item>
          <TextField
            color={'secondary'}
            label={'with Icon'}
            defaultValue={'copy me'}
            disabled
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => alert('copied')}
                  onMouseDown={() => alert('copied')}
                  edge="end"
                >
                  <CopyIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </Grid>
        <Grid item>
          <TextField
            color={'secondary'}
            label={'Icon and Active'}
            defaultValue={'active'}
            endAdornment={
              <InputAdornment position="end">
                <CopyIcon />
              </InputAdornment>
            }
          />
        </Grid>
        <Grid item>
          <TextField
            color={'secondary'}
            label={'error input'}
            defaultValue={'Error'}
            error
            helperText={'this is a helper text'}
          />
        </Grid>
        <Grid item>
          <TextField color={'secondary'} label={'Valid input'} defaultValue={'Iam valid'} checked />
        </Grid>
      </Grid>
      <Grid item container spacing={2}>
        <Grid item>
          <TextField color={'secondary'} defaultValue={'without label'} />
        </Grid>
        <Grid item>
          <TextField color={'secondary'} defaultValue={'without label error'} error helperText={'error message'} />
        </Grid>
        <Grid item>
          <TextField color={'secondary'} defaultValue={'without label valid'} checked />
        </Grid>
      </Grid>
      <Grid item container spacing={2}>
        <Grid item xs={6}>
          <TextField color={'secondary'} placeholder={'firstname'} label={'firstname'} fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField color={'secondary'} placeholder={'lastname'} label={'lastname'} fullWidth />
        </Grid>
        <Grid item xs={8}>
          <TextField color={'secondary'} placeholder={'city'} label={'city'} fullWidth />
        </Grid>
        <Grid item xs={4}>
          <TextField color={'secondary'} placeholder={'zipcode'} label={'zipcode'} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField
            color={'secondary'}
            placeholder={'bio'}
            label={'bio'}
            fullWidth
            multiline
            maxRows={5}
            defaultValue={
              'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
            }
          />
        </Grid>
      </Grid>
    </Grid>
  </Container>
);
