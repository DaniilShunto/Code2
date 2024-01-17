// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Dialog,
  DialogTitle,
  IconButton,
  Paper,
  TableContainer,
  Table,
  TableHead,
  Typography,
  useTheme,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { CloseIcon } from '@opentalk/common';
import { useTranslation } from 'react-i18next';

interface ShortcutListDialogProps {
  onClose: () => void;
  open: boolean;
}
const ShortcutListDialog = (props: ShortcutListDialogProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { onClose, open } = props;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={'xs'} PaperComponent={Paper}>
      <DialogTitle display="flex" alignItems="center" justifyContent="space-between">
        <Typography style={{ color: theme.palette.secondary.dark }}>{t('more-menu-keyboard-shortcuts')}</Typography>
        {onClose && (
          <IconButton aria-label="close-button" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      {/* TODO: Make shortcuts dynamic. */}
      <TableContainer component={Paper}>
        <Table padding="normal">
          <TableHead>
            <TableRow>
              <TableCell>{t('global-shortcut')}</TableCell>
              <TableCell>{t('global-description')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <code>m</code>
              </TableCell>
              <TableCell>
                <Typography fontWeight={300}>
                  {t('global-microphone')}&nbsp;{t('global-on')}/{t('global-off')}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>v</code>
              </TableCell>
              <TableCell>
                <Typography fontWeight={300}>
                  {t('global-video')}&nbsp;{t('global-on')}/{t('global-off')}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>f</code>
              </TableCell>
              <TableCell>
                <Typography fontWeight={300}>
                  {t('global-fullscreen')}&nbsp;{t('global-on')}/{t('global-off')}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>n</code>
              </TableCell>
              <TableCell>
                <Typography fontWeight={300}>{t('shortcut-pass-talking-stick')}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>{t('global-space')}</code>
              </TableCell>
              <TableCell>
                <Typography fontWeight={300}>{t('shortcut-hold-to-speak')}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  );
};

export default ShortcutListDialog;
