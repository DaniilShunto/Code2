// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ParticipantId } from '@opentalk/common';
import * as React from 'react';

import { render, configureStore, screen, fireEvent, cleanup } from '../../utils/testUtils';
import ProtocolTab, { ProtocolParticipant } from './ProtocolTab';

describe('ProtocolTab component tests', () => {
  const { store } = configureStore();

  const initialUserValue: ProtocolParticipant[] = [
    {
      id: '12345' as ParticipantId,
      displayName: 'test name',
      isSelected: true,
    },
  ];

  afterAll(() => cleanup());

  test('ProtocolTab component should be rendered without breaking', async () => {
    await render(<ProtocolTab />, store);
    const nextButton = screen.getByRole('button', { name: /protocol-invite-send-button/i });
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toBeDisabled();
  });

  test('When there is a selected user send invitation button should be enable', async () => {
    const setState = jest.fn();
    const mockInitialStateUpdate = () => [[...initialUserValue], setState];
    jest.spyOn(React, 'useState').mockImplementation(mockInitialStateUpdate as jest.Mock);

    await render(<ProtocolTab />, store);

    const sendInvitationButton = screen.getByLabelText(/protocol-invite-send-button/i);
    expect(sendInvitationButton).toBeInTheDocument();
    expect(sendInvitationButton).toBeEnabled();
  });

  test('Click on send invitation button should dispatch right action', async () => {
    const sendInvitations = jest.fn();
    const setState = jest.fn();
    const mockInitialStateUpdate = () => [[...initialUserValue], setState];
    jest.spyOn(React, 'useState').mockImplementation(mockInitialStateUpdate as jest.Mock);
    await render(<ProtocolTab />, store);

    const sendInvitationButton = screen.getByLabelText(/protocol-invite-send-button/i);
    sendInvitationButton.onclick = sendInvitations;
    expect(sendInvitationButton).toBeInTheDocument();
    expect(sendInvitationButton).toBeEnabled();
    fireEvent.click(sendInvitationButton);
    expect(sendInvitations).toHaveBeenCalledTimes(1);
  });
});
