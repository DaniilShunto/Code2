// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createModule } from '@opentalk/common';
import { createOutgoingAutomod } from '@opentalk/components';

import sendMessage from '../../sendMessage';

const automod = createOutgoingAutomod(createModule, sendMessage);

export default automod;
