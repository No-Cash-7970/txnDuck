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
  /** Use the suggested fee by default? */
  defaultUseSugFee: true,
  /** Use the suggested first & last valid round by default? */
  defaultUseSugRounds: true,
  /** Set manager address to the sender address by default? */
  defaultApar_mUseSnd: true,
  /** Set freeze address to the sender address by default? */
  defaultApar_fUseSnd: true,
  /** Set clawback address to the sender address by default? */
  defaultApar_cUseSnd: true,
  /** Set reserve address to the sender address by default? */
  defaultApar_rUseSnd: true,
  /** Retrieve asset information when asset ID is entered? */
  assetInfoGet: true,
  /** Automatically send after signing by default? */
  defaultAutoSend: true,
  /** Always clear transaction data after sending? */
  alwaysClearAfterSend: true,
  /** Hide send information details by default? */
  defaultHideSendInfo: true,
} as const;

/** Theme mode */
export const themeAtom = atomWithStorage<Themes>('theme', defaults.theme, storage);
/** Ignore validation errors? */
export const ignoreFormErrorsAtom =
  atomWithStorage<boolean>('ignoreFormErrors', defaults.ignoreFormErrors, storage);
/** Use suggested fee by default? */
export const defaultUseSugFee =
  atomWithStorage<boolean>('defaultUseSugFee', defaults.defaultUseSugFee, storage);
/** Use suggested first & last valid rounds by default? */
export const defaultUseSugRounds =
  atomWithStorage<boolean>('defaultUseSugRounds', defaults.defaultUseSugRounds, storage);
/**  Set manager address to the sender address by default? */
export const defaultApar_mUseSnd =
  atomWithStorage<boolean>('defaultApar_mUseSnd', defaults.defaultApar_mUseSnd, storage);
/**  Set freeze address to the sender address by default? */
export const defaultApar_fUseSnd =
  atomWithStorage<boolean>('defaultApar_fUseSnd', defaults.defaultApar_fUseSnd, storage);
/**  Set clawback address to the sender address by default? */
export const defaultApar_cUseSnd =
  atomWithStorage<boolean>('defaultApar_cUseSnd', defaults.defaultApar_cUseSnd, storage);
/**  Set reserve address to the sender address by default? */
export const defaultApar_rUseSnd =
  atomWithStorage<boolean>('defaultApar_rUseSnd', defaults.defaultApar_rUseSnd, storage);
/** Retrieve asset information when asset ID is entered? */
export const assetInfoGet =
  atomWithStorage<boolean>('getAssetInfo', defaults.assetInfoGet, storage);
/** Automatically send after signing by default? */
export const defaultAutoSend =
  atomWithStorage<boolean>('defaultAutoSend', defaults.defaultAutoSend, storage);
/** Always clear transaction data after sending? */
export const alwaysClearAfterSend =
  atomWithStorage<boolean>('alwaysClearAfterSend', defaults.alwaysClearAfterSend, storage);
/** Always clear transaction data after sending? */
export const defaultHideSendInfo =
  atomWithStorage<boolean>('defaultHideSendInfo', defaults.defaultHideSendInfo, storage);
