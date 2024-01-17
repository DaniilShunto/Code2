// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
//! Provides support for use with Browser Media, similar to the RTC submodule in lib-jitsi-meet
import { merge, cloneDeep } from 'lodash';

export type DeviceId = string & { readonly __tag: unique symbol };

export type ResolutionId =
  | '4k'
  | '2160'
  | '1080'
  | 'fullhd'
  | '720'
  | 'hd'
  | '540'
  | 'qhd'
  | '480'
  | 'vga'
  | '360'
  | '240'
  | '180';

export const IDEAL_RESOLUTION: ResolutionId = '720';

export interface VideoDimensions {
  width: number;
  height: number;
}

export const Resolutions: Record<ResolutionId, VideoDimensions> = {
  '2160': {
    width: 3840,
    height: 2160,
  },
  '4k': {
    width: 3840,
    height: 2160,
  },
  '1080': {
    width: 1920,
    height: 1080,
  },
  fullhd: {
    width: 1920,
    height: 1080,
  },
  '720': {
    width: 1280,
    height: 720,
  },
  hd: {
    width: 1280,
    height: 720,
  },
  '540': {
    width: 960,
    height: 540,
  },
  qhd: {
    width: 960,
    height: 540,
  },
  '480': {
    width: 640,
    height: 480,
  },
  vga: {
    width: 640,
    height: 480,
  },
  '360': {
    width: 640,
    height: 360,
  },
  '240': {
    width: 320,
    height: 240,
  },
  '180': {
    width: 320,
    height: 180,
  },
};

const minResolution = Resolutions['180'];
export const defaultResolution = Resolutions[IDEAL_RESOLUTION];

/**
 * Creates a constraints object to be passed into a call to getUserMedia.
 * Partial origin lib-jitsi-meet.
 * Changed to be used with a combined stream.
 *
 * @param {Object} options - Various values to be added to the constraints.
 * @param {Object} options.resolution - String identifier of the resolution lookup table.
 * @param {Object} options.constraints - Default constraints object to use
 * as a base for the returned constraints.
 * @param {Object} options.cameraDevice - The device id for the video
 * capture device to get video from.
 * @param {Object} options.micDevice - The device id for the audio capture
 * device to get audio from.
 * @param {Object} options.stereo - Use a stereo audio input, instead of mono.
 * @param {Object} options.noAutoGain - Disable automatic gain control for the
 * audio input.
 * @param {Object} options.noNoiseSuppression - Disable background noise
 * suppression for the audio input.
 * @param {Object} options.noEchoCancellation - Disable acoustic echo
 * cancellation for the audio input.
 */
export const getConstraints = (options?: {
  resolution?: ResolutionId;
  constraints?: MediaStreamConstraints;
  videoDevice?: DeviceId;
  audioInDevice?: DeviceId;
  stereo?: boolean;
  noAutoGain?: boolean;
  noNoiseSuppression?: boolean;
  noEchoCancellation?: boolean;
}): MediaStreamConstraints => {
  const constraints = cloneDeep(options?.constraints || { audio: true, video: true });

  if (constraints.video === true || typeof constraints.video === 'object') {
    const videoSettings: MediaTrackConstraints = {};

    const resolutionId = options?.resolution || IDEAL_RESOLUTION;
    const r = Resolutions[resolutionId];

    videoSettings.height = {
      min: Math.min(r.height, minResolution.height),
      ideal: r.height,
      max: Math.max(r.height, defaultResolution.height),
    };
    videoSettings.width = {
      min: Math.min(r.width, minResolution.width),
      ideal: r.width,
      max: Math.max(r.width, defaultResolution.width),
    };
    videoSettings.frameRate = { ideal: 25 }; // Safari 16.5 'min' and 'max' here
    videoSettings.deviceId = options?.videoDevice;

    if (typeof constraints.video === 'object') {
      // do not override custom settings
      constraints.video = merge(videoSettings, constraints.video);
    } else {
      constraints.video = videoSettings;
    }
  }

  if (constraints.audio === true || typeof constraints.audio === 'object') {
    const audioSettings: MediaTrackConstraints = {};

    audioSettings.deviceId = options?.audioInDevice;
    audioSettings.autoGainControl = options?.noAutoGain !== true;
    audioSettings.echoCancellation = options?.noEchoCancellation !== true;
    audioSettings.noiseSuppression = options?.noNoiseSuppression !== true;

    if (options?.stereo) {
      audioSettings.channelCount = 2;
    }

    if (typeof constraints.audio === 'object') {
      // do not override custom settings
      constraints.audio = merge(audioSettings, constraints.audio);
    } else {
      constraints.audio = audioSettings;
    }
  }

  return constraints;
};

const featureDetectionAudioEl = document.createElement('audio');
const isAudioOutputDeviceChangeAvailable = typeof featureDetectionAudioEl.setSinkId !== 'undefined';

/**
 * Sets current audio output device.
 * @param {string} deviceId - id of 'audiooutput' device from
 *      navigator.mediaDevices.enumerateDevices(), 'default' for default
 *      device
 * @returns {Promise} - resolves when audio output is changed, is rejected
 *      otherwise
 */
export const setAudioOutputDevice = async (deviceId: DeviceId): Promise<void> => {
  if (!isAudioOutputDeviceChangeAvailable) {
    throw new Error('Audio output device change is not supported');
  }
  await featureDetectionAudioEl.setSinkId(deviceId);
  console.log(`Audio output device set to ${deviceId}`);
};
