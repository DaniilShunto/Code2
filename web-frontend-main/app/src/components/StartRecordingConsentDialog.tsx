// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

type ConsentDialogProps = { onAcceptButton: () => void; onDeclineButton: () => void };

const StartRecordingConsentDialog = ({ onAcceptButton, onDeclineButton }: ConsentDialogProps) => {
  const { t } = useTranslation();
  return (
    <Stack spacing={1}>
      <Typography>{t('recording-consent-message')}</Typography>
      <Box justifyContent="end" display="flex" gap={1}>
        <Button variant={'contained'} color={'primary'} onClick={onAcceptButton}>
          {t('recording-accept')}
        </Button>
        <Button variant={'contained'} color={'secondary'} onClick={onDeclineButton}>
          {t('recording-decline')}
        </Button>
      </Box>
    </Stack>
  );
};

export default StartRecordingConsentDialog;
