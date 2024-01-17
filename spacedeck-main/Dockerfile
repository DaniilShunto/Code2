# SPDX-FileCopyrightText: Copyright (C) 2011-2018 Lukas F. Hartmann, Martin Güther
# SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
#
# SPDX-License-Identifier: AGPL-3.0-or-later

FROM node:18-bookworm-slim

WORKDIR /app

# install chromium

RUN apt-get update && apt-get install -y \
    chromium \
    libfreetype6 \
    libfreetype6-dev \
    libharfbuzz-dev \
    ca-certificates \
    fonts-freefont-ttf

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# install other requirements

RUN apt-get install -y \
    graphicsmagick \
    ffmpeg \
    ghostscript \
    git

# install node package

RUN git clone https://github.com/spacedeck/spacedeck-open && \
    cd spacedeck-open && \
    git checkout a5914ab600e9f4ae3f42d9361195a3696843903e

RUN cp spacedeck-open/package*.json .

RUN npm install

WORKDIR /app/spacedeck-open

COPY 0001-create-admin.patch .

RUN git apply 0001-create-admin.patch

COPY 0002-delete-pdf.patch .

RUN git apply 0002-delete-pdf.patch

# COPY spacedeck-open .

# copy environment variable bindings
COPY custom-environment-variables.json config/

# set default text and fill color
RUN sed -i 's/"spacedeck": {}/"spacedeck": {"default_text_color": "#20434f", "default_fill_color": "#d2e245"}/' config/default.json

# start app

EXPOSE 9666
CMD ["node", "spacedeck.js"]

