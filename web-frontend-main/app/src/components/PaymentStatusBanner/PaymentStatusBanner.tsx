// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Alert, Button, styled } from '@mui/material';
import { useTranslation, Trans } from 'react-i18next';

import { useGetMeTariffQuery, useGetMeQuery } from '../../api/rest';
import { useAppSelector } from '../../hooks';
import { selectAccountManagementUrl } from '../../store/slices/configSlice';

const FALLBACK_TARIFF_NAME = '';

const PaymentAlert = styled(Alert)(({ theme }) => ({
  borderRadius: theme.borderRadius.medium,
  marginLeft: theme.spacing(19.5),
  lineHeight: theme.spacing(2.5),
  '& .MuiButton-root': {
    marginTop: theme.spacing(0.5),
  },
  '& .MuiAlert-message': {
    marginLeft: theme.spacing(1),
  },
}));

const TariffDowngradedBanner = () => {
  const { t } = useTranslation();
  const accountManagementUrl = useAppSelector(selectAccountManagementUrl);
  const { data: tariff } = useGetMeTariffQuery();
  const tariffName = tariff?.name ?? FALLBACK_TARIFF_NAME;
  return (
    <PaymentAlert
      icon={false}
      variant="filled"
      severity="error"
      // shall be read by screen-reader only after query response
      aria-hidden={tariffName === FALLBACK_TARIFF_NAME}
      action={
        <Button
          size={'medium'}
          onClick={() => {
            window.open(accountManagementUrl, '_self');
          }}
          focusRipple
        >
          {t('dashboard-add-payment-button')}
        </Button>
      }
    >
      <Trans i18nKey={'dashboard-payment-status-downgraded'} values={{ tariffName }} />
    </PaymentAlert>
  );
};

const PaymentStatusBanner = () => {
  const { data: me } = useGetMeQuery();
  const tariffStatus = me?.tariffStatus;

  if (tariffStatus === 'downgraded') {
    return <TariffDowngradedBanner />;
  }

  return null;
};

export default PaymentStatusBanner;
