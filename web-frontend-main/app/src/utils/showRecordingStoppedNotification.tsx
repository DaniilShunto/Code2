// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { enqueueSnackbar } from '@opentalk/common';

import RecordingStoppedMessage from '../components/RecordingStoppedMessage';

export const showRecordingStoppedNotification = () => enqueueSnackbar(<RecordingStoppedMessage />, { variant: 'info' });
