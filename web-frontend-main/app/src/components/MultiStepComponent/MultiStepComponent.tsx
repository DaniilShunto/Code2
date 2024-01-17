// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Typography } from '@mui/material';
import { ArrowLeftIcon } from '@opentalk/common';
import React, { useState, ReactNode, useEffect, FunctionComponentElement, useCallback } from 'react';

const MainContainer = styled('div')(() => ({
  width: '100%',
  height: '100%',
}));

const Header = styled('div')(({ theme }) => ({
  height: '6em',
  width: '100%',
  display: 'flex',
  flexDirection: 'column-reverse',
  alignItems: 'center',
  position: 'relative',
  paddingBottom: theme.spacing(2),
}));

const HeaderBackIcon = styled('div')(({ theme }) => ({
  position: 'absolute',
  cursor: 'pointer',
  bottom: theme.spacing(2),
  left: theme.spacing(2),
}));

interface IProps {
  children: ReactNode[];
  title: string;
}

export interface IInjectedProps {
  goToPage?: (index: number) => void;
}

const MultiStepComponent = ({ children, title }: IProps) => {
  const [currentElementIndex, setCurrentElementIndex] = useState<number>(0);
  const [currentElement, setCurrentElement] = useState<FunctionComponentElement<JSX.Element>>();

  const goToPage = useCallback(
    (index: number) => {
      setCurrentElementIndex(index);
      setCurrentElement(React.cloneElement(children[index] as JSX.Element, { goToPage: goToPage }));
    },
    [children]
  );

  const prevElementHandler = () => {
    const index = currentElementIndex - 1;
    setCurrentElementIndex(index);
    setCurrentElement(React.cloneElement(children[index] as JSX.Element, { goToPage: goToPage }));
  };

  useEffect(() => {
    if (!currentElement) goToPage(0);
  }, [goToPage, currentElementIndex, currentElement]);

  return (
    <MainContainer>
      <Header>
        {currentElementIndex > 0 && (
          <HeaderBackIcon onClick={prevElementHandler}>
            <ArrowLeftIcon />
          </HeaderBackIcon>
        )}
        <Typography>{title}</Typography>
      </Header>
      {currentElement}
    </MainContainer>
  );
};
export default MultiStepComponent;
