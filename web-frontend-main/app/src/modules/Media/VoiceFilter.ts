// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

/*
 * Voice filter is designed as elliptic / Cauer bandpass filter
 * It was calculated by an Octave model from the Octave 'signal' package documentation (see references).
 * The model returns two coefficient rows of the filter transfer function [a, b], which
 * can be applied directly to the IIR Filter Node of the Web Audio API as [feedback, feedforward] parameters respectively.
 *
 * !!! Important note !!!:
 * IIR Filter node of the Web Audio API has stability problems with higher order filters.
 * Filters, which are above the 5th order become unstable.
 *
 * References:
 * - https:*octave.sourceforge.io/signal/function/ellipord.html -> Demo 8
 * - https:*webaudio.github.io/web-audio-api/#IIRFilterNode-filter-definition
 *
 * fpass = [300 2400];
 * fstop = [150 3000];
 * Rpass = 3;
 * Rstop = 10;
 *
 */

export function getVoiceFilter(context: AudioContext): IIRFilterNode {
  let feedforward;
  let feedback;

  switch (context.sampleRate) {
    case 48000:
      feedforward = [0.3115, -1.1926, 1.7622, -1.1926, 0.3115];
      feedback = [1, -3.7956, 5.4771, -3.5657, 0.8843];
      break;

    case 44100:
    default:
      feedforward = [0.3111, -1.1815, 1.7408, -1.1815, 0.3111];
      feedback = [1, -3.7705, 5.418, -3.5222, 0.87495];
      break;
  }

  return context.createIIRFilter(feedforward, feedback);
}
