// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Badge, Drawer as MuiDrawer, Stack, styled } from '@mui/material';
import { IconButton as DefaultIconButton, LogoSmallIcon } from '@opentalk/common';
import { BackendModules } from '@opentalk/common';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ModerationTabKey, Tab } from '../../../../config/moderationTabs';
import { useAppDispatch, useAppSelector, useTabs } from '../../../../hooks';
import { EnterpriseProvider } from '../../../../provider/EnterpriseProvider';
import { selectUnreadGlobalMessageCount, selectUnreadPersonalMessageCount } from '../../../../store/slices/chatSlice';
import { selectIsSharedFolderAvailableIndicatorVisible } from '../../../../store/slices/sharedFolderSlice';
import {
  selectActiveTab,
  selectIsCurrentProtocolHighlighted,
  selectIsCurrentWhiteboardHighlighted,
  setActiveTab,
} from '../../../../store/slices/uiSlice';
import { selectIsModerator } from '../../../../store/slices/userSlice';
import DrawerTab from './DrawerTab';

const DrawerContentContainer = styled(Stack)(({ theme }) => ({
  height: '100%',
  width: '100%',
  background: theme.palette.background.video,
  padding: theme.spacing(1, 1),
  overflow: 'auto',
}));

const IconButton = styled(DefaultIconButton)(({ theme }) => ({
  background: theme.palette.background.video,
  borderRadius: '0.25rem',
  width: 'auto',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0),
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
  },
}));

const StyledDrawer = styled(MuiDrawer)(({ theme }) => ({
  '& .MuiPaper-root.MuiDrawer-paper': {
    width: '80%',
    background: theme.palette.background.defaultGradient,
  },
}));

const Indicator = styled(Badge)(({ theme }) => ({
  position: 'absolute',
  top: '25%',
  right: '15%',
  width: '0.75rem',
  height: '0.75rem',
  transform: 'translate(50%, -50%)',
  borderRadius: '50%',
  background: theme.palette.primary.main,
}));

const Drawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const activeTab = useAppSelector(selectActiveTab);
  const dispatch = useAppDispatch();
  const tabs = useTabs();
  const unreadGlobalMessageCount = useAppSelector(selectUnreadGlobalMessageCount);
  const unreadPersonalMessageCount = useAppSelector(selectUnreadPersonalMessageCount);
  const isCurrentWhiteboardHighlighted = useAppSelector(selectIsCurrentWhiteboardHighlighted);
  const isCurrentProtocolHighlighted = useAppSelector(selectIsCurrentProtocolHighlighted);
  const isSharedFolderAvailableIndicatorVisible = useAppSelector(selectIsSharedFolderAvailableIndicatorVisible);
  const isModerator = useAppSelector(selectIsModerator);

  const showIndicator =
    unreadGlobalMessageCount > 0 ||
    unreadPersonalMessageCount > 0 ||
    isCurrentWhiteboardHighlighted ||
    isCurrentProtocolHighlighted ||
    isSharedFolderAvailableIndicatorVisible;

  const handleSetActiveTab = (tabKey: ModerationTabKey) => {
    dispatch(setActiveTab(tabKey));
  };

  const { t } = useTranslation();

  const getTabTitle = (tab: Tab) => {
    if (tab.titleKey) {
      return t(`${tab.titleKey}`);
    }
    if (tab.key === ModerationTabKey.Home) {
      return t(`${tab.tooltipTranslationKey}`);
    }

    return '';
  };

  const HomeTab = tabs.find((tab) => tab.key === ModerationTabKey.Home);

  const Tabs = tabs.map((tab) => {
    if (
      !tab.divider &&
      //Temporary disabling of voting and polls until they are taken care of by separate issue
      !(tab.moduleKey === BackendModules.LegalVote || tab.moduleKey === BackendModules.Polls)
    ) {
      return (
        <DrawerTab
          key={tab.key}
          tabTitle={getTabTitle(tab)}
          disabled={tab.disabled}
          active={activeTab === tab.key}
          handleClick={() => handleSetActiveTab(tab.key)}
        >
          {/* As part of follow-up issue creating tabs this should either be included as a wrapper to each tab component
          or some other way to prevent duplication with MeetingSidebar.tsx */}
          <EnterpriseProvider moduleKey={tab.moduleKey}>{tab.component}</EnterpriseProvider>
        </DrawerTab>
      );
    }
  });

  return (
    <>
      <IconButton onClick={() => setIsDrawerOpen(true)}>
        <LogoSmallIcon />
        {showIndicator && <Indicator />}
      </IconButton>
      <StyledDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        {isModerator && <DrawerContentContainer>{Tabs}</DrawerContentContainer>}
        {!isModerator && HomeTab && (
          <DrawerContentContainer>
            <DrawerTab
              key={HomeTab.key}
              tabTitle={getTabTitle(HomeTab)}
              disabled={HomeTab.disabled}
              active={activeTab === HomeTab.key}
              handleClick={() => handleSetActiveTab(HomeTab.key)}
            >
              {/* As part of follow-up issue creating tabs this should either be included as a wrapper to each tab component
          or some other way to prevent duplication with MeetingSidebar.tsx */}
              <EnterpriseProvider moduleKey={HomeTab.moduleKey}>{HomeTab.component}</EnterpriseProvider>
            </DrawerTab>
          </DrawerContentContainer>
        )}
      </StyledDrawer>
    </>
  );
};

export default Drawer;
