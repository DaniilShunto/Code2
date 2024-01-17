// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useState } from 'react';

import StartMeetingImage from '.';

export default {
  title: 'components/StartMeetingImage',
  component: StartMeetingImage,
} as ComponentMeta<typeof StartMeetingImage>;

export const Basic: ComponentStory<typeof StartMeetingImage> = () => {
  const [animated, setAnimated] = useState<boolean>(false);

  const toggleAnimation = () => {
    setAnimated(!animated);
  };
  return (
    <div style={{ width: '300px' }}>
      <StartMeetingImage animated={animated} />

      <Button onMouseEnter={toggleAnimation} onMouseLeave={toggleAnimation} fullWidth>
        Hover to animate
      </Button>
    </div>
  );
};
