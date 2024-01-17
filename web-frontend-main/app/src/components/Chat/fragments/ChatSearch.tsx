// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { InputAdornment, styled } from '@mui/material';
import { CloseIcon, SearchIcon } from '@opentalk/common';
import i18next from 'i18next';
import { ChangeEvent, ForwardedRef, forwardRef, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { TextField } from '../../../commonComponents';

interface EndAdornmentProps {
  onClick(): void;
  className?: string;
  hasValue?: boolean;
}

interface ChatSearchProps {
  value: string;
  onChange(nextValue: string): void;
}

const SearchField = styled(TextField)({
  '&': {
    marginTop: 0,
  },
  '*::-webkit-search-cancel-button': {
    display: 'none',
  },
});

const startAdornment = (
  <InputAdornment position="start">
    <SearchIcon />
  </InputAdornment>
);

const EndAdornment = styled((props: EndAdornmentProps) => (
  <InputAdornment
    component="button"
    type="reset"
    position="end"
    tabIndex={0}
    onClick={props.hasValue ? props.onClick : undefined}
    className={props.className}
    aria-label={i18next.t('global-clear')}
  >
    {props.hasValue && <CloseIcon />}
  </InputAdornment>
))(({ hasValue, theme }) => ({
  cursor: hasValue ? 'pointer' : 'text',
  pointerEvents: hasValue ? 'auto' : 'none',
  width: theme.spacing(2),
  height: theme.spacing(2),
  background: 'transparent',
  border: 'none',
  padding: 0,
}));

const DummyBlock = styled(() => <div role="presentation" aria-hidden={true} />)(({ theme }) => ({
  width: theme.spacing(2),
  height: theme.spacing(2),
}));

const ChatSearch = (props: ChatSearchProps, ref: ForwardedRef<HTMLInputElement>) => {
  const { t } = useTranslation();
  const hasValue = props.value !== '';

  const onChangeMiddleware = (event: ChangeEvent<HTMLInputElement>) => {
    props.onChange(event.target.value);
  };

  const clear = () => {
    props.onChange('');
  };

  const onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      clear();
    }
  };

  return (
    <SearchField
      inputRef={ref}
      size="small"
      placeholder={t('input-search-placehoder')}
      type="search"
      fullWidth={true}
      startAdornment={startAdornment}
      value={props.value}
      // We have to use empty adornment in order to keep layout persistant when clear icon changes visibility.
      endAdornment={hasValue ? <EndAdornment onClick={clear} hasValue={hasValue} /> : <DummyBlock />}
      onChange={onChangeMiddleware}
      onKeyUp={onKeyUp}
    />
  );
};

export default forwardRef(ChatSearch);
