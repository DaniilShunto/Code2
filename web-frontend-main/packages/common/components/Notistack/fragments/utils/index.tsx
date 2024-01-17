// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { TFunctionResult } from 'i18next';
import { OptionsObject, SnackbarKey, enqueueSnackbar, closeSnackbar } from 'notistack';
import React from 'react';

import SnackbarActionButtons from '../SnackbarActionButtons';

export interface AdditionalButtonAttributes {
  variant?: "text" | "outlined" | "contained";
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
}

export interface ISnackbarActionButtonProps {
  msg: (string | React.ReactNode) & TFunctionResult;
  onCancel?: () => void;
  onAction?: () => void;
  actionBtnText?: string;
  actionBtnAttributes?: AdditionalButtonAttributes;
  cancelBtnAttributes?: AdditionalButtonAttributes;
  cancelBtnText?: string;
  hideCloseButton?: boolean;
}

export interface ISnackActionsProps extends OptionsObject, ISnackbarActionButtonProps { }

export interface ISnackbarPersistentProps extends Omit<OptionsObject, 'persist' | 'action' | 'autoHideDuration'> {
  msg: string;
}

export const notificationAction = ({
  msg,
  variant,
  actionBtnText,
  cancelBtnText,
  onAction,
  onCancel,
  hideCloseButton,
  actionBtnAttributes = {},
  cancelBtnAttributes = {},
  ...options
}: ISnackActionsProps) => {
  const handleClick = (key: SnackbarKey, action: typeof onAction | typeof onCancel) => {
    closeSnackbar(key);

    if (action) {
      action();
    }
  };

  enqueueSnackbar(msg, {
    variant,
    ...options,
    action: (key: SnackbarKey) => (
      <SnackbarActionButtons
        actionBtnText={actionBtnText}
        cancelBtnText={cancelBtnText}
        onAction={() => handleClick(key, onAction)}
        onCancel={() => handleClick(key, onCancel)}
        hideCloseButton={hideCloseButton}
        actionBtnAttributes={actionBtnAttributes}
        cancelBtnAttributes={cancelBtnAttributes}
      />
    ),
  });
};

export const notificationPersistent = ({ msg, variant, ...options }: ISnackbarPersistentProps) => {
  enqueueSnackbar(msg, {
    variant,
    ...options,
    action: null,
    persist: true,
  });
};

export const notifications = {
  success(msg: string, options: OptionsObject = {}): void {
    this.toast(msg, { ...options, variant: 'success' });
  },
  warning(msg: string, options: OptionsObject = {}): void {
    this.toast(msg, { ...options, variant: 'warning' });
  },
  info(msg: string, options: OptionsObject = {}): void {
    this.toast(msg, { ...options, variant: 'info' });
  },
  error(msg: string, options: OptionsObject = {}): void {
    this.toast(msg, { ...options, variant: 'error' });
  },
  toast(msg: string, options: OptionsObject = {}): void {
    enqueueSnackbar(msg, options);
  },
  binaryAction: (
    message: string,
    options: OptionsObject<"binaryAction"> & {
      type?: 'info' | 'warning' | 'error' | 'success';
      primaryBtnText?: string;
      secondaryBtnText?: string;
      onPrimary?: (props: { id: SnackbarKey }) => void;
      onSecondary?: (props: { id: SnackbarKey }) => void;
      primaryBtnProps?: AdditionalButtonAttributes;
      secondaryBtnProps?: AdditionalButtonAttributes;
      closable?: boolean;
    } = {}
  ) => {
    return enqueueSnackbar({ ...options, message, variant: 'binaryAction' });
  },
  close(key: SnackbarKey): void {
    closeSnackbar(key);
  },
  closeAll(): void {
    closeSnackbar();
  },
};
