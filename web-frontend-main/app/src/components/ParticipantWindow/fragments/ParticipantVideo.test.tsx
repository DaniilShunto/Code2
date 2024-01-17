// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { VideoSetting } from '@opentalk/common';
import { cleanup } from '@testing-library/react';

import { idFromDescriptor } from '../../../modules/WebRTC';
import {
  render,
  screen,
  mockedVideoMediaDescriptor,
  mockStore,
  mockedParticipant,
  mockedScreenMediaDescriptor,
} from '../../../utils/testUtils';
import ParticipantVideo from './ParticipantVideo';

const { store } = mockStore(1, { video: true, screen: true });
const participant = mockedParticipant(0);
const participantId = participant.id;

const ParticipantWindowProps = {
  quality: VideoSetting.Low,
  fullscreenMode: false,
  participantId: participantId,
  presenterVideoIsActive: true,
};

describe('ParticipantVideo', () => {
  afterEach(() => cleanup());

  test('render participantVideo component with video & screenShare streaming', async () => {
    await render(<ParticipantVideo {...ParticipantWindowProps} mediaRef="test" />, store);

    expect(screen.getByTestId(`remoteVideo-${idFromDescriptor(mockedVideoMediaDescriptor(0))}`)).toBeInTheDocument();
    expect(screen.getByTestId(`remoteVideo-${idFromDescriptor(mockedScreenMediaDescriptor(0))}`)).toBeInTheDocument();
    expect(screen.getByTestId('participantSreenShareVideo')).toBeInTheDocument();
  });

  test('render participantVideo component with video stream only', async () => {
    const { store } = mockStore(1, { video: true, screen: false });
    const participant = mockedParticipant(0);
    await render(
      <ParticipantVideo {...ParticipantWindowProps} participantId={participant.id} mediaRef="test" />,
      store
    );

    expect(screen.queryByTestId('participantSreenShareVideo')).not.toBeInTheDocument();
    expect(screen.getByTestId(`remoteVideo-${idFromDescriptor(mockedVideoMediaDescriptor(0))}`)).toBeInTheDocument();
  });

  test('render participantVideo component without any stream should only display avatar component', async () => {
    const { store } = mockStore(1, { video: false, screen: false });
    const participant = mockedParticipant(0);
    await render(
      <ParticipantVideo {...ParticipantWindowProps} participantId={participant.id} mediaRef="test" />,
      store
    );

    expect(screen.getByTestId('avatarContainer')).toBeInTheDocument();
    expect(screen.queryByTestId('participantSreenShareVideo')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`remoteVideo-${idFromDescriptor(mockedVideoMediaDescriptor(0))}`)
    ).not.toBeInTheDocument();
  });
});
