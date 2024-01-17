# SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
#
# SPDX-License-Identifier: EUPL-1.2

# Modified from https://gitlab.com/powerpaul17/nc_talk_backend/-/blob/dcbb918d8716dad1eb72a889d1e6aa1e3a543641/docker/janus/Dockerfile
FROM alpine:3.19 as build

RUN apk add --no-cache bash curl autoconf automake libtool pkgconf build-base \
  glib-dev libconfig-dev libnice-dev jansson-dev libsrtp-dev openssl-dev zlib \
  gengetopt libwebsockets-dev git curl-dev libogg-dev rabbitmq-c-dev libmicrohttpd-dev

# usrsctp
# 08 Oct 2021
ARG USRSCTP_VERSION=7c31bd35c79ba67084ce029511193a19ceb97447

RUN cd /tmp && \
    git clone https://github.com/sctplab/usrsctp && \
    cd usrsctp && \
    git checkout $USRSCTP_VERSION && \
    ./bootstrap && \
    ./configure --prefix=/usr/local && \
    make -j && make install

# JANUS
ARG JANUS_VERSION=0.14.1
RUN mkdir -p /usr/src/janus && \
    cd /usr/src/janus && \
    curl -L https://github.com/meetecho/janus-gateway/archive/v$JANUS_VERSION.tar.gz | tar -xz && \
    cd /usr/src/janus/janus-gateway-$JANUS_VERSION && \
    ./autogen.sh && \
    ./configure --disable-mqtt --disable-boringssl && \
    make -j && \
    make install && \
    make configs

FROM alpine:3.19

RUN apk add --no-cache bash busybox-extras curl \
  libconfig libnice jansson libsrtp openssl zlib \
  libwebsockets libogg rabbitmq-c libmicrohttpd \
  netcat-openbsd jq

COPY --from=build /usr/local/lib/libusrsctp.so.2.0.0 /usr/local/lib/

RUN ln -s /usr/local/lib/libusrsctp.so.2.0.0 /usr/local/lib/libusrsctp.so && \
    ln -s /usr/local/lib/libusrsctp.so.2.0.0 /usr/local/lib/libusrsctp.so.2

COPY --from=build /usr/local/etc/janus /usr/local/etc/janus
COPY --from=build /usr/local/lib/janus /usr/local/lib/janus
COPY --from=build /usr/local/bin/janus /usr/local/bin/janus

WORKDIR /

ADD *.sh /

HEALTHCHECK CMD /healthcheck.sh

ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "janus" ]
