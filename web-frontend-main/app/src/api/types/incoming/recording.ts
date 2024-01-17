// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { NamespacedIncoming } from '@opentalk/common';

export interface StartedRecording {
  message: 'started';
  recordingId: string;
}

export interface StoppedRecording {
  message: 'stopped';
  recordingId: string;
}

type RecordingErrorType = 'insufficient_permissions' | 'invalid_recording_id' | 'already_recording';
export interface RecordingError {
  message: 'error';
  error: RecordingErrorType;
}

export type Message = StartedRecording | StoppedRecording | RecordingError;

export type Recording = NamespacedIncoming<Message, 'recording'>;

export default Recording;
