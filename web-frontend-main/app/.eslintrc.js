// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

module.exports = {
  env: {
	node: true,
	browser: true,
  },
  plugins: [
    'jsx-a11y',
  ],
  extends: [
    'plugin:jsx-a11y/recommended',
  ],
  overrides: [
    {
      "files": ["**/FullscreenView.test.tsx"],
      "rules": {
        "no-var": "off"
      }
    }
  ]
};
