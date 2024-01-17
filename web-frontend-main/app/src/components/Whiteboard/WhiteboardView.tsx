// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import React from 'react';

import { useAppSelector } from '../../hooks';
import { selectWhiteboardUrl } from '../../store/slices/whiteboardSlice';

const WhiteboardIframe = styled('iframe')({
  height: '100%',
  width: '100%',
  display: 'block',
  border: 0,
});

const WhiteboardView = () => {
  const whiteboardUrl = useAppSelector(selectWhiteboardUrl);

  return <WhiteboardIframe src={whiteboardUrl} />;
};

export default WhiteboardView;
