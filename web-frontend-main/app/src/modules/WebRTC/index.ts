// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { VideoSetting } from '@opentalk/common';

import { ConferenceRoom } from './ConferenceRoom';
import { MediaDescriptor } from './WebRTC';

export { ConferenceRoom };
export { WebRtc, idFromDescriptor, descriptorFromId } from './WebRTC';
export type { MediaDescriptor, MediaId, SubscriberConfig, SubscriberStateChanged, QualityLimit } from './WebRTC';

/* TODO: find a better place to hold the ConferenceRoom state object.
  options:
   - a RoomProvider, but not accessible from the middleware
   - in the store, but it is not serializable
   - a singleton as global state
 */

export const PACKET_LOSS_THRESHOLD = 0.1; //10%
let currentConferenceRoom: ConferenceRoom | undefined = undefined;

export const setCurrentConferenceRoom = (room: ConferenceRoom) => {
  currentConferenceRoom = room;
  const shutdownHandler = () => {
    currentConferenceRoom?.removeEventListener('shutdown', shutdownHandler);
    currentConferenceRoom = undefined;
  };
  currentConferenceRoom.addEventListener('shutdown', shutdownHandler);
};

export const getCurrentConferenceRoom = () => {
  return currentConferenceRoom;
};

export const getMediaStream = (descriptor: MediaDescriptor) => {
  if (currentConferenceRoom === undefined) {
    throw new Error('can not requestVideoQuality form conferenceContext');
  }
  return currentConferenceRoom.webRtc.getMediaStream(descriptor);
};

export const requestVideoQuality = (descriptor: MediaDescriptor, quality: VideoSetting, mediaRef: string) => {
  if (currentConferenceRoom === undefined) {
    if (quality === VideoSetting.Off) {
      return;
    }
    throw new Error('can not requestVideoQuality form conferenceContext');
  }
  currentConferenceRoom.webRtc.requestQuality(descriptor, quality, mediaRef);
};

export const shutdownConferenceContext = () => {
  if (currentConferenceRoom === undefined) {
    throw new Error('conferenceContext already shut');
  }
  currentConferenceRoom.shutdown();
};
