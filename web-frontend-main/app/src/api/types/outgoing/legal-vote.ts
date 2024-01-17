// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createModule } from '@opentalk/common';
import { createOutgoingLegalVote } from '@opentalk/components';

// import { createSignalingApiCall } from '../../createSignalingApiCall';
import sendMessage from '../../sendMessage';

const legalVote = createOutgoingLegalVote(createModule, sendMessage);

export default legalVote;
