// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Grid, InputAdornment, IconButton, Tooltip, CircularProgress, styled } from '@mui/material';
import { TextField, CopyIcon, notifications } from '@opentalk/common';
import { useTranslation } from 'react-i18next';

export enum FieldKeys {
  RoomLink = 'room-link',
  SipLink = 'sip-link',
  GuestLink = 'guest-link',
  RoomPassword = 'room-password',
  SharedFolderLink = 'shared-folder-link',
  SharedFolderPassword = 'shared-folder-password',
  LivestreamLink = 'livestream-link',
}

interface LinkFieldProps {
  fieldKey: FieldKeys;
  checked: boolean;
  value?: string | URL;
  setHighlightedField: (value: FieldKeys) => void;
  tooltip?: string;
  isLoading?: boolean;
}

const SpinnerAdornment = styled(InputAdornment)(({ theme }) => ({
  right: theme.typography.pxToRem(2),
}));

const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
  padding: theme.spacing(1),
  justifySelf: 'center',
  right: 5,
}));

const LinkField = ({ fieldKey, checked, value, setHighlightedField, tooltip, isLoading }: LinkFieldProps) => {
  const { t } = useTranslation();

  const handleClick = () => {
    if (value) {
      navigator.clipboard.writeText(value.toString()).then(() => {
        notifications.success(t(`dashboard-invite-to-meeting-copy-${fieldKey}-success`));
        setHighlightedField(fieldKey);
      });
    }
  };

  return (
    <Grid item xs={12} sm={6}>
      <Tooltip title={tooltip ?? ''}>
        <TextField
          label={t(`dashboard-invite-to-meeting-${fieldKey}-label`)}
          fullWidth
          disabled
          checked={checked}
          value={value ? value.toString() : '-'}
          endAdornment={
            isLoading ? (
              <SpinnerAdornment position="end">
                <LoadingSpinner />
              </SpinnerAdornment>
            ) : (
              <InputAdornment position="end">
                <IconButton
                  aria-label={t(`dashboard-invite-to-meeting-copy-${fieldKey}-aria-label`)}
                  onClick={handleClick}
                  edge="end"
                  disabled={!value}
                >
                  <CopyIcon />
                </IconButton>
              </InputAdornment>
            )
          }
        />
      </Tooltip>
    </Grid>
  );
};

export default LinkField;
