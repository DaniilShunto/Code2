#!/bin/sh

# SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
#
# SPDX-License-Identifier: EUPL-1.2

APIKEY_FILE=/opt/etherpad-lite/APIKEY.txt

if [ -n "${EP_APIKEY}" ]; then
	echo "${EP_APIKEY}" >"${APIKEY_FILE}"
fi

if [ -f "${APIKEY_FILE}" ]; then
	node src/node/server.js
else
	echo "error: apikey not defined"
	exit 1
fi
