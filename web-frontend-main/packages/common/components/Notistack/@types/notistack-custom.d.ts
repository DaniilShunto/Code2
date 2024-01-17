// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import 'notistack';
import { 
  AdditionalButtonAttributes,
} from '../fragments/utils';

declare module 'notistack' {
  interface VariantOverrides {
    // adds `binaryAction` variant and specifies the
    // "extra" props it takes in options of `enqueueSnackbar`
    binaryAction: {
      type?: 'info' | 'warning' | 'error' | 'success';
      primaryBtnText?: string;
      secondaryBtnText?: string;
      onPrimary?: (props: { id: SnackbarKey }) => void;
      onSecondary?: (props: { id: SnackbarKey }) => void;
      primaryBtnProps?: AdditionalButtonAttributes;
      secondaryBtnProps?: AdditionalButtonAttributes;
      closable?: boolean;
    },
  }
}
