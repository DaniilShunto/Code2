// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ButtonUnstyled } from '@mui/base';
import { Input, styled } from '@mui/material';
import { AddIcon, RemoveIcon } from '@opentalk/common';
import React, { useState } from 'react';

const ChangeValueButton = styled(ButtonUnstyled)(({ theme }) => ({
  fontSize: '1rem',
  cursor: 'pointer',
  width: '2.5rem',
  boxShadow: 'none',
  border: 'none',
  backgroundColor: theme.palette.secondary.lighter,
  borderRadius: 0,
  padding: 0,
  margin: 0,
  display: 'flex',

  '&:disabled': {
    opacity: 0.4,
  },
  '& svg': {
    fill: theme.palette.text.primary,
    width: '1rem',
    height: '1rem',
    margin: 'auto',
  },
}));

const MuiInput = styled(Input)({
  padding: 0,
  margin: 0,
  width: '3rem',
  border: 'none',
  borderRadius: 0,
  '& input': {
    textAlign: 'center',
    padding: 0,
    MozAppearance: 'textfield',
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
    },
  },
  '&:hover': {
    border: 'none',
  },
});

const InputComponent = styled('div')(({ theme }) => ({
  display: 'inline-flex',
  overflow: 'hidden',
  height: '2.5rem',
  border: '2px solid transparent',
  borderRadius: theme.borderRadius.large,

  '&:hover': {
    borderColor: theme.palette.primary.dark,
  },
}));

interface CustomEvent {
  target: {
    name?: string;
    value: number;
  };
}

export interface CustomNumberInputProps {
  name?: string;
  inputProps: { min: number; max: number };
  value?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement> | CustomEvent) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement> | CustomEvent) => void;
}

const NumberInput = ({ onBlur, onChange, ...props }: CustomNumberInputProps) => {
  const max = props.inputProps.max || 2;
  const min = props.inputProps.min || 0;
  const [value, setState] = useState<number>(props.value || min);

  const increaseValue = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (value >= max) return;

    setState(value + 1);
    const evt: CustomEvent = { target: { name: props.name, value: value + 1 } };
    onChange && onChange(evt);
  };

  const decreaseValue = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (value <= min) return;

    setState(value - 1);
    const evt: CustomEvent = { target: { name: props.name, value: value - 1 } };
    onChange && onChange(evt);
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: number) => {
    setState(newValue);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange && onChange(event as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleOnBlur = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element> | React.ChangeEvent<HTMLInputElement>
  ) => {
    if (isNaN(value)) {
      setState(min);
    } else if (value < min) {
      setState(min);
    } else if (value > max) {
      setState(max);
    } else {
      setState(value);
    }
    onChange && onChange(event as React.ChangeEvent<HTMLInputElement>);
    onBlur && onBlur(event as React.FocusEvent<HTMLInputElement>);
  };

  return (
    <InputComponent>
      <ChangeValueButton disabled={value <= min} data-testid="decButton" onClick={decreaseValue}>
        <RemoveIcon />
      </ChangeValueButton>
      <MuiInput
        type="number"
        onFocus={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
          e.target.select();
        }}
        onBlur={(e) => handleOnBlur(e)}
        name={props.name}
        inputProps={{
          ...props.inputProps,
        }}
        value={value}
        disableUnderline
        onChange={(e) => handleOnChange(e, parseInt(e.currentTarget.value))}
      ></MuiInput>
      <ChangeValueButton disabled={value >= max} data-testid="incButton" onClick={increaseValue}>
        <AddIcon />
      </ChangeValueButton>
    </InputComponent>
  );
};

export default NumberInput;
