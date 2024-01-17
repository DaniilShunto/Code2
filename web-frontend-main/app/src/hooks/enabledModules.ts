// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { useMemo } from 'react';

import { useAppSelector } from '.';
import { selectEnabledModules } from '../store/slices/configSlice';

export function useEnabledModules() {
  const enabledModules = useAppSelector(selectEnabledModules);

  return useMemo(() => {
    return new Set(enabledModules);
  }, [enabledModules]);
}
