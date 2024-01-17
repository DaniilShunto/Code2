// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Container, Grid, MenuItem, SelectChangeEvent } from '@mui/material';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import Select from '.';

const items = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

export default {
  title: 'components/Select',
  component: Select,
  parameters: {
    controls: { include: [] },
  },
} as ComponentMeta<typeof Select>;

export const Basic: ComponentStory<typeof Select> = () => {
  const [selectedItem, setSelectedItem] = React.useState('Oliver Hansen');

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const {
      target: { value },
    } = event;
    setSelectedItem(value as typeof selectedItem);
  };

  return (
    <Container>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Select value={selectedItem} onChange={handleChange} label={'with label and fullWidth'} fullWidth>
            {items.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={6}>
          <Select value={selectedItem} onChange={handleChange} label={'with label and fullWidth'} fullWidth>
            {items.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item>
          <Select value={selectedItem} onChange={handleChange} label={'with label'}>
            {items.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item>
          <Select
            value={selectedItem}
            onChange={handleChange}
            label={'with label'}
            error
            helperText={'this is an error message'}
          >
            {items.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item>
          <Select value={selectedItem} onChange={handleChange} label={'with label'} checked>
            {items.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item>
          <Select value={selectedItem} onChange={handleChange} label={'with label'} disabled>
            {items.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item>
          <Select value={selectedItem} onChange={handleChange}>
            {items.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item>
          <Select value={selectedItem} onChange={handleChange} error helperText={'this is an error message'}>
            {items.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item>
          <Select value={selectedItem} onChange={handleChange} checked>
            {items.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item>
          <Select value={selectedItem} onChange={handleChange} disabled>
            {items.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
    </Container>
  );
};
