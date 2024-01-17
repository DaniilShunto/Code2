// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Typography } from '@mui/material';
import {
  AddUserIcon,
  BreakroomsIcon,
  LegalBallotIcon,
  MuteAllIcon,
  PollIcon,
  SpeakerQueueIcon,
  TimerIcon,
  WheelOfNamesIcon,
  WoolBallIcon,
  WhiteboardIcon,
  RaiseHandOffIcon,
  ProtocolIcon,
  CoffeeBreakIcon,
  DebriefingIcon,
  TalkingStickIcon,
  BackendModules,
  RoomMode,
  TimerStyle,
} from '@opentalk/common';
import React, { Suspense } from 'react';

import SuspenseLoading from '../commonComponents/SuspenseLoading';
import DebriefingTab from '../components/DebriefingTab';
import HomeIconComponent from '../components/HomeIconComponent';
import { useAppSelector } from '../hooks';
import { FeaturesKeys } from '../store/slices/configSlice';
import { selectCurrentRoomMode } from '../store/slices/roomSlice';

const MenuTabs = React.lazy(() => import('../components/MenuTabs'));
const BreakoutRoomTab = React.lazy(() => import('../components/BreakoutRoomTab'));
const LegalVote = React.lazy(() =>
  import('@opentalk/components').then((module) => ({ default: module.LegalVoteComponent }))
);
const TalkingStickTabPanel = React.lazy(() =>
  import('@opentalk/components').then((module) => ({ default: module.TalkingStickTabPanel }))
);
const PollTab = React.lazy(() => import('../components/PollTab'));
const MuteParticipantsTab = React.lazy(() => import('../components/MuteParticipants'));
const ProtocolTab = React.lazy(() => import('../components/ProtocolTab'));
const ResetHandraisesTab = React.lazy(() => import('../components/ResetHandraisesTab'));
const TimerTab = React.lazy(() => import('../components/TimerTab'));
const WhiteboardTab = React.lazy(() => import('../components/WhiteboardTab'));

export enum ModerationTabKey {
  Home = 'tab-home',
  MuteUsers = 'tab-mute-users',
  ResetHandraises = 'tab-reset-handraises',
  Breakout = 'tab-breakout-rooms',
  Whiteboard = 'tab-whiteboard',
  Polls = 'tab-polls',
  LegalVote = 'tab-voting',
  Timer = 'tab-timer',
  CoffeeBreak = 'tab-coffee-break',
  Protocol = 'tab-protocol',
  AddUser = 'tab-add-user',
  TalkingStick = 'tab-talking-stick',
  Debriefing = 'tab-debriefing',
  Wollknaul = 'tab-wollknaul',
  SpeakerQueue = 'tab-speaker-queue',
  WheelOfNames = 'tab-wheel-of-names',
  Divider = 'tab-divider',
}

export interface Tab {
  /**
   * Unique identifier for each rendered tab
   */
  key: ModerationTabKey;
  icon?: React.ReactElement;
  component?: React.ReactNode;
  tooltipTranslationKey?: string;
  /**
   * Key that links it to enabled feature
   */
  featureKey?: FeaturesKeys;
  /**
   * Links to module enabled by the backend
   */
  moduleKey?: BackendModules;
  divider?: boolean;
  disabled?: boolean;
  titleKey?: string;
}

export const currentRoomMode = (): RoomMode | undefined => {
  return useAppSelector(selectCurrentRoomMode);
};

export const tabs: Array<Tab> = [
  {
    icon: <HomeIconComponent />,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <MenuTabs />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-home-tooltip',
    featureKey: FeaturesKeys.Home,
    key: ModerationTabKey.Home,
  },
  {
    icon: <MuteAllIcon />,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <MuteParticipantsTab />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-mute-tooltip',
    featureKey: FeaturesKeys.MuteUsers,
    key: ModerationTabKey.MuteUsers,
    titleKey: 'mute-participants-tab-title',
  },
  {
    icon: <RaiseHandOffIcon />,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <ResetHandraisesTab />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-reset-handraises-tooltip',
    featureKey: FeaturesKeys.ResetHandraises,
    key: ModerationTabKey.ResetHandraises,
    titleKey: 'reset-handraises-tab-title',
  },
  {
    icon: <DebriefingIcon />,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <DebriefingTab />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-debriefing',
    featureKey: FeaturesKeys.Debriefing,
    key: ModerationTabKey.Debriefing,
    titleKey: 'debriefing-tab-title',
  },
  {
    key: ModerationTabKey.Divider,
    divider: true,
  },
  {
    icon: <BreakroomsIcon />,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <BreakoutRoomTab />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-breakout-tooltip',
    moduleKey: BackendModules.Breakout,
    key: ModerationTabKey.Breakout,
    titleKey: 'breakout-room-tab-title',
  },
  {
    icon: <WhiteboardIcon />,
    tooltipTranslationKey: 'moderationbar-button-whiteboard-tooltip',
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <WhiteboardTab />
      </Suspense>
    ),
    moduleKey: BackendModules.Whiteboard,
    key: ModerationTabKey.Whiteboard,
    titleKey: 'whiteboard-tab-title',
  },
  {
    icon: <PollIcon />,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <PollTab />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-poll-tooltip',
    moduleKey: BackendModules.Polls,
    key: ModerationTabKey.Polls,
    titleKey: 'poll-tab-title',
  },
  {
    icon: <LegalBallotIcon />,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <LegalVote currentRoomMode={currentRoomMode} />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-ballot-tooltip',
    moduleKey: BackendModules.LegalVote,
    key: ModerationTabKey.LegalVote,
    titleKey: 'legal-vote-tab-title',
  },
  {
    icon: <TalkingStickIcon />,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <TalkingStickTabPanel />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-talking-stick-tooltip',
    moduleKey: BackendModules.Automod,
    key: ModerationTabKey.TalkingStick,
    titleKey: 'talking-stick-tab-title',
  },
  {
    icon: <TimerIcon />,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <TimerTab timerStyle={TimerStyle.Normal} />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-timer-tooltip',
    moduleKey: BackendModules.Timer,
    key: ModerationTabKey.Timer,
    titleKey: 'timer-tab-title',
  },
  {
    icon: <CoffeeBreakIcon />,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <TimerTab timerStyle={TimerStyle.CoffeeBreak} />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-coffee-break-tooltip',
    moduleKey: BackendModules.Timer,
    key: ModerationTabKey.CoffeeBreak,
    titleKey: 'coffee-break-tab-title',
  },
  {
    icon: <ProtocolIcon />,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <ProtocolTab />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-protocol-tooltip',
    moduleKey: BackendModules.Protocol,
    key: ModerationTabKey.Protocol,
    titleKey: 'protocol-tab-title',
  },
  {
    icon: <AddUserIcon />,
    component: <Typography variant={'body2'}>Add User</Typography>,
    tooltipTranslationKey: 'moderationbar-button-add-user-tooltip',
    featureKey: FeaturesKeys.AddUser,
    key: ModerationTabKey.AddUser,
  },
  {
    icon: <WoolBallIcon />,
    component: <Typography variant={'body2'}>Wollknaul</Typography>,
    tooltipTranslationKey: 'moderationbar-button-wollknaul-tooltip',
    key: ModerationTabKey.Wollknaul,
  },
  {
    icon: <SpeakerQueueIcon />,
    component: <Typography variant={'body2'}>Speaker Queue</Typography>,
    tooltipTranslationKey: 'moderationbar-button-speaker-queue-tooltip',
    key: ModerationTabKey.SpeakerQueue,
  },
  {
    icon: <WheelOfNamesIcon />,
    component: <Typography variant={'body2'}>Wheel Of Names</Typography>,
    tooltipTranslationKey: 'moderationbar-button-wheel-tooltip',
    key: ModerationTabKey.WheelOfNames,
  },
];
