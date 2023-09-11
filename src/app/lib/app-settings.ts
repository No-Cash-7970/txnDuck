/** @file Collection of variable that contain the global state for app settings */

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export enum ThemeModes  {
  /** Automtic. Detect user's system theme preference and use it to determine which theme to use. */
  auto = '',
  /** Light theme */
  light = 'duck',
  /** Dark theme */
  dark = 'duck_dark',
};

/** Theme mode */
export const darkModeAtom = atomWithStorage('darkMode', ThemeModes.auto);
