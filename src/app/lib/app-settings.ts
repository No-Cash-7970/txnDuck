/** @file Collection of variable that contain the global state for app settings */

import { atomWithStorage } from 'jotai/utils';

export enum Themes  {
  /** Automatic. Detect user's system theme preference & use it to determine which theme to use. */
  auto = '',
  /** Light theme */
  light = 'duck',
  /** Dark theme */
  dark = 'duck_dark',
};

/** Theme mode */
export const themeAtom = atomWithStorage('theme', Themes.auto);
