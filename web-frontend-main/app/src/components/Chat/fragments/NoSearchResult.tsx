// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface NoSearchResultProps {
  onReset?: () => void;
}

const NoSearchResult = (props: NoSearchResultProps) => {
  const { t } = useTranslation();

  return (
    <Stack flex={1} spacing={2} justifyContent="center" alignItems="center">
      <Typography display="block" textAlign="center" component="span">
        {t('chat-no-search-results')}
      </Typography>
      <Button onClick={props.onReset}>{t('chat-search-reset')}</Button>
    </Stack>
  );
};

export default NoSearchResult;
