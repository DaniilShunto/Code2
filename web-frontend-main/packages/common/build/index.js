// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

'use strict'

if (process.env.NODE_ENV === 'production') {
    module.exports = require("./cjs/index.production.js");
} else {
    module.exports = require("./cjs/index.development.js");
}