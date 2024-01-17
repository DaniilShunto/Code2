// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { notifications } from '@opentalk/common';
import i18next from 'i18next';

import { StartRoomError } from '../api/rest';

interface IErrorHandlerMessage {
  status: number;
  code?: string;
  message?: string;
}

export const getErrorMessageByStatus = ({ status, code }: IErrorHandlerMessage) => {
  if (status >= 400 && status <= 599) {
    switch (code) {
      case StartRoomError.WrongRoomPassword:
        return 'http-error-message-password';
      case StartRoomError.InvalidCredentials:
        return 'http-error-message-credentials';
      case StartRoomError.NoBreakoutRooms:
      case StartRoomError.InvalidBreakoutRoomId:
        return 'http-error-message-no-breakout-room';
      default:
        return `http-error-message-${status}`;
    }
  }
  return 'error-general';
};

export const httpErrorNotification = ({ status, code }: IErrorHandlerMessage) => {
  notifications.error(i18next.t(getErrorMessageByStatus({ status, code })));
};
