// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Popover, styled, Pagination, MenuItem } from '@mui/material';
import { WhiteboardIcon, ProtocolIcon, SharedFolderIcon, IconButton } from '@opentalk/common';
import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Logo } from '../../../assets/images/logo.svg';
import LayoutOptions from '../../../enums/LayoutOptions';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectAllOnlineParticipants } from '../../../store/slices/participantsSlice';
import { selectProtocolUrl } from '../../../store/slices/protocolSlice';
import {
  selectSharedFolderPassword,
  selectSharedFolderUrl,
  selectIsSharedFolderAvailable,
  selectIsSharedFolderOpened,
  sharedFolderOpened,
} from '../../../store/slices/sharedFolderSlice';
import {
  updatedCinemaLayout,
  selectCinemaLayout,
  setPaginationPage,
  selectPaginationPageState,
  toggleDebugMode,
  selectIsCurrentProtocolHighlighted,
} from '../../../store/slices/uiSlice';
import { selectIsCurrentWhiteboardHighlighted } from '../../../store/slices/uiSlice';
import { selectIsWhiteboardAvailable } from '../../../store/slices/whiteboardSlice';
import { MAX_GRID_TILES } from '../../GridView/GridView';
import QuickStart from '../../QuickStart';
import LayoutSelection from './LayoutSelection';
import MeetingUtilsSection from './MeetingUtilsSection';
import RoomTitle from './RoomTitle';

const HeaderItem = styled('div')<{ highlighted?: boolean }>(({ theme, highlighted }) => ({
  background: highlighted ? theme.palette.primary.main : theme.palette.background.video,
  borderRadius: '0.25rem',
  display: 'inline-flex',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  '& .MuiIconButton-root .MuiSvgIcon-root': {
    fill: highlighted ? theme.palette.background.default : theme.palette.text.primary,
  },
}));

const HeaderDivider = styled('div')(({ theme }) => ({
  display: 'flex',
  alignSelf: 'center',
  height: '50%',
  borderStyle: 'solid',
  borderLeftWidth: theme.typography.pxToRem(2),
  borderColor: theme.palette.background.voteResult,
}));

const HeaderPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root:hover': {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
  '& .Mui-selected': {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
}));

const HeaderCenterContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'center',
  height: '100%',
}));

const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  justifyContent: 'space-between',
}));

const ContentItem = styled('div')<{ lgOrder?: number }>(({ theme, lgOrder }) => ({
  [theme.breakpoints.down('lg')]: {
    order: lgOrder,
    flex: lgOrder ? '0 0 100%' : 1,
  },
}));

const DesktopMeetingHeader = () => {
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedLayout = useAppSelector(selectCinemaLayout);
  const participants = useAppSelector(selectAllOnlineParticipants);
  const selectedPage = useAppSelector(selectPaginationPageState);
  const protocolUrl = useAppSelector(selectProtocolUrl);
  const isWhiteboardAvailable = useAppSelector(selectIsWhiteboardAvailable);
  const isCurrentWhiteboardHighlighted = useAppSelector(selectIsCurrentWhiteboardHighlighted);
  const isCurrentProtocolHighlighted = useAppSelector(selectIsCurrentProtocolHighlighted);
  const showWhiteboardIcon = isWhiteboardAvailable && selectedLayout !== LayoutOptions.Whiteboard;
  const [clickCount, setClickCount] = useState(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const isSharedFolderOpened = useAppSelector(selectIsSharedFolderOpened);
  const sharedFolderUrl = useAppSelector(selectSharedFolderUrl);
  const sharedFolderPassword = useAppSelector(selectSharedFolderPassword);
  const isSharedFolderAvailable = useAppSelector(selectIsSharedFolderAvailable);

  const showDebugDialog = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
    }

    clickTimer.current = setTimeout(() => {
      setClickCount(0);
    }, 2000);

    setClickCount((clickCount) => clickCount + 1);
  };

  useEffect(() => {
    if (clickCount === 5) {
      dispatch(toggleDebugMode());
      setClickCount(0);
    }
  }, [dispatch, clickCount]);

  const logoImage = () => <Logo width={'12.8997em'} height={'2.072em'} onClick={showDebugDialog} fill={'white'} />;

  const pageCount = useMemo(() => {
    return Math.ceil(participants.length / MAX_GRID_TILES);
  }, [participants]);

  useEffect(() => {
    if (selectedPage > pageCount || selectedPage === 0) {
      dispatch(setPaginationPage(pageCount));
    }
  }, [selectedPage, pageCount, dispatch]);

  const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPaginationPage(page));
  };

  const handleSelectedView = (layout: LayoutOptions) => {
    dispatch(updatedCinemaLayout(layout));
  };

  const handleProtocolClick = useCallback(() => {
    if (selectedLayout !== LayoutOptions.Protocol) {
      handleSelectedView(LayoutOptions.Protocol);
    }
  }, [selectedLayout, handleSelectedView]);

  const renderProtocolIcon = () => {
    return (
      <HeaderItem highlighted={isCurrentProtocolHighlighted}>
        <IconButton aria-describedby={'view-select'} onClick={handleProtocolClick}>
          <ProtocolIcon />
        </IconButton>
      </HeaderItem>
    );
  };

  const renderSharedFolderIcon = () => {
    return (
      <HeaderItem highlighted={!isSharedFolderOpened}>
        <IconButton aria-describedby={'view-select'} onClick={(event) => setAnchorElement(event.currentTarget)}>
          <SharedFolderIcon />
        </IconButton>
        <Popover
          open={Boolean(anchorElement)}
          anchorEl={anchorElement}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onClose={() => setAnchorElement(null)}
          disablePortal
        >
          {sharedFolderUrl && (
            <MenuItem
              onClick={() => {
                dispatch(sharedFolderOpened());
                window.open(sharedFolderUrl, 'sharedFolder');
                setAnchorElement(null);
              }}
            >
              {t('shared-folder-open-label')}
            </MenuItem>
          )}
          {sharedFolderPassword && (
            <MenuItem
              onClick={() => {
                navigator.clipboard.writeText(sharedFolderPassword);
                setAnchorElement(null);
              }}
            >
              {t('shared-folder-password-label')}
            </MenuItem>
          )}
        </Popover>
      </HeaderItem>
    );
  };

  const handleWhiteboardClick = useCallback(() => {
    if (selectedLayout !== LayoutOptions.Whiteboard) {
      handleSelectedView(LayoutOptions.Whiteboard);
    }
  }, [selectedLayout, handleSelectedView]);

  const renderWhiteboardIcon = () => (
    <HeaderItem highlighted={isCurrentWhiteboardHighlighted}>
      <IconButton onClick={handleWhiteboardClick}>
        <WhiteboardIcon />
      </IconButton>
    </HeaderItem>
  );

  return (
    <Content>
      <ContentItem>{logoImage()}</ContentItem>
      <ContentItem lgOrder={2}>
        <HeaderCenterContainer>
          <RoomTitle />
          <LayoutSelection />
          {selectedLayout === LayoutOptions.Grid && pageCount > 1 && (
            <HeaderItem>
              <HeaderPagination
                count={pageCount > 1 ? pageCount : 0}
                page={selectedPage}
                variant="outlined"
                shape="rounded"
                siblingCount={1}
                size="small"
                hidePrevButton
                hideNextButton
                onChange={handleChangePage}
              />
            </HeaderItem>
          )}
          {(showWhiteboardIcon || protocolUrl) && (
            <>
              <HeaderDivider />
              {showWhiteboardIcon && renderWhiteboardIcon()}
              {protocolUrl && selectedLayout !== LayoutOptions.Protocol && renderProtocolIcon()}
            </>
          )}
          {isSharedFolderAvailable && renderSharedFolderIcon()}
        </HeaderCenterContainer>
      </ContentItem>
      <ContentItem>
        <HeaderCenterContainer>
          <MeetingUtilsSection />
          <QuickStart variant="room" />
        </HeaderCenterContainer>
      </ContentItem>
    </Content>
  );
};

export default DesktopMeetingHeader;
