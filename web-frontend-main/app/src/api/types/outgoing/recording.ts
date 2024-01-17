// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createModule, Namespaced } from '@opentalk/common';

import { sendMessage } from '../..';
import { RootState } from '../../../store';
import { createSignalingApiCall } from '../../createSignalingApiCall';

export interface StartRecording {
  action: 'start';
}

export interface StopRecording {
  action: 'stop';
  recordingId: string;
}

export interface SetRecordingConsent {
  action: 'set_consent';
  consent: boolean;
}

export type Action = StartRecording | StopRecording | SetRecordingConsent;

export type Recording = Namespaced<Action, 'recording'>;

export const sendStartRecordingSignal = createSignalingApiCall<StartRecording>('recording', 'start');
export const sendStopRecordingSignal = createSignalingApiCall<StopRecording>('recording', 'stop');
export const sendRecordingConsentSignal = createSignalingApiCall<SetRecordingConsent>('recording', 'set_consent');

export const handler = createModule<RootState>((builder) => {
  builder
    .addCase(sendStartRecordingSignal.action, (_state, action) => {
      sendMessage(sendStartRecordingSignal(action.payload));
    })
    .addCase(sendStopRecordingSignal.action, (_state, action) => {
      sendMessage(sendStopRecordingSignal(action.payload));
    })
    .addCase(sendRecordingConsentSignal.action, (_state, action) => {
      sendMessage(sendRecordingConsentSignal(action.payload));
    });
});

export default Recording;
