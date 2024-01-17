// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import browser from '../../modules/BrowserSupport';

const signature = browser.getBrowserSignature();

export const isBrowserConfirmed = () => {
  return browser.isSupported() || localStorage.getItem('browser-confirmed') == signature || false;
};

interface IProps {
  handleClick: () => void;
}

const ConfirmBrowserDialog = ({ handleClick }: IProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Dialog open aria-labelledby={t('wrong-browser-dialog-message')} fullWidth maxWidth={'xs'}>
      <DialogTitle>{t('wrong-browser-dialog-title')}</DialogTitle>
      <DialogContent>
        <Typography variant={'body2'}>{t('wrong-browser-dialog-message')}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClick} fullWidth>
          {t('wrong-browser-dialog-ok')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmBrowserDialog;
