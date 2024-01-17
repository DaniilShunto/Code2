// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createAction } from "@reduxjs/toolkit";
import { TimerStarted, TimerStopped } from "../../types";

export const timerStarted = createAction<TimerStarted>('signaling/timer/started');
export const timerStopped = createAction<TimerStopped>('signaling/timer/stopped');
