// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { RoomId } from "./common";

export type StreamingTargetId = string & { readonly __tag: unique symbol };

export enum PlatformKind {
  Provider = 'provider',
  BuiltIn = 'builtin',
  Custom = 'custom',
}

interface ProviderPlatform {
  kind: PlatformKind.Provider;
  provider: string;
  streamingKey: string;
  publicUrl: URL;
}

interface CustomPlatform {
  kind: PlatformKind.Custom;
  name: string;
  streamingEndpoint: URL;
  streamingKey: string;
  publicUrl: URL;
}

interface BuiltInPlatform {
  kind: PlatformKind.BuiltIn;
}

export type StreamingPlatform = ProviderPlatform | CustomPlatform | BuiltInPlatform;

interface BaseStreamingTargetInfo {
  id: StreamingTargetId,
  roomId: RoomId,
}

type CustomTargetInfo = CustomPlatform & BaseStreamingTargetInfo;

type BuiltInTargetInfo = BuiltInPlatform & BaseStreamingTargetInfo;

type ProviderTargetInfo = ProviderPlatform & BaseStreamingTargetInfo;

export type StreamingTargetInfo = CustomTargetInfo | BuiltInTargetInfo | ProviderTargetInfo;
