#!/bin/bash

# SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
#
# SPDX-License-Identifier: EUPL-1.2

echo "{\"janus\":\"ping\", \"transaction\":\"healthcheck\"}" | \
    nc -Uu -w1 /var/run/janus_admin.sock | \
    jq -e '.janus == "pong" and .transaction == "healthcheck"'
