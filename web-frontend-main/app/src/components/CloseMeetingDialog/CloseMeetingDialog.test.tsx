// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import React from 'react';

import { configureStore, render, screen } from '../../utils/testUtils';
import CloseMettingDialog, { CloseMeetingDialogProps } from './CloseMeetingDialog';

const dialogProps: CloseMeetingDialogProps = {
  open: true,
  onClose: jest.fn(),
  container: null,
};

describe('CloseMettingDialog', () => {
  const { store /*, dispatch */ } = configureStore();

  test('dialog with flag open={false}, should not render', async () => {
    await render(<CloseMettingDialog {...dialogProps} open={false} />, store);
    expect(screen.queryByText('meeting-delete-metadata-dialog-title')).not.toBeInTheDocument();
    expect(screen.queryByText('meeting-delete-metadata-dialog-message')).not.toBeInTheDocument();
    expect(screen.queryByText('meeting-delete-metadata-dialog-checkbox')).not.toBeInTheDocument();
    expect(screen.queryByText('meeting-delete-metadata-button-leave-and-delete')).not.toBeInTheDocument();
    expect(screen.queryByText('meeting-delete-metadata-button-leave-without-delete')).not.toBeInTheDocument();
  });

  test('dialog will render properly', async () => {
    await render(<CloseMettingDialog {...dialogProps} />, store);
    expect(screen.getByText('meeting-delete-metadata-dialog-title')).toBeInTheDocument();
    expect(screen.getByText('meeting-delete-metadata-dialog-message')).toBeInTheDocument();
    expect(screen.getByText('meeting-delete-metadata-dialog-checkbox')).toBeInTheDocument();
    expect(screen.getByText('meeting-delete-metadata-button-leave-and-delete')).toBeInTheDocument();
    expect(screen.getByText('meeting-delete-metadata-button-leave-without-delete')).toBeInTheDocument();
  });
});
