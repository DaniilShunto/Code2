// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { render } from '@testing-library/react';
import React from 'react';

import { FormWrapper } from './FormWrapper';

describe('FormWrapper Component', () => {
  const formWrapperTestProps = {
    label: 'test-label',
    helperText: 'test-helper-text',
    valid: true,
    error: false,
  };

  it('render component without crashing', async () => {
    render(
      <FormWrapper {...formWrapperTestProps}>
        <></>
      </FormWrapper>
    );
  });
});
