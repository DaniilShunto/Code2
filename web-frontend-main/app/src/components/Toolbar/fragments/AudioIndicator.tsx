// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

import BrowserSupport from '../../../modules/BrowserSupport';
import { SignalLevel } from '../../../modules/Media/LevelNode';
import { selectIsUserSpeaking } from '../../../store/slices/mediaSlice';
import { useMediaContext } from '../../MediaProvider';

const IndicatorContainer = styled('div')({
  overflow: 'hidden',
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: 'inherit',
});

const maxLevel = 0; // dB
const minLevel = -65; // dB
const fullCircle = 2 * Math.PI;
const startAngle = fullCircle * (2 / 12); // start at 5 o'clock
const scaleRange = (11 / 12) * fullCircle; // end at 4 o'clock
const lineWidth = 5; // px
const angleTick = Math.PI * 0.02;

const drawFillUp = (
  { peak, level }: SignalLevel,
  barColor: string,
  peakColor: string,
  ctx: CanvasRenderingContext2D
) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const audioLevelHeight = height - level * height;
  const audioPeakHeight = height - peak * height;

  ctx.fillStyle = barColor;
  ctx.strokeStyle = peakColor;
  ctx.fillRect(0, audioLevelHeight, width, height);
  ctx.beginPath();
  ctx.moveTo(0, audioPeakHeight);
  ctx.lineTo(width, audioPeakHeight);
  ctx.stroke();
};

const drawCircle = (
  { peak, level }: SignalLevel,
  barColor: string,
  peakColor: string,
  ctx: CanvasRenderingContext2D
) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const size = Math.min(width, height);
  const center = { x: width / 2, y: height / 2 };
  const radius = Math.max(1, Math.floor(size / 2 - lineWidth / 2));

  const levelAngle = scaleRange * level;
  const peakAngle = scaleRange * peak;

  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = barColor;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, startAngle, startAngle + levelAngle);
  ctx.stroke();

  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = peakColor;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, startAngle + peakAngle - angleTick, startAngle + peakAngle + angleTick);
  ctx.stroke();
};

interface AudioIndicatorProps {
  shape: 'circle' | 'bar';
}

const AudioIndicator = ({ shape }: AudioIndicatorProps) => {
  const theme = useTheme();
  const mediaContext = useMediaContext();
  const isUserSpeaking = useSelector(selectIsUserSpeaking);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const needsClearCanvasHack = useMemo(() => BrowserSupport.isSafari(), []);

  const [{ width, height }, setDimensions] = useState({ width: 2 * lineWidth, height: 2 * lineWidth });

  const handleResize = () => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const render = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d') || null;
    if (ctx === null) {
      return;
    }

    const signalLevel = mediaContext.getAudioLevel();

    if (signalLevel === undefined) {
      return;
    }
    if (needsClearCanvasHack) {
      // clearRect is broken so we need a hack:
      const width = ctx.canvas.width;
      ctx.canvas.width = width;
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const { peak, level, clip } = signalLevel;

    const peakScaled = (Math.max(peak, minLevel) - minLevel) / (maxLevel - minLevel);
    const levelScaled = (Math.max(level, minLevel) - minLevel) / (maxLevel - minLevel);

    let barColor;
    if (clip) {
      barColor = theme.palette.error.main;
    } else if (isUserSpeaking) {
      barColor = theme.palette.primary.dark;
    } else {
      barColor = theme.palette.text.disabled;
    }
    const peakColor = theme.palette.secondary.main;

    if (shape === 'circle') {
      drawCircle({ peak: peakScaled, level: levelScaled, clip }, barColor, peakColor, ctx);
    } else {
      drawFillUp({ peak: peakScaled, level: levelScaled, clip }, barColor, peakColor, ctx);
    }

    animationRef.current = requestAnimationFrame(render);
  }, [mediaContext.getAudioLevel, isUserSpeaking, theme, shape, needsClearCanvasHack]);

  useEffect(() => {
    render();
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [render]);

  return (
    <IndicatorContainer ref={containerRef}>
      <canvas ref={canvasRef} width={width} height={height} />
    </IndicatorContainer>
  );
};

export default AudioIndicator;
