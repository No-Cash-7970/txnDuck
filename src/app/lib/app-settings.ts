/** @file Collection of variables and constants that contain the global state for app settings */

import { atomWithStorage, createJSONStorage } from 'jotai/utils';

/* Code adapted from https://github.com/pmndrs/jotai/discussions/1220#discussioncomment-2918007 */
const storage = createJSONStorage<any>(() => localStorage); // Set they type of storage

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
  /** Theme (default: `""` - automatic) */
  theme: Themes.auto,
  /** Ignore form validation errors when submitting a form (like the "compose transaction" form)?
   * (default: `false` - Do not ignore)
   */
  ignoreFormErrors: false,
  /** Use the suggested fee by default (default: `true` - Use suggested fee by default) */
  defaultUseSugFee: true,
  /** Use the suggested first & last valid round by default
   * (default: `true` - Use suggested rounds by default)
   */
  defaultUseSugRounds: true,
};

/** Theme mode */
export const themeAtom = atomWithStorage<Themes>('theme', defaults.theme, storage);
/** Ignore validation errors? */
export const ignoreFormErrorsAtom =
  atomWithStorage<boolean>('ignoreFormErrors', defaults.ignoreFormErrors, storage);
/** Use suggested fee by default */
export const defaultUseSugFee =
  atomWithStorage<boolean>('defaultUseSugFee', defaults.defaultUseSugFee, storage);
/** Use suggested first & last valid rounds by default */
export const defaultUseSugRounds =
  atomWithStorage<boolean>('defaultUseSugRounds', defaults.defaultUseSugRounds, storage);
