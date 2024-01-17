# SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
#
# SPDX-License-Identifier: EUPL-1.2

FROM rust:alpine AS Builder
ARG BUILD_VERSION

WORKDIR /cargo-deny-ci

RUN apk add --no-cache git musl-dev openssl-dev perl make
COPY . .
WORKDIR /cargo-deny-ci/cargo-deny
RUN git checkout $BUILD_VERSION
RUN cargo build --release --locked

FROM rust:alpine
RUN apk add --no-cache git

COPY --from=Builder /cargo-deny-ci/cargo-deny/target/release/cargo-deny /usr/bin/cargo-deny

