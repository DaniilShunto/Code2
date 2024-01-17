// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Popover, styled, Typography, Stack } from '@mui/material';
import { SecureIcon as DefaultSecureIcon } from '@opentalk/common';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SecureIconSmall = styled(DefaultSecureIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  //Overrides parent fontsize
  '&.MuiSvgIcon-root': {
    fontSize: theme.typography.pxToRem(24),
  },
}));

const SecureIconBig = styled(DefaultSecureIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  width: '5em',
  height: '5em',
  padding: theme.spacing(1),
}));

const SecureConnectionField = () => {
  const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null);
  const { t } = useTranslation();

  const handlePopoverOpen = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <SecureIconSmall
        aria-label="secure-connection-icon"
        aria-owns={open ? 'secure-connection-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <Popover
        id="secure-connection-popover"
        // Prevents flickering for onMouseEnter/Leave
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        // Modifies the background color according to requirements
        PaperProps={{ sx: { backgroundColor: 'rgb(56, 88, 101)' } }}
      >
        <Stack direction="row" alignItems={'center'} maxWidth={'20em'}>
          <SecureIconBig />
          <Typography>{t('secure-connection-message')}</Typography>
        </Stack>
      </Popover>
    </>
  );
};

export default SecureConnectionField;
