// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { PaletteMode, PaletteOptions } from '@mui/material';

export const avatarBg = '#00212E';

export const avatarColorTable: Array<string> = [
  '#03BEF7',
  '#18BA80',
  '#FE8845',
  '#D05EFA',
  '#FD7171',
  '#F7BF03',
  '#FFFFFF',
  '#D4E862',
  '#77D854',
  '#E0386A',
  '#FFCCCC',
  '#2DEBD5',
  '#B817C1',
  '#FFF969',
  '#468EFF',
  '#765FFF',
];

const lightPalette: PaletteOptions = {
  primary: {
    main: '#D1E545',
    dark: '#C6D941',
    contrastText: '#20434F',
  },
  secondary: {
    lightest: '#EAECEB',
    lighter: '#DBE0E2',
    light: '#4C6872',
    main: '#20434F',
    dark: '#19353F',
    contrastText: '#FFF',
  },
  outline: '#DBE0E2',
  error: {
    main: '#F1554C',
    contrastText: '#FFF',
    dark: '#D32F2F',
  },
  warning: {
    main: '#FF9300',
    contrastText: '#FFF',
    dark: '#FF9800',
  },
  info: {
    main: '#239EB1',
    contrastText: '#FFF',
    dark: '#2196F3',
  },
  success: {
    main: '#3ABD9F',
    contrastText: '#FFF',
    dark: '#43A047',
  },
  text: {
    primary: '#20434F',
    secondary: '#FFF',
    disabled: '#72757B',
  },
  background: {
    default: '#F4F4F4',
    defaultGradient: 'linear-gradient(81deg, rgba(32,67,79,0.05) 0%, rgba(209,229,69,0.05) 100%)',
    paper: '#FFF',
    overlay: 'linear-gradient(81deg, rgba(32,67,79,0.05) 0%, rgba(209,229,69,0.05) 100%)',
    video: '#01010166',
    secondaryOverlay: '#20434f66',
    voteResult: '#385865',
    light: '#475b5f',
  },
  action: {
    hover: '#20434F14',
  },
  avatar: {
    background: avatarBg,
    colorTable: avatarColorTable,
  },
  notistack: {
    error: {
      backgroundColor: '#D32F2F',
      color: '#FFF',
    },
    success: {
      backgroundColor: '#43A047',
      color: '#FFF',
    },
    warning: {
      backgroundColor: '#FF9800',
      color: '#FFF',
    },
    info: {
      backgroundColor: '#2196F3',
      color: '#FFF',
    },
    primary: {
      backgroundColor: '#D1E545',
      color: '#17313A',
      hovered: '#B0C327',
    },
    secondary: {
      backgroundColor: '#17313A',
      color: '#FFF',
      hovered: '#0E1F25',
    },
  },
};

const darkPalette: PaletteOptions = {
  primary: {
    main: '#D1E545',
    dark: '#C6D941',
    contrastText: '#DBE0E2',
  },
  secondary: {
    main: '#DBE0E2',
    dark: '#CFD4D6',
    light: '#C5CACB',
    lightest: '#1F3E49',
    lighter: '#1F3E49',
    contrastText: '#17313A',
  },
  outline: '#DBE0E2',
  error: {
    main: '#F1554C',
    contrastText: '#FFF',
    dark: '#D32F2F',
  },
  warning: {
    main: '#FF9300',
    contrastText: '#FFF',
    dark: '#FF9800',
  },
  info: {
    main: '#239EB1',
    contrastText: '#FFF',
    dark: '#2196F3',
  },
  success: {
    main: '#3ABD9F',
    contrastText: '#FFF',
    dark: '#43A047',
  },
  text: {
    primary: '#FFF',
    secondary: '#20434F',
    disabled: '#72757B',
  },
  background: {
    default: '#000',
    defaultGradient: 'linear-gradient(109deg, rgba(32,67,79,1) 0%, rgba(30,59,69,1) 100%)',
    paper: '#17313A',
    overlay: 'linear-gradient(109deg, rgba(32,67,79,1) 0%, rgba(30,59,69,1) 100%)',
    video: '#01010166',
    secondaryOverlay: '#20434f66',
    voteResult: '#385865',
    light: '#475b5f',
  },
  action: {
    hover: '#20434F14',
  },
  avatar: {
    background: avatarBg,
    colorTable: avatarColorTable,
  },
  notistack: {
    error: {
      backgroundColor: '#D32F2F',
      color: '#FFF',
    },
    success: {
      backgroundColor: '#43A047',
      color: '#FFF',
    },
    warning: {
      backgroundColor: '#FF9800',
      color: '#FFF',
    },
    info: {
      backgroundColor: '#2196F3',
      color: '#FFF',
    },
    primary: {
      backgroundColor: '#D1E545',
      color: '#17313A',
      hovered: '#B0C327',
    },
    secondary: {
      backgroundColor: '#17313A',
      color: '#FFF',
      hovered: '#0E1F25',
    },
  },
};

export function getPalette(mode: PaletteMode = 'light') {
  return mode === 'light' ? lightPalette : darkPalette;
}
