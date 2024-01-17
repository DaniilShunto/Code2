// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createModule, Namespaced } from '@opentalk/common';

import { RootState } from '../../../store';
import { createSignalingApiCall } from '../../createSignalingApiCall';
import { sendMessage } from '../../index';

export interface StartWhiteboard {
  action: 'initialize';
}
export interface GenerateWhiteboardPdf {
  action: 'generate_pdf';
}

export type Action = StartWhiteboard | GenerateWhiteboardPdf;
export type Whiteboard = Namespaced<Action, 'whiteboard'>;

export const startWhiteboard = createSignalingApiCall<StartWhiteboard>('whiteboard', 'initialize');
export const generateWhiteboardPdf = createSignalingApiCall<GenerateWhiteboardPdf>('whiteboard', 'generate_pdf');

export const handler = createModule<RootState>((builder) => {
  builder.addCase(startWhiteboard.action, (_state, { payload }) => {
    sendMessage(startWhiteboard(payload));
  });
  builder.addCase(generateWhiteboardPdf.action, (_state, { payload }) => {
    sendMessage(generateWhiteboardPdf(payload));
  });
});

export default Whiteboard;
