// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ComponentMeta, ComponentStory } from '@storybook/react';

import MenuTabs from './MenuTabs';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'components/MenuTabs',
  component: MenuTabs,
} as ComponentMeta<typeof MenuTabs>;

export const Basic: ComponentStory<typeof MenuTabs> = () => <MenuTabs />;
