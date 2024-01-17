// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

import {initReactI18next} from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Fluent from "@opentalk/i18next-fluent";
import HttpApi from 'i18next-http-backend';
import { ftl2js } from '@opentalk/fluent_conv';

const ns = ['k3k'];
const supportedLngs = ['en', 'de'];

i18n
    .use(HttpApi)
    .use(Fluent)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        defaultNS: 'k3k',
        ns,
        supportedLngs,
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.ftl',
            parse: (data, lang, namespace) => {
                return ftl2js(data);
            },
            crossDomain: false,
        },
        react: {
            useSuspense: true,
        },
    });

export {i18n}
