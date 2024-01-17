// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { FormControlLabel, Radio } from '@mui/material';

import { render, screen, configureStore, fireEvent } from '../../utils/testUtils';
import RadioGroup from './RadioGroup';

const radioButtons = ['one', 'two', 'three'];

describe('render RadioGroup component', () => {
  test('render all elements', async () => {
    await render(<RadioGroup />);

    expect(screen.getByTestId('radioGroupTest')).toBeInTheDocument();
  });
});

describe('render RadioGroup component with buttons', () => {
  test('render all elements', async () => {
    const { store } = configureStore();
    await render(
      <RadioGroup>
        {radioButtons.map((value) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio size="medium" color="secondary" />}
            label={value}
          />
        ))}
      </RadioGroup>,
      store
    );

    expect(screen.getByTestId('radioGroupTest')).toBeInTheDocument();
    expect(screen.getByDisplayValue('one')).toBeInTheDocument();
    expect(screen.getByDisplayValue('two')).toBeInTheDocument();
    expect(screen.getByDisplayValue('three')).toBeInTheDocument();
  });
});

describe('testing clikc on radio button', () => {
  const mockOnChange = jest.fn();
  test('render all elements', async () => {
    const { store } = configureStore();
    await render(
      <RadioGroup onChange={mockOnChange}>
        {radioButtons.map((value) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio size="medium" color="secondary" data-testid={value} />}
            label={value}
          />
        ))}
      </RadioGroup>,
      store
    );

    expect(screen.getByTestId('radioGroupTest')).toBeInTheDocument();

    expect(screen.getByDisplayValue('one')).toBeInTheDocument();
    expect(screen.getByDisplayValue('two')).toBeInTheDocument();
    expect(screen.getByDisplayValue('three')).toBeInTheDocument();

    const radioBtn = screen.getByTestId('two') as HTMLInputElement;
    await fireEvent.click(radioBtn, { target: { checked: true } });
    expect(radioBtn.checked).toEqual(true);
  });
});
