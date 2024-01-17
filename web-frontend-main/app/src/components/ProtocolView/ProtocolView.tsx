// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';

import { useAppSelector } from '../../hooks';
import { selectProtocolUrl } from '../../store/slices/protocolSlice';

const ProtocolIframe = styled('iframe')({
  height: '100%',
  width: '100%',
  display: 'block',
  border: 0,
});

const ProtocolView = () => {
  const protocolUrl = useAppSelector(selectProtocolUrl);
  return protocolUrl ? <ProtocolIframe src={protocolUrl.toString()} /> : null;
};

export default ProtocolView;
