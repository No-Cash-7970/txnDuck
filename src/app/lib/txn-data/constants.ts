/** @file Constants used with transaction data */

import { ALGORAND_MIN_TX_FEE } from "algosdk";

/** Number of characters in a valid account address */
export const ADDRESS_LENGTH = 58;
/** Maximum length of a lease in bytes (or characters if only using ASCII characters) */
export const LEASE_MAX_LENGTH = 32;
/** Maximum length of a note in bytes (or characters if only using ASCII characters) */
export const NOTE_MAX_LENGTH = 1000;
/** Minimum transaction fee in microAlgos */
export const MIN_TX_FEE = ALGORAND_MIN_TX_FEE;

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
/** Allowed length of an asset's metadata hash. No more and no less (fewer), unless empty. */
export const METADATA_HASH_LENGTH = 32;
/** Maximum number of decimal places */
export const MAX_DECIMAL_PLACES = 19;

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
export const tipBtnClass = 'ms-2 opacity-70';
