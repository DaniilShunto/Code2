// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../hooks';
import { selectDataProtectionUrl, selectImprintUrl } from '../../store/slices/configSlice';

const Container = styled('div')({
  width: '100%',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
});

const StyledLink = styled('a')(({ theme }) => ({
  color: theme.palette.common.white,
  textDecoration: 'none',
}));

const ImprintContainer = () => {
  const imprintUrl = useAppSelector(selectImprintUrl);
  const dataProtectionUrl = useAppSelector(selectDataProtectionUrl);

  const { t } = useTranslation();
  return (
    <Container data-testid={'ImprintContainer'} style={{}}>
      {imprintUrl && (
        <StyledLink href={imprintUrl} target="_blank">
          {t('imprint-label')}
        </StyledLink>
      )}
      {dataProtectionUrl && imprintUrl && ' - '}
      {dataProtectionUrl && (
        <StyledLink href={dataProtectionUrl} target="_blank">
          {t('data-protection-label')}
        </StyledLink>
      )}
    </Container>
  );
};

export default ImprintContainer;
