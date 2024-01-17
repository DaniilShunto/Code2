// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { MoreIcon } from '@opentalk/common';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useFullscreenContext } from '../../../hooks/useFullscreenContext';
import MoreMenu from './MoreMenu';
import ToolbarButton from './ToolbarButton';

const MenuButton = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const fullscreenContext = useFullscreenContext();
  const closeMenu = () => {
    fullscreenContext.setHasActiveOverlay(false);
    setShowMenu(false);
  };
  const openMenu = () => {
    fullscreenContext.setHasActiveOverlay(true);
    setShowMenu(true);
  };

  return (
    <div ref={menuRef}>
      <ToolbarButton
        tooltipTitle={t('toolbar-button-more-tooltip-title')}
        active={showMenu}
        onClick={openMenu}
        data-testid="toolbarMenuButton"
      >
        <MoreIcon />
      </ToolbarButton>
      <MoreMenu onClose={closeMenu} anchorEl={menuRef.current} open={showMenu} />
    </div>
  );
};

export default MenuButton;
