// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Container as MuiContainer } from '@mui/material';

import LayoutOptions from '../../../enums/LayoutOptions';
import { useAppSelector } from '../../../hooks';
import { useFullscreenContext } from '../../../hooks/useFullscreenContext';
import { selectCinemaLayout } from '../../../store/slices/uiSlice';
import FullscreenView from '../../FullscreenView';
import GridView from '../../GridView';
import ProtocolView from '../../ProtocolView';
import SpeakerView from '../../SpeakerView';
import WhiteboardView from '../../Whiteboard';

const Container = styled(MuiContainer)({
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
});

const Cinema = () => {
  const userLayout = useAppSelector(selectCinemaLayout);
  const fullscreenHandle = useFullscreenContext();

  const renderView = () => {
    if (fullscreenHandle.active) {
      return <FullscreenView />;
    } else {
      switch (userLayout) {
        case LayoutOptions.Speaker:
          return <SpeakerView />;
        case LayoutOptions.Whiteboard:
          return <WhiteboardView />;
        case LayoutOptions.Protocol:
          return <ProtocolView />;
        case LayoutOptions.Grid:
        default:
          return <GridView />;
      }
    }
  };

  return (
    <Container disableGutters maxWidth={false} ref={fullscreenHandle.node}>
      {renderView()}
    </Container>
  );
};

export default Cinema;
