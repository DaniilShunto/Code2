// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import '@emotion/styled';
import { ThemeProvider } from '@mui/material';
import '@mui/material';
import '@mui/styles';
import {
  SnackbarProvider,
  Participant,
  ProtocolAccess,
  WaitingState,
  MediaSessionType,
  ParticipantId,
  ParticipationKind,
  VideoSetting,
  InviteCode,
} from '@opentalk/common';
import { ftl2js } from '@opentalk/fluent_conv';
import { AuthProvider } from '@opentalk/redux-oidc';
import {
  DateTime,
  Email,
  EventId,
  EventType,
  InviteStatus,
  RoomId,
  UserId,
  TimelessEvent,
  RoomInvite,
} from '@opentalk/rest-api-rtk-query';
import { combineReducers, ConfigureStoreOptions, Store } from '@reduxjs/toolkit';
import { createStore as createStoreTlk, configureStore as configureStoreTlk } from '@reduxjs/toolkit';
import { act, render as rtlRender, RenderOptions } from '@testing-library/react';
import fs from 'fs';
import i18n from 'i18next';
import { range } from 'lodash';
import React from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { createOpenTalkTheme } from '../assets/themes/opentalk';
import { MediaProvider } from '../components/MediaProvider';
import { idFromDescriptor, MediaId, SubscriberStateChanged, SubscriberConfig } from '../modules/WebRTC';
import FullscreenProvider from '../provider/FullscreenProvider';
import { appReducers } from '../store';

export const loadLanguage = async (lng: string) => {
  const filename = 'public/locales/' + lng + '/k3k.ftl';
  await new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', function (err?, data?) {
      if (err) {
        reject(err);
      }

      i18n.loadNamespaces('k3k', () => {
        const bundle = ftl2js(data);
        i18n.addResourceBundle(lng, 'k3k', bundle);
        resolve(data);
      });
    });
  });
};

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',
  resources: { en: { translations: {} } },
});

export const createStore = (options?: ConfigureStoreOptions['preloadedState'] | undefined) => {
  const store = createStoreTlk(
    combineReducers({ ...appReducers }),
    options?.initialState && { ...options.initialState }
  );

  const dispatch = jest.fn(store.dispatch);
  store.dispatch = dispatch;

  return { store, dispatch };
};

export const configureStore = (options?: ConfigureStoreOptions['preloadedState'] | undefined) => {
  const store = configureStoreTlk({
    reducer: combineReducers({ ...appReducers }),
    preloadedState: options?.initialState && { ...options.initialState },
  });

  return { store };
};

export * from '@testing-library/react';

export const render = async (ui: React.ReactElement, store?: Store, options?: RenderOptions) => {
  function Wrapper({ children }: { children: React.ReactElement }): React.ReactElement {
    if (store === undefined) {
      return (
        <ThemeProvider theme={createOpenTalkTheme()}>
          <I18nextProvider i18n={i18n}>
            <SnackbarProvider>{children}</SnackbarProvider>
          </I18nextProvider>
        </ThemeProvider>
      );
    }
    return (
      <ThemeProvider theme={createOpenTalkTheme()}>
        <Provider store={store}>
          <MemoryRouter>
            <AuthProvider
              configuration={{
                authority: 'http://OP',
                clientId: 'Frontend',
                redirectUri: '/',
                baseUrl: '/',
                scope: 'void',
                signOutRedirectUri: '/',
              }}
            >
              <I18nextProvider i18n={i18n}>
                <SnackbarProvider>
                  <MediaProvider>
                    <FullscreenProvider>{children}</FullscreenProvider>
                  </MediaProvider>
                </SnackbarProvider>
              </I18nextProvider>
            </AuthProvider>
          </MemoryRouter>
        </Provider>
      </ThemeProvider>
    );
  }
  let result;
  await act(async () => {
    result = await rtlRender(ui, { wrapper: Wrapper, ...options });
  });
  return result;
};

export const jwtVariables = {
  NAME: 'Jürgen Tests',
  TOKEN:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiSsO8cmdlbiBUZXN0cyJ9.t9f4AJVApbVfSWUJetD7qAOF-UQvebb3eVuDtE8RmHY',
};

/*
  const mockStore
  create participants and use them to create a redux store for testing.

  @params participantCount: number of mocked participants
  @returns mocked redux store for testing
*/

export const mockStore = (participantCount: number, options?: { video?: boolean; screen?: boolean; sip?: boolean }) => {
  const participantsIds = range(participantCount);
  const participants = participantsIds.map((index) =>
    mockedParticipant(index, options?.sip ? ParticipationKind.Sip : undefined)
  );

  const subscribers: Array<SubscriberConfig & SubscriberStateChanged> = [];
  if (options?.video) {
    participants.forEach(({ id }) =>
      subscribers.push({
        participantId: id,
        mediaType: MediaSessionType.Video,
        video: true,
        audio: true,
        subscriberState: { audioRunning: true, videoRunning: true, connection: 'connected' },
        videoSettings: VideoSetting.High,
      })
    );
  }

  if (options?.screen) {
    participants.forEach(({ id }) =>
      subscribers.push({
        participantId: id,
        mediaType: MediaSessionType.Screen,
        video: true,
        audio: false,
        subscriberState: { audioRunning: false, videoRunning: true, connection: 'connected' },
        videoSettings: VideoSetting.High,
      })
    );
  }

  const initialState = {
    participants: {
      ids: participants.map((p) => p.id),
      entities: participants.reduce((entities: Record<ParticipantId, Participant>, participant) => {
        entities[participant.id] = participant;
        return entities;
      }, {}),
    },
    subscribers: {
      ids: subscribers.map(idFromDescriptor),
      entities: subscribers.reduce(
        (entities: Record<MediaId, SubscriberConfig & SubscriberStateChanged>, subscriber) => {
          entities[idFromDescriptor(subscriber)] = subscriber;
          return entities;
        },
        {}
      ),
    },
  };

  return createStore({
    initialState,
  });
};

export const mockedParticipant = (index: number, kind: ParticipationKind = ParticipationKind.User): Participant => ({
  id: `00000000-e6b4-4759-00${index}` as ParticipantId,
  displayName: `Test User Randy Mock${index}`,
  handIsUp: false,
  handUpdatedAt: '2022-03-23T12:32:30Z',
  joinedAt: '2022-03-23T12:32:30Z',
  leftAt: null,
  breakoutRoomId: null,
  groups: [],
  participationKind: kind,
  lastActive: '2022-03-23T12:32:30Z',
  waitingState: WaitingState.Joined,
  protocolAccess: ProtocolAccess.None,
  isPresenter: false,
});

export const mockedVideoMediaDescriptor = (index: number) => ({
  participantId: mockedParticipant(index).id,
  mediaType: MediaSessionType.Video,
});

export const mockedScreenMediaDescriptor = (index: number) => ({
  participantId: mockedParticipant(index).id,
  mediaType: MediaSessionType.Screen,
});

export const eventMockedData: TimelessEvent = {
  id: uuidv4() as EventId,
  createdAt: '2022-04-06T13:57:38.793602Z' as DateTime,
  inviteStatus: InviteStatus.Accepted,
  isTimeIndependent: true,
  isFavorite: true,
  createdBy: {
    displayName: 'Test User',
    email: 'test@heinlein-video.de' as Email,
    firstname: 'FirstTest',
    id: '3645d74d-9a4b-4cd4-9d9f-f1871c970167' as UserId,
    lastname: 'LastTest',
    title: '',
  },
  title: 'Here is a very long test title for the event',
  description: 'Here is a description for the event',
  room: {
    id: uuidv4() as RoomId,
    waitingRoom: false,
  },
  recurrencePattern: ['DUMMY'],
  type: EventType.Single,
  updatedBy: {
    displayName: 'Test User',
    email: 'test@heinlein-video.de' as Email,
    firstname: 'FirstTest',
    id: '3645d74d-9a4b-4cd4-9d9f-f1871c970167' as UserId,
    lastname: 'LastTest',
    title: '',
  },
  updatedAt: '2022-04-06T13:57:38.793602Z' as DateTime,
  isAdhoc: false,
};

export const mockedExpiringDateRoomInvite: RoomInvite = {
  inviteCode: 'string' as InviteCode,
  created: '2019-08-24T14:15:22Z' as DateTime,
  createdBy: {
    id: '497f6eca-6276-4993-bfeb-53cbbbba6f08' as UserId,
    email: 'user@example.com' as Email,
    title: 'string',
    firstname: 'string',
    lastname: 'string',
    displayName: 'string',
    avatarUrl: 'string',
  },
  updated: '2022-04-06T13:57:38.793602Z' as DateTime,
  updatedBy: {
    id: '497f6eca-6276-4993-bfeb-53cbbbba6f08' as UserId,
    email: 'user@example.com' as Email,
    title: 'string',
    firstname: 'string',
    lastname: 'string',
    displayName: 'string',
    avatarUrl: 'string',
  },
  room: '2fa2a266-7d97-4147-8f17-1e57105c70ea',
  active: true,
  expiration: '2022-04-06T13:57:38.793602Z' as DateTime,
};

export const mockedPermanentRoomInvite: RoomInvite = { ...mockedExpiringDateRoomInvite, expiration: null };
