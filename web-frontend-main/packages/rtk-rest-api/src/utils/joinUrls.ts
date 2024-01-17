import { isAbsoluteUrl } from './isAbsoluteUrl';

// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
// 			   Mark Erikson 2018
//
// SPDX-License-Identifier: EUPL-1.2

const withoutTrailingSlash = (url: string) => url.replace(/\/$/, '');
const withoutLeadingSlash = (url: string) => url.replace(/^\//, '');

export function joinUrls(base: string | undefined, url: string | undefined): string {
  if (!base) {
    return url || '';
  }
  if (!url) {
    return base;
  }

  if (isAbsoluteUrl(url)) {
    return url;
  }

  base = withoutTrailingSlash(base);
  url = withoutLeadingSlash(url);

  return `${base}/${url}`;
}

export default joinUrls;
