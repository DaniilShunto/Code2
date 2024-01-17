// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import React from 'react';

import { screen, render, fireEvent } from '../../utils/testUtils';
import ConfirmDialog, { ConfirmDialogProps } from './ConfirmDialog';

const dialogProps: ConfirmDialogProps = {
  open: true,
  onConfirm: jest.fn(),
  onCancel: jest.fn(),
  message: 'dialogMessage',
  title: 'dialogTitle',
  submitButtonText: 'submitText',
  cancelButtonText: 'cancelText',
};

describe('ConfirmDialog', () => {
  const handleClick = jest.fn();
  test('dialog will render properly', async () => {
    await render(<ConfirmDialog {...dialogProps} />);
    expect(screen.getByText('dialogTitle')).toBeInTheDocument();
    expect(screen.getByText('dialogMessage')).toBeInTheDocument();

    const submitButton = screen.getByText('submitText');
    expect(submitButton).toBeInTheDocument();

    const cancelButton = screen.getByText('cancelText');
    expect(cancelButton).toBeInTheDocument();
  });

  test('click on submitButton should trigger onConfirm()', async () => {
    await render(<ConfirmDialog {...dialogProps} onConfirm={handleClick} />);

    const submitButton = screen.getByText('submitText');
    expect(submitButton).toBeInTheDocument();

    await fireEvent.click(submitButton);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('click on cancelButton should trigger onCancel()', async () => {
    await render(<ConfirmDialog {...dialogProps} onCancel={handleClick} />);

    const cancelButton = screen.getByText('cancelText');
    expect(cancelButton).toBeInTheDocument();

    await fireEvent.click(cancelButton);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('component with flag open={false}, should not render component', async () => {
    await render(<ConfirmDialog {...dialogProps} open={false} />);
    expect(screen.queryByText('dialogTitle')).not.toBeInTheDocument();
    expect(screen.queryByText('dialogMessage')).not.toBeInTheDocument();
    expect(screen.queryByText('submitText')).not.toBeInTheDocument();
    expect(screen.queryByText('cancelText')).not.toBeInTheDocument();
  });
});
