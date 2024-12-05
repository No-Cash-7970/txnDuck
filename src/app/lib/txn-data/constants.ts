/** @file Constants used with transaction data */

/** Number of characters in a valid account address */
export const ADDRESS_LENGTH = 58;
/** Length of a lease in bytes (or characters if only using ASCII characters) */
export const LEASE_LENGTH = 32;
/** Length of a lease when encoded in base64
 *
 * Equation to find length of base64 string for a given number of bytes:
 * `b64_length = (num_bytes + 2) / 3 * 4`
 * (From: https://stackoverflow.com/a/60067262)
 */
export const B64_LEASE_LENGTH = 44; // (32 + 2) / 3 * 4
/** Maximum length of a note in bytes (or characters if only using ASCII characters) */
export const NOTE_MAX_LENGTH = 1000;
/** Maximum length of a note when encoded in base64
 *
 * Equation to find length of base64 string for a given number of bytes:
 * `b64_length = (num_bytes + 2) / 3 * 4`
 * (From: https://stackoverflow.com/a/60067262)
 */
export const B64_NOTE_MAX_LENGTH = 1336; // (1000 + 2) / 3 * 4
/** Minimum transaction fee in microAlgos */
export const MIN_TX_FEE = 1000;
/** Maximum number of rounds a transaction can be valid. In other words, the maximum difference
 * between the first valid round (fv) and the last valid round (lv).
 *
 * `lv - fv <= Max`
 */
export const MAX_VALID_ROUNDS_PERIOD = 1000;

// eslint-disable-next-line max-len
// From https://developer.algorand.org/docs/get-details/transactions/transactions/#asset-configuration-transaction
/** Maximum length of an asset's unit name in bytes
 * (or characters if only using ASCII characters)
 */
export const UNIT_NAME_MAX_LENGTH = 8;
/** Maximum length of an asset's name in bytes (or characters if only using ASCII characters) */
export const ASSET_NAME_MAX_LENGTH = 32;
/** Maximum length of an asset's URL in bytes (or characters if only using ASCII characters) */
export const URL_MAX_LENGTH = 96;
/** Length of an asset's metadata hash. No more and no less (fewer), unless empty. */
export const METADATA_HASH_LENGTH = 32;
/** Length of a metadata hash when encoded in base64
 *
 * Equation to find length of base64 string for a given number of bytes:
 * `b64_length = (num_bytes + 2) / 3 * 4`
 * (From: https://stackoverflow.com/a/60067262)
 */
export const B64_METADATA_HASH_LENGTH = 44; // (32 + 2) / 3 * 4
/** Maximum number of decimal places */
export const MAX_DECIMAL_PLACES = 19;
/** Maximum number for total */
export const MAX_ASSET_TOTAL = BigInt(2**64) - BigInt(1);

/** Length of a voter key, which is encoded in base64
 *
 * Equation to find length of base64 string for a given number of bytes:
 * `b64_length = (num_bytes + 2) / 3 * 4`
 * (From: https://stackoverflow.com/a/60067262)
 */
export const VOTE_KEY_LENGTH = 44; // (32 + 2) / 3 * 4
/** Length of a selection key, which is encoded in base64
 *
 * Equation to find length of base64 string for a given number of bytes:
 * `b64_length = (num_bytes + 2) / 3 * 4`
 * (From: https://stackoverflow.com/a/60067262)
 */
export const SELECTION_KEY_LENGTH = 44; // (32 + 2) / 3 * 4
/** Length of a state proof key, which is encoded in base64
 *
 * Equation to find length of base64 string for a given number of bytes:
 * `b64_length = (num_bytes + 2) / 3 * 4`
 * (From: https://stackoverflow.com/a/60067262)
 */
export const STATE_PROOF_KEY_LENGTH = 88; // (64 + 2) / 3 * 4

// Sources:
// https://developer.algorand.org/docs/get-details/parameter_tables/
// https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#resource-availability
/** Maximum number of total dependencies allowed in a single transaction */
export const MAX_APP_TOTAL_DEPS = 8;
/** Maximum number of total application arguments allowed in a single transaction */
export const MAX_APP_ARGS = 16;
/** Maximum number of total application global integers and bytes allowed */
export const MAX_APP_GLOBALS = 64;
/** Maximum number of total application local integers and bytes allowed */
export const MAX_APP_LOCALS = 16;
/** Maximum number of application extra pages allowed in a single transaction */
export const MAX_APP_EXTRA_PAGES = 3;
/** Maximum number of application accounts allowed in a single transaction */
export const MAX_APP_ACCTS = 4;
/** Maximum length of a key in application storage in bytes
 * (or characters if only using ASCII characters)
 */
export const MAX_APP_KEY_LENGTH = 64;

/** Class(es) for the content of the tooltips for fields */
export const tipContentClass = 'text-sm rounded-md py-2 px-4 bg-accent text-accent-content'
  + ' stroke-accent fill-accent sm:max-w-sm max-w-[var(--radix-popover-content-available-width)]';
/** Class(es) for the button that triggers the tooltip for a field */
export const tipBtnClass = 'ms-3 opacity-70';

/** Collection of keys, or "names" of the transaction presets */
export enum Preset {
  /** Preset query parameter name */
  ParamName = 'preset',

  /** Transfer native currency */
  Transfer = 'transfer',
  /** Transfer algos (alternative to 'transfer') */
  TransferAlgos = 'transfer_algos',
  /** Rekey account */
  RekeyAccount = 'rekey_account',
  /** Close account */
  CloseAccount = 'close_account',

  /** Asset transfer */
  AssetTransfer = 'asset_transfer',
  /** Asset opt in */
  AssetOptIn = 'asset_opt_in',
  /** Asset opt out */
  AssetOptOut = 'asset_opt_out',
  /** Asset create */
  AssetCreate = 'asset_create',
  /** Asset reconfigure */
  AssetReconfig = 'asset_reconfig',
  /** Asset revoke (claw back) */
  AssetClawback = 'asset_clawback',
  /** Asset destroy */
  AssetDestroy = 'asset_destroy',
  /** Asset freeze */
  AssetFreeze = 'asset_freeze',
  /** Asset unfreeze */
  AssetUnfreeze = 'asset_unfreeze',

  /** Application run */
  AppRun = 'app_run',
  /** Application opt in */
  AppOptIn = 'app_opt_in',
  /** Application deploy */
  AppDeploy = 'app_deploy',
  /** Application update */
  AppUpdate = 'app_update',
  /** Application close */
  AppClose = 'app_close',
  /** Application clear */
  AppClear = 'app_clear',
  /** Application delete */
  AppDelete = 'app_delete',

  /** Register online */
  RegOnline = 'reg_online',
  /** Register offline */
  RegOffline = 'reg_offline',
  /** Register nonparticipation */
  RegNonpart = 'reg_nonpart'
}
