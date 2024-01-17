// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch } from '../store';

export { useDisplayName } from './ui';
export * from './time';
export { default as useTabs } from './useTabs';
export { default as useRemainingDurationOfTimer } from './useRemainingDurationOfTimer';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector;
