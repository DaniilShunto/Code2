// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { MediaSessionType, VideoSetting } from '@opentalk/common';
import { uniqBy, isEqual } from 'lodash';

import { blackTrack, getDimensions, silentTrack } from '.';
import { BaseEventEmitter } from '../EventListener';
import { ConferenceRoom } from '../WebRTC';
import { PublisherConnection } from '../WebRTC/PublisherConnection';
import { BackgroundBlur, BackgroundConfig } from './BackgroundBlur';
import { LevelNode } from './LevelNode';
import { DeviceId, getConstraints } from './MediaUtils';
import { SpeechDetectionNode } from './SpeechDetectionNode';
import { getVoiceFilter } from './VoiceFilter';

interface MediaConfig {
  audio: boolean;
  video: boolean;
  backgroundConfig: BackgroundConfig;
  audioInDevice?: DeviceId;
  videoDevice?: DeviceId;
}

export type LocalMediaEvent = {
  deviceChanged: { deviceId: DeviceId; kind: 'audio' | 'video' };
  backgroundChanged: BackgroundConfig;
  stateChanged: { kind: 'audio' | 'video'; enabled: boolean };
  isUserSpeaking: boolean;
};

// Currently we use the level node to update the animation of the audio indicator
// We agree, that 30 Hz would be enough. Therefore (1 / 30 Hz ) = 33 ms
const ANIMATION_UPDATE_TIME = 33; // ms

/**
 * The LocalMedia manages the local audio and video device.
 * - It also publishes the stream to the WebRTC context when available.
 * - It is a singleton to ensure that there is only one instance to control device access.
 *   Releasing unused mediaTracks is essential -- do not use getUserMedia anywhere else in the application.
 * - Provides a stable `outputMediaStream` for monitoring purpose.
 */
export class LocalMedia extends BaseEventEmitter<LocalMediaEvent> {
  private static instance?: LocalMedia;

  static getInstance() {
    if (!LocalMedia.instance) {
      LocalMedia.instance = new LocalMedia();
    }
    return LocalMedia.instance;
  }

  static async enumerateDevices() {
    const rawDevices = await navigator.mediaDevices.enumerateDevices();
    // filter out duplicate deviceId's -- work around Browser / OS bugs
    return uniqBy(rawDevices, (d) => `${d.deviceId || d.groupId}/${d.kind}`).map((d) => {
      //deviceId may be empty in Chrome as anti-fingerprinting measure
      if (d.deviceId === '') {
        return d;
      }
      const devKey = `mediaDev:${d.deviceId}`;
      if (d.label && d.label !== '') {
        window.localStorage.setItem(devKey, d.label);
        return d;
      } else {
        const label = window.localStorage.getItem(devKey);
        if (label && label !== '') {
          return { deviceId: d.deviceId, groupId: d.groupId, kind: d.kind, label } as MediaDeviceInfo;
        } else {
          return d;
        }
      }
    });
  }
  private static permissions = { audio: false, video: false };

  private connection?: PublisherConnection;
  private conference?: ConferenceRoom;
  private blurringFx?: BackgroundBlur;

  private backgroundConfig: BackgroundConfig = { style: 'off' };

  private audioInDeviceId?: DeviceId;
  private videoDeviceId?: DeviceId;

  private _deviceTracks: MediaStreamTrack[] = [];
  private _inProgress = false;

  private qualityCap: VideoSetting = VideoSetting.High;

  /**
   * The media stream that is published when connected.
   * The object reference is kept stable,
   * only tracks are exchanged during runtime.
   */
  public readonly outputMediaStream = new MediaStream([blackTrack(), silentTrack()]);

  private _audioContext?: Promise<AudioContext> = undefined; // with worklets loaded;

  private sourceNode?: MediaStreamAudioSourceNode;
  private levelNode?: LevelNode;
  private speechDetectionNode?: SpeechDetectionNode;

  public async loadAudioWorkletContext() {
    if (this._audioContext !== undefined) {
      const ctx = await this._audioContext;
      await ctx.resume();
      return ctx;
    }
    if (!window.AudioContext && !window.webkitAudioContext) {
      throw new Error('AudioContext is not supported');
    }
    // This may create a suspended context and warn in Chrome
    const audioContext = new AudioContext({
      latencyHint: 'interactive',
    });

    if (!audioContext.audioWorklet) {
      throw new Error('AudioContext has no Worklet support');
    }

    this._audioContext = Promise.all([
      LevelNode.loadWorklet(audioContext),
      SpeechDetectionNode.loadWorklet(audioContext),
    ]).then(() => {
      return audioContext;
    });

    return this._audioContext;
  }

  /**
   * @returns {Promise<LevelNode>} - The AudioNode for the level meter of the audio input.
   */
  public getAudioLevel() {
    return this.levelNode?.level;
  }

  private constructor() {
    super();
  }

  /*
   * @returns {boolean} - Is true when output stream has an active audio track (the microphone is on).
   */
  public isAudioEnabled() {
    return this.outputMediaStream.getAudioTracks().find((t) => t.enabled && t.readyState === 'live') !== undefined;
  }

  /*
   * @returns {boolean} - Is true when output stream has an active video track (the camera is on).
   */
  public isVideoEnabled() {
    return this.outputMediaStream.getVideoTracks().find((t) => t.enabled && t.readyState === 'live') !== undefined;
  }

  /*
   * @returns {boolean} - Is true when any audio input device is active; even when it is muted.
   */
  public isAudioRunning() {
    const deviceAudioTracks = this._deviceTracks.filter((t) => t.kind === 'audio' && t.readyState === 'live');
    return deviceAudioTracks.length > 0;
  }

  private replaceTrack = async (track: MediaStreamTrack) => {
    const oldTrack = this.outputMediaStream.getTracks().find((t) => t.kind === track.kind);
    if (oldTrack) {
      oldTrack.stop();
      this.outputMediaStream.removeTrack(oldTrack);
    }
    this.outputMediaStream.addTrack(track);
    await this.connection?.replacedTrack(track.id);
  };

  private async haltAudio(replace = true) {
    this.sourceNode?.disconnect();
    this.sourceNode = undefined;
    if (replace) {
      await this.replaceTrack(silentTrack());
    } else {
      const oldTrack = this.outputMediaStream.getTracks().find((t) => t.kind === 'audio');
      oldTrack?.stop();
    }
    const audioContext = await this._audioContext;
    if (audioContext?.state === 'running') {
      await audioContext.suspend();
    }
  }

  private stoppedAudioHandler = async () => {
    console.warn('Audio track ended spontaneous');
    await this.haltAudio();
    this.eventEmitter.emit('stateChanged', { kind: 'audio', enabled: false });
  };

  private async haltVideo(replace = true) {
    const videoTrack = this.outputMediaStream.getVideoTracks()[0];
    if (videoTrack === undefined) {
      console.warn('stopped camera stream has no video track');
    } else {
      const dimensions = getDimensions(videoTrack);
      if (replace) {
        await this.replaceTrack(blackTrack(dimensions));
      }
    }

    if (this.blurringFx) {
      this.blurringFx.stop();
    }
  }

  private stoppedVideoHandler = async () => {
    console.warn('Video track ended spontaneous');
    await this.haltVideo();
    this.eventEmitter.emit('stateChanged', { kind: 'video', enabled: false });
  };

  private readonly shutdownHandler = () => {
    this.conference?.removeEventListener('shutdown', this.shutdownHandler);
    this.conference = undefined;
    this.connection = undefined;
  };

  /**
   * Add a WebRTC context when a conference session starts.
   * Will create a connection and publish the current `outgoingMediaStream` when enabled.
   *
   * @param {ConferenceRoom} conference - The current WebRTC context, which holds all connections of this session
   */
  public updateConferenceContext = async (conference: ConferenceRoom) => {
    this.conference = conference;
    this.conference.addEventListener('shutdown', this.shutdownHandler);

    if (this.isAudioEnabled() || this.isVideoEnabled()) {
      await this.publishStream();
    }
  };

  /**
   * Release all media devices and close publishing connections.
   * Will in turn reset state for signal processing like auto gain.
   * (all media indicators will turn off)
   */
  public async release() {
    this.connection?.close();
    this.connection = undefined;
    this.conference?.removeEventListener('shutdown', this.shutdownHandler);
    this.conference = undefined;
    this.levelNode?.close();
    this.levelNode = undefined;
    this.speechDetectionNode?.close();
    this.levelNode = undefined;

    await Promise.allSettled([this.haltVideo(), this.haltAudio()])
      .catch((e) => console.error('failed to release media devices:', e))
      .finally(() => {
        this._deviceTracks.forEach((t) => {
          t.dispatchEvent(new Event('ended'));
          t.stop();
        });
        this._deviceTracks = [];
      });
    this._audioContext?.then((ctx) => ctx.close());
    this._audioContext = undefined;
  }

  private registerDeviceTracks(tracks: Array<MediaStreamTrack>) {
    // cleanup ended tracks
    this._deviceTracks = this._deviceTracks.filter((t) => t.readyState === 'live');

    tracks.forEach((t) => {
      switch (t.kind) {
        case 'audio':
          t.onended = this.stoppedAudioHandler;
          break;
        case 'video':
          t.onended = this.stoppedVideoHandler;
          break;
      }
      this._deviceTracks.push(t);
    });
  }

  private getUserMedia = async (
    { audio, video, videoDevice, audioInDevice, backgroundConfig }: MediaConfig,
    permissionOnly = false
  ) => {
    const constraints = getConstraints({
      constraints: { audio, video },
      videoDevice,
      audioInDevice,
    });

    // release old tracks but do not replace it yet
    if (audio) {
      await this.haltAudio(false);
    }
    if (video) {
      await this.haltVideo(false);
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.registerDeviceTracks(stream.getTracks());

    if (video) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack === undefined) throw new Error('Failed to acquire video track');

      LocalMedia.permissions.video = true;
      if (permissionOnly) {
        videoTrack.stop();
        return;
      }
      await this.handleVideoChanged(videoTrack, backgroundConfig);
    }

    if (audio) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack === undefined) throw new Error('Failed to acquire audio track');
      LocalMedia.permissions.audio = true;
      if (permissionOnly) {
        audioTrack.enabled = false;
      }
      await this.handleAudioChanged(audioTrack);
    }
  };

  /*
   *
   * Here we construct audio graph for processing audio signal,
   * which is coming from the local media (own microphone).
   *
   * Vu meter uses unfiltered signal, to measure level, peak and clip.
   * In contrast speech detection relies on the voice filter.
   *      ____________       _____________       _____________
   *     |            |     |             |     |             | --> level
   * --> | Microphone | --> | Source Node | *-> | LevelNode   | --> peak
   *     |____________|     |_____________| |   |_____________| --> clip
   *                                        |    _____________       _____________________
   *                                        |   |             |     |                     |
   *                                         -->| VoiceFilter | --->| SpeechDetectionNode | ---> speechDetected
   *                                            |_____________|     |_____________________|
   *
   *
   *
   */
  private async handleAudioChanged(audioTrack: MediaStreamTrack) {
    this.sourceNode?.disconnect();
    this.sourceNode = undefined;
    this.levelNode?.disconnect();
    this.levelNode = undefined;
    this.speechDetectionNode?.disconnect();
    this.speechDetectionNode = undefined;

    const audioContext = await this.loadAudioWorkletContext();
    this.sourceNode = audioContext.createMediaStreamSource(new MediaStream([audioTrack]));
    const voiceFilter = getVoiceFilter(audioContext);
    this.levelNode = new LevelNode(audioContext, ANIMATION_UPDATE_TIME);
    this.speechDetectionNode = new SpeechDetectionNode(audioContext, (isUserSpeaking) =>
      this.eventEmitter.emit('isUserSpeaking', isUserSpeaking)
    );

    this.sourceNode.connect(this.levelNode);
    this.sourceNode.connect(voiceFilter);
    voiceFilter.connect(this.speechDetectionNode);

    await this.replaceTrack(audioTrack);
  }

  private async handleVideoChanged(videoTrack: MediaStreamTrack, backgroundConfig: BackgroundConfig) {
    let outputVideoTrack: MediaStreamTrack;

    if (backgroundConfig.style !== 'off') {
      if (this.blurringFx === undefined) {
        this.blurringFx = await BackgroundBlur.create();
      }
      outputVideoTrack = await this.blurringFx.start(videoTrack, backgroundConfig);
    } else {
      if (this.blurringFx?.isEnabled()) {
        this.blurringFx.stop();
      }
      outputVideoTrack = videoTrack;
    }
    await this.replaceTrack(outputVideoTrack);
  }

  /**
   * Request device permissions using getUserMedia(), which acquires the local media devices.
   * device are muted or released afterwards.
   * This is also useful to enable unrestricted network access for WebRTC
   *
   * @param {Partial<MediaConfig>} config - The target device configuration
   * @param {boolean | undefined} config.audio - audio enable flag
   * @param {boolean | undefined} config.video - video enable flag
   * @param {boolean | undefined} config.blurring - background blurring enable flag (no effect here)
   * @param {boolean | undefined} config.imgBackground - background image enable flag (no effect here)
   * @param {string | undefined} config.backgroundImageUrl - background image url
   * @param {DeviceId | undefined} config.audioInDevice - deviceId of the audio input device
   * @param {DeviceId | undefined} config.videoDevice - deviceId of the video input device
   */
  public async requestPermission(config: Partial<MediaConfig>) {
    const { videoDevice, audioInDevice } = config;
    const prevAudio = this.isAudioEnabled();
    const prevVideo = this.isVideoEnabled();
    const audio = !LocalMedia.permissions.audio && config.audio === true && !prevAudio;
    const video = !LocalMedia.permissions.video && config.video === true && !prevVideo;
    if (!(audio || video)) {
      return;
    }

    if (this._inProgress) {
      throw new Error('Called media update while in progress. race condition?');
    }
    this._inProgress = true;

    const requestConfig: MediaConfig = {
      audio,
      video,
      backgroundConfig: this.backgroundConfig,
      audioInDevice,
      videoDevice,
    };
    await this.getUserMedia(requestConfig, true).finally(() => {
      this._inProgress = false;
    });
  }

  /**
   * Reconfigure the local media devices using `navigator.mediaDevices.getUserMedia()`
   * and update or publish to the WebRTC context when online.
   *
   * Video and audio tracks are handled differently.
   * - Enabling and disabling a video track will acquire and released the underlying device,
   *   to let the hardware indicator match the state.
   * - On audio track the device is acquired on first use and just muted/enabled using `track.enable`.
   *   Releasing would reset the auto gain and noise suppression state,
   *   which needs several seconds to warm up again on startup.
   *
   * @param {Partial<MediaConfig>} config - The target device configuration
   * @param {boolean | undefined} config.audio - audio enable flag
   * @param {boolean | undefined} config.video - video enable flag
   * @param {boolean | undefined} config.blurring - background blurring enable flag
   * @param {boolean | undefined} config.backgroundImageEnabled - background image enable flag (no effect here)
   * @param {string | undefined} config.backgroundImageUrl - background image url
   * @param {DeviceId | undefined} config.audioInDevice - deviceId of the audio input device
   * @param {DeviceId | undefined} config.videoDevice - deviceId of the video input device
   */
  public async reconfigure(config: Partial<MediaConfig>) {
    const prevAudio = this.isAudioEnabled();
    const prevVideo = this.isVideoEnabled();
    const prevBackgroundConfig = this.backgroundConfig;
    const audio = config.audio === undefined ? prevAudio : config.audio;
    const video = config.video === undefined ? prevVideo : config.video;
    const audioInDevice = config.audioInDevice || this.audioInDeviceId;
    const videoDevice = config.videoDevice || this.videoDeviceId;
    const backgroundConfig = config.backgroundConfig || this.backgroundConfig;

    if (
      prevAudio === audio &&
      prevVideo === video &&
      isEqual(backgroundConfig, this.backgroundConfig) &&
      videoDevice === this.videoDeviceId &&
      audioInDevice === this.audioInDeviceId
    ) {
      console.warn('LocalMedia.reconfigure() called with the current config. skipping', config, this);
      return;
    }
    if (this._inProgress) {
      throw new Error('Called media update while in progress. race condition?');
    }
    this._inProgress = true;

    await this._reconfigure({
      audio,
      video,
      backgroundConfig,
      audioInDevice,
      videoDevice,
    }).finally(() => {
      this._inProgress = false;
    });

    // write config when successful
    if (config.videoDevice !== undefined) {
      this.videoDeviceId = config.videoDevice;
      this.eventEmitter.emit('deviceChanged', { kind: 'video', deviceId: config.videoDevice });
    }
    if (config.audioInDevice !== undefined) {
      this.audioInDeviceId = config.audioInDevice;
      this.eventEmitter.emit('deviceChanged', { kind: 'audio', deviceId: config.audioInDevice });
    }
    if (this.isAudioEnabled() !== prevAudio) {
      this.eventEmitter.emit('stateChanged', { kind: 'audio', enabled: this.isAudioEnabled() });
    }
    if (this.isVideoEnabled() !== prevVideo) {
      this.eventEmitter.emit('stateChanged', { kind: 'video', enabled: this.isVideoEnabled() });
    }

    if (!isEqual(this.backgroundConfig, prevBackgroundConfig)) {
      this.eventEmitter.emit('backgroundChanged', this.backgroundConfig);
    }
  }

  private async _reconfigure(config: MediaConfig) {
    const { audio, video, backgroundConfig, audioInDevice, videoDevice } = config;

    const audioSettingsChanged = audioInDevice !== this.audioInDeviceId;
    const videoSettingsChanged =
      !isEqual(this.backgroundConfig, backgroundConfig) || videoDevice !== this.videoDeviceId;

    let requestAudio: boolean;
    if (audioSettingsChanged) {
      requestAudio = audio;
      // when muted on audio device change, release track
      // but do only acquire the new device when enabled again
      if (!audio) {
        await this.haltAudio();
      }
    } else {
      requestAudio = audio && !this.isAudioRunning();
    }

    const requestVideo = video && (!this.isVideoEnabled() || videoSettingsChanged);
    if (requestAudio || requestVideo) {
      await this.getUserMedia({
        audio: requestAudio,
        video: requestVideo,
        audioInDevice,
        videoDevice,
        backgroundConfig,
      });
    }

    if (audio !== this.isAudioEnabled()) {
      this.outputMediaStream.getAudioTracks().forEach((track) => {
        track.enabled = audio;
      });

      this.connection?.trackUpdated();
    }

    if (video !== this.isVideoEnabled()) {
      if (video) {
        throw new Error('bad state: no video track when it was requested');
      }
      await this.haltVideo();
    }

    this.backgroundConfig = backgroundConfig;
    if (video || audio) {
      await this.publishStream();
    }
  }

  private async publishStream() {
    if (this.connection === undefined && this.conference !== undefined) {
      if (this.outputMediaStream.getAudioTracks().length === 0) {
        this.outputMediaStream.addTrack(silentTrack());
      }
      if (this.outputMediaStream.getVideoTracks().length === 0) {
        this.outputMediaStream.addTrack(blackTrack());
      }
      this.connection = await this.conference.createPublisher(
        MediaSessionType.Video,
        this.outputMediaStream,
        this.qualityCap
      );
      this.connection.addEventListener('closed', () => {
        this.connection = undefined;
      });
    }
  }

  /**
   * Configures the maximum quality and resolution of the published video track.
   * @param {VideoSetting} qualityCap - maximum quality
   */
  public setQuality(qualityCap: VideoSetting) {
    this.qualityCap = qualityCap;
    this.connection?.requestQuality(qualityCap);
  }
}

const localMediaContext = LocalMedia.getInstance();
export default localMediaContext;
