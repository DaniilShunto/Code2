// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ComponentMeta, ComponentStory } from '@storybook/react';

import NumberInput from './NumberInput';

export default {
  title: 'components/NumberInput',
  component: NumberInput,
} as ComponentMeta<typeof NumberInput>;

export const Basic: ComponentStory<typeof NumberInput> = () => <NumberInput inputProps={{ min: 2, max: 10 }} />;
