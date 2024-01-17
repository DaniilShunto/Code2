// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import type { VariantType } from 'notistack';

import BinaryActionNotification from './BinaryActionNotification';

interface NotistackCustomComponents {
  binaryAction: typeof BinaryActionNotification;
}

type ComponentsParameter = {
  [variant in VariantType]?: React.JSXElementConstructor<unknown>;
};

export function getNotistackComponents(components: ComponentsParameter = {}): NotistackCustomComponents {
  return {
    ...components,
    binaryAction: BinaryActionNotification,
  };
}
