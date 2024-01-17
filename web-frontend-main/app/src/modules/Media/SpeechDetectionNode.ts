// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
// Hysteresis values in dB to avoid jitter
// The values are experimental
const SPEECH_DETECTION_THRESHOLD_HIGH = -35; // dB
const SPEECH_DETECTION_THRESHOLD_LOW = -45; // dB

/*
 * SpeechDetectionNode
 * Used to detect, if the audio signal contains speech
 * Current design implies, that the input shall be connected to the VoiceFilter
 */
export class SpeechDetectionNode extends AudioWorkletNode {
  private isUserSpeaking = false;
  private readonly onChange: (value: boolean) => void;

  static async loadWorklet(context: AudioContext) {
    await context.audioWorklet.addModule('/workers/speech-detection-processor.js');
  }

  /**
   * Create a SpeechDetectionNode
   *
   * @param context The parent AudioContext
   * @param onChange The event handler that is called when speech detection changes.
   *
   */
  constructor(context: AudioContext, onChange: (value: boolean) => void) {
    super(context, 'speech-detection-processor', {
      numberOfInputs: 1,
      numberOfOutputs: 0,
      channelCount: 1,
      processorOptions: {
        activation: SPEECH_DETECTION_THRESHOLD_HIGH,
        release: SPEECH_DETECTION_THRESHOLD_LOW,
      },
    });

    this.onChange = onChange;

    this.port.onmessage = (event) => {
      this.onChange(event.data);
      this.isUserSpeaking = event.data;
    };
    this.port.start();
  }

  close() {
    this.port.postMessage({ close: true });
  }
}
