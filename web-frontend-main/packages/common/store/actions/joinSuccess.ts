// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createAction } from "@reduxjs/toolkit";
import { JoinSuccessInternalState } from "../../types";

export const joinSuccess = createAction<JoinSuccessInternalState>('signaling/control/join_success');
