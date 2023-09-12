/** @file Collection of variables that contain the global state for app settings */

import { atomWithStorage } from 'jotai/utils';

/** List of themes */
export enum Themes  {
  /** Automatic. Detect user's system theme preference & use it to determine which theme to use. */
  auto = '',
  /** Light theme */
  light = 'duck',
  /** Dark theme */
  dark = 'duck_dark',
};

/** The default values for all settings */
export const defaults = {
  /** Default theme: `''` (automatic) */
  theme: Themes.auto,
};

/** Theme mode */
export const themeAtom = atomWithStorage('theme', defaults.theme);
