// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
// 			   Mark Erikson 2018
//
// SPDX-License-Identifier: EUPL-1.2

/**
 * If either :// or // is present consider it to be an absolute url
 *
 * @param url string
 */

export function isAbsoluteUrl(url: string) {
  return new RegExp(`(^|:)//`).test(url);
}
