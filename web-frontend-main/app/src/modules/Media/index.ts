// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { defaultResolution, VideoDimensions } from './MediaUtils';

export const silentTrack = (): MediaStreamTrack => {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const dst = ctx.createMediaStreamDestination();
  oscillator.connect(dst);
  oscillator.start();
  const audioTrack = dst.stream.getAudioTracks()[0];
  audioTrack.enabled = false;
  return audioTrack;
};

export const getDimensions = (track: MediaStreamTrack): VideoDimensions | undefined => {
  const settings = track.getSettings();

  if (!settings.height || isNaN(settings.height) || !settings.width || isNaN(settings.width)) {
    return undefined;
  }
  return { height: settings.height, width: settings.width };
};

export const blackTrack = (dimensions?: VideoDimensions): MediaStreamTrack => {
  const { width, height } = dimensions || defaultResolution;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillRect(0, 0, width, height);
  const stream = canvas.captureStream();
  const videoTrack = stream.getVideoTracks()[0];
  videoTrack.enabled = false;
  return videoTrack;
};
