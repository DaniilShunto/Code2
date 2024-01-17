// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ParticipantId } from '@opentalk/common';
import fscreen from 'fscreen';
import React, { createContext, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

export interface ExtendedFullScreenHandle {
  node: React.MutableRefObject<HTMLDivElement | null>;
  active: boolean;
  enter: (participantId?: ParticipantId) => void;
  exit: () => void;
  fullscreenParticipantID: ParticipantId | undefined;
  hasActiveOverlay: boolean;
  setHasActiveOverlay: (hasActiveOverlay: boolean) => void;
  rootElement: HTMLElement | null;
  setRootElement: (element: HTMLElement | null) => void;
}

export const FullscreenContext = createContext<ExtendedFullScreenHandle | null>(null);

const FullscreenProvider = ({ children }: { children: ReactNode }) => {
  const node = useRef<HTMLDivElement | null>(null);
  const [fullscreenParticipantID, setFullscreenParticipantID] = useState<ParticipantId | undefined>(undefined);
  const [rootElement, setRootElement] = useState<HTMLElement | null>(document?.body ?? null);
  const [active, setActive] = useState<boolean>(false);
  const [hasActiveOverlay, setHasActiveOverlay] = useState<boolean>(false);

  const enter = useCallback((participantId?: ParticipantId) => {
    if (node.current) {
      setFullscreenParticipantID(participantId);
      return fscreen.requestFullscreen(node.current);
    }
  }, []);

  const exit = useCallback(() => {
    return fscreen.exitFullscreen();
  }, []);

  useEffect(() => {
    const handleChange = () => {
      setActive(Boolean(fscreen.fullscreenElement));
    };
    fscreen.addEventListener('fullscreenchange', handleChange);
    return () => fscreen.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const extendedFullscreenHandle = {
    node,
    active,
    enter,
    exit,
    fullscreenParticipantID,
    hasActiveOverlay,
    setHasActiveOverlay,
    rootElement,
    setRootElement,
  };

  return <FullscreenContext.Provider value={extendedFullscreenHandle}>{children}</FullscreenContext.Provider>;
};

export default FullscreenProvider;
