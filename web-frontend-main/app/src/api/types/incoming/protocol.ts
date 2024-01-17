// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ErrorStruct, isEnumErrorStruct, NamespacedIncoming } from '@opentalk/common';

interface IncomingProtocolSuccess {
  message: 'write_url' | 'read_url';
  url: URL;
}

interface IncomingPdfAsset {
  message: 'pdf_asset';
  filename: string;
  assetId: string;
}

export enum ProtocolError {
  InsufficientPermissions = 'insufficient_permissions',
  CurrentlyInitializing = 'currently_initializing',
  FailedInitialization = 'failed_initialization',
}

export const isError = isEnumErrorStruct(ProtocolError);

export type IncomingProtocol = IncomingProtocolSuccess | IncomingPdfAsset | ErrorStruct<ProtocolError>;
export type Protocol = NamespacedIncoming<IncomingProtocol, 'protocol'>;

export default Protocol;
