// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

/**
 * Mocking react-i18next module as we don't care about actual
 * text in the snapshots, we only want to be sure that used key
 * is not going to change.
 */
import SortPopoverMenuItem from './SortPopoverMenuItem';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
  initReactI18next: {
    type: '3rdParty',
  },
}));

describe('<SortPopoverMenuItem />', () => {
  it('should render with required properties.', () => {
    expect(
      render(<SortPopoverMenuItem i18nKey="test-key" value="test-value" onSelect={jest.fn()} />)
    ).toMatchSnapshot();
  });

  it('should execute onSelect callback with value when clicked.', () => {
    const callback = jest.fn();
    render(<SortPopoverMenuItem i18nKey="test-key" value="test-value" onSelect={callback} selected={false} />);
    const li = screen.getByRole('menuitem');
    fireEvent.click(li);
    expect(callback).toBeCalledWith('test-value');
  });
});
