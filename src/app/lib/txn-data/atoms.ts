/** @file Jotai atoms for transaction data */

import { microalgosToAlgos, OnApplicationComplete, type TransactionType } from 'algosdk';
import { Atom, atom } from 'jotai';
import { splitAtom } from 'jotai/utils';
import { atomWithValidate } from 'jotai-form';
import { base64RegExp, validationAtom, ValidationMessage } from '@/app/lib/utils';
import {
  ASSET_NAME_MAX_LENGTH,
  MAX_APP_EXTRA_PAGES,
  MAX_ASSET_TOTAL,
  MAX_DECIMAL_PLACES,
  MIN_TX_FEE,
  SELECTION_KEY_LENGTH,
  STATE_PROOF_KEY_LENGTH,
  UNIT_NAME_MAX_LENGTH,
  URL_MAX_LENGTH,
  VOTE_KEY_LENGTH
} from './constants';
import type {
  BoxRefAtomGroup,
  RetrievedAssetInfo,
} from './types';
import { addressSchema, idSchema, YupMixed, YupNumber, YupString } from './validation-rules';

/*
 * General
 */

/** Transaction type */
export const txnType = atomWithValidate<Omit<TransactionType, 'stpf'>|undefined>(undefined, {
  validate: v => { YupString().required().validateSync(v); return v; }
});

/** Sender */
export const snd = atomWithValidate<string>('', {
  validate: v => {
    addressSchema.required().validateSync(v === '' ? undefined : v);
    return v;
  }
});

/** Fee (in Algos, not microAlgos) */
export const fee = atomWithValidate<number|undefined>(undefined, {
  validate: v => { YupNumber().validateSync(v); return v; }
});

/** Minimum Fee (in Algos, not microAlgos) */
export const minFee = atomWithValidate<number>(microalgosToAlgos(MIN_TX_FEE), {
  validate: v => { YupNumber().validateSync(v); return v; }
});

/** Use suggested fee */
export const useSugFee = atomWithValidate<boolean>(true, { validate: v => v });

/** Note */
export const note = atomWithValidate<string|undefined>(undefined, { validate: v => v });

/** Interpret note value as Base64 data */
export const b64Note = atomWithValidate<boolean>(false, { validate: v => v });

/** First round */
export const fv = atomWithValidate<number|undefined>(undefined, {
  validate: v => { YupNumber().min(1).validateSync(v); return v; }
});

/** Last round */
export const lv = atomWithValidate<number|undefined>(undefined, {
  validate: v => { YupNumber().min(1).validateSync(v); return v; }
});

/** Use suggested first & last valid rounds */
export const useSugRounds = atomWithValidate<boolean>(true, { validate: v => v });

/** Lease */
export const lx = atomWithValidate<string>('', { validate: v => v });

/** Interpret lease value as Base64 data */
export const b64Lx = atomWithValidate<boolean>(false, { validate: v => v });

/** Rekey to */
export const rekey = atomWithValidate<string>('', {
  validate: v => {
    addressSchema.validateSync(v === '' ? undefined : v);
    return v;
  }
});

/*
 * Payment
 */

/** Payment - Receiver */
export const rcv = atomWithValidate<string>('', {
  validate: v => {
    addressSchema.required().validateSync(v === '' ? undefined : v);
    return v;
  }
});

/** Payment - Amount */
export const amt = atomWithValidate<number|undefined>(undefined, {
  validate: v => {
    YupNumber().required().min(0).validateSync(v);
    return v;
  }
});

/** Payment - Close remainder to */
export const close = atomWithValidate<string>('', {
  validate: v => {
    addressSchema.validateSync(v === '' ? undefined : v);
    return v;
  }
});

/*
 * Retrieved Asset Information
 */

export const retrievedAssetInfo = atomWithValidate<RetrievedAssetInfo|undefined>(undefined, {
  validate: v => v
});

/*
 * Asset Transfer
 */

/** Asset transfer - Asset ID */
export const xaid = atomWithValidate<number|undefined>(undefined, {
  validate: v => { idSchema.required().validateSync(v); return v; }
});

/** Asset transfer - Clawback Target (the account from which the asset will be clawed back) */
export const asnd = atomWithValidate<string>('', {
  validate: v => {
    addressSchema.validateSync(v === '' ? undefined : v);
    return v;
  }
});

/** Asset transfer - Asset receiver */
export const arcv = atomWithValidate<string>('', {
  validate: v => {
    addressSchema.required().validateSync(v === '' ? undefined : v);
    return v;
  }
});

/** Asset transfer - Asset amount */
export const aamt = atomWithValidate<number|string>('', {
  validate: v => {
    YupNumber().required().min(0).validateSync(v === '' ? undefined : v);
    return v;
  }
});

/** Asset transfer - Close remainder of asset to */
export const aclose = atomWithValidate<string>('', {
  validate: v => {
    addressSchema.validateSync(v === '' ? undefined : v);
    return v;
  }
});

/*
 * Asset Configuration
 */

/** Asset configuration - Asset ID */
export const caid = atomWithValidate<number|undefined>(undefined, {
  validate: v => { idSchema.validateSync(v); return v; }
});

/** Asset configuration - Unit name */
export const apar_un = atomWithValidate<string>('', {
  validate: v => {
    YupString().max(UNIT_NAME_MAX_LENGTH).validateSync(v === '' ? undefined : v);
    return v;
  }
});

/** Asset configuration - Asset name */
export const apar_an = atomWithValidate<string>('', {
  validate: v => {
    YupString().max(ASSET_NAME_MAX_LENGTH).validateSync(v === '' ? undefined : v);
    return v;
  }
});

/** Asset configuration - Total */
export const apar_t = atomWithValidate<number|string>('', {
  validate: v => {
    const max = MAX_ASSET_TOTAL;
    const min = 0;

    // Custom `min` and `max` validation is required because the usual `min()` and `max()`
    // validation functions cause a loss in precision because they cast a `BigInt` into a
    // `Number`
    YupMixed()
    .test({
      name: 'min',
      message: {
        key: 'form.error.number.min',
        dict: {min: min}
      },
      exclusive: true,
      params: { min },
      skipAbsent: true,
      test: value => BigInt(value?.toString() ?? 0) >= min,
    })
    .test({
      name: 'max',
      message: {
        key: 'form.error.number.max',
        dict: {max: max.toString()}
      },
      exclusive: true,
      params: { max },
      skipAbsent: true,
      test: value => BigInt(value?.toString() ?? 0) <= max,
    })
    .validateSync(v === '' ? undefined : v);

    return v;
  }
});

/** Asset configuration - Number of decimals places */
export const apar_dc = atomWithValidate<number|undefined>(undefined, {
  validate: v => {
    YupNumber().min(0).max(MAX_DECIMAL_PLACES).validateSync(v);
    return v;
  }
});

/** Asset configuration - Frozen by default? */
export const apar_df = atomWithValidate<boolean>(false, { validate: v => v });

/** Asset configuration - URL */
export const apar_au = atomWithValidate<string>('', {
  validate: v => {
    YupString().max(URL_MAX_LENGTH).validateSync(v === '' ? undefined : v);
    return v;
  }
});

/** Asset configuration - Manager address */
export const apar_m = atomWithValidate<string>('', {
  validate: v => {
    addressSchema.validateSync(v === '' ? undefined : v);
    return v;
  }
});
/** Asset configuration - Use sender as manager address */
export const apar_mUseSnd = atomWithValidate<boolean>(true, { validate: v => v });

/** Asset configuration - Freeze address */
export const apar_f = atomWithValidate<string>('', {
  validate: v => {
    addressSchema.validateSync(v === '' ? undefined : v);
    return v;
  }
});
/** Asset configuration - Use sender as freeze address */
export const apar_fUseSnd = atomWithValidate<boolean>(true, { validate: v => v });

/** Asset configuration - Clawback address */
export const apar_c = atomWithValidate<string>('', {
  validate: v => {
    addressSchema.validateSync(v === '' ? undefined : v);
    return v;
  }
});
/** Asset configuration - Use sender as clawback address */
export const apar_cUseSnd = atomWithValidate<boolean>(true, { validate: v => v });

/** Asset configuration - Reserve address */
export const apar_r = atomWithValidate<string>('', {
  validate: v => {
    addressSchema.validateSync(v === '' ? undefined : v);
    return v;
  }
});
/** Asset configuration - Use sender as reserve address */
export const apar_rUseSnd = atomWithValidate<boolean>(true, { validate: v => v });

/** Asset configuration - Metadata hash */
export const apar_am = atomWithValidate<string>('', { validate: v => v });

/** Interpret metadata hash value as Base64 data */
export const b64Apar_am = atomWithValidate<boolean>(false, { validate: v => v });

/*
 * Asset Freeze
 */

/** Asset freeze - Asset ID */
export const faid = atomWithValidate<number|undefined>(undefined, {
  validate: v => { idSchema.required().validateSync(v); return v; }
});

/** Asset freeze - Freeze address */
export const fadd = atomWithValidate<string>('', {
  validate: v => {
    addressSchema.required().validateSync(v === '' ? undefined : v);
    return v;
  }
});

/** Asset freeze - Freeze asset? */
export const afrz = atomWithValidate<boolean>(false, { validate: v => v });

/*
 * Application
 */

/** Application - Application ID */
export const apid = atomWithValidate<number|undefined>(undefined, {
  validate: v => { idSchema.validateSync(v); return v; }
});

/** Application - OnComplete (Action type) */
export const apan = atomWithValidate<OnApplicationComplete>(0, {
  validate: v => { YupNumber().required().validateSync(v); return v; }
});

// NOTE: A validation atom must be wrapped in a regular atom to be used in a `splitAtom` array
/** Application - Application arguments */
export const apaaListAtom = atom<validationAtom<string>[]>([]);
/** Application - Collection of atoms for application arguments */
export const apaa = splitAtom(apaaListAtom);
/** Interpret application argument values as Base64 data */
export const b64Apaa = atomWithValidate<boolean>(false, { validate: v => v });
/** Validation states for Base64 application arguments */
export const b64ApaaCondList: Atom<any>[] = [];

/*
 * Application properties
 */

/** Application properties - Approval program */
export const apap = atomWithValidate<string>('', {
  validate: v => {
    YupString().matches(base64RegExp, {
      excludeEmptyString: true,
      message: (): ValidationMessage => ({key: 'fields.base64.error'})
    }).validateSync(v);

    return v;
  }
});

/** Application properties - Clear-state program */
export const apsu = atomWithValidate<string>('', {
  validate: v => {
    YupString().matches(base64RegExp, {
      excludeEmptyString: true,
      message: (): ValidationMessage => ({key: 'fields.base64.error'})
    }).validateSync(v);

    return v;
  }
});

/** Application properties - Number of global integers */
export const apgs_nui = atomWithValidate<number|undefined>(undefined, {
  validate: v => {
    YupNumber().min(0).validateSync(v);
    return v;
  }
});

/** Application properties - Number of global bytes slices */
export const apgs_nbs = atomWithValidate<number|undefined>(undefined, {
  validate: v => {
    YupNumber().min(0).validateSync(v);
    return v;
  }
});

/** Application properties - Number of local integers */
export const apls_nui = atomWithValidate<number|undefined>(undefined, {
  validate: v => {
    YupNumber().min(0).validateSync(v);
    return v;
  }
});

/** Application properties - Number of local bytes slices */
export const apls_nbs = atomWithValidate<number|undefined>(undefined, {
  validate: v => {
    YupNumber().min(0).validateSync(v);
    return v;
  }
});

/** Application properties - Number of extra program pages */
export const apep = atomWithValidate<number|undefined>(undefined, {
  validate: v => {
    YupNumber().min(0).max(MAX_APP_EXTRA_PAGES).validateSync(v);
    return v;
  }
});

/*
 * Application dependencies
 */

// NOTE: A validation atom must be wrapped in a regular atom to be used in a `splitAtom` array

/** Application dependencies - Foreign accounts */
export const apatListAtom = atom<validationAtom<string>[]>([]);
/** Application dependencies - Collection of atoms for foreign accounts */
export const apat = splitAtom(apatListAtom);

/** Application dependencies - Foreign applications */
export const apfaListAtom = atom<validationAtom<number|null>[]>([]);
/** Application dependencies - Collection of atoms for foreign applications */
export const apfa = splitAtom(apfaListAtom);

/** Application dependencies - Foreign assets */
export const apasListAtom = atom<validationAtom<number|null>[]>([]);
/** Application dependencies - Collection of atoms for foreign assets */
export const apas = splitAtom(apasListAtom);

/** Application dependencies - Box references */
export const apbxListAtom = atom<BoxRefAtomGroup[]>([]);
/** Application dependencies - Collection of atoms for box references */
export const apbx = splitAtom(apbxListAtom);

/*
 * Key Registration
 */

/** Key Registration - Voting key */
export const votekey = atomWithValidate<string>('', { validate: v => {
  let validationSchema = YupString();

  // Check the length only when the field value is nonempty
  if (v) validationSchema = validationSchema.length(VOTE_KEY_LENGTH);

  validationSchema.matches(base64RegExp, {
    excludeEmptyString: true,
    message: (): ValidationMessage => ({key: 'fields.base64.error'})
  }).validateSync(v);
  return v;
}});

/** Key Registration - Selection key */
export const selkey = atomWithValidate<string>('', { validate: v => {
  let validationSchema = YupString();

  // Check the length only when the field value is nonempty
  if (v) validationSchema = validationSchema.length(SELECTION_KEY_LENGTH);

  validationSchema.matches(base64RegExp, {
    excludeEmptyString: true,
    message: (): ValidationMessage => ({key: 'fields.base64.error'})
  }).validateSync(v);
  return v;
}});

/** Key Registration - State proof key */
export const sprfkey = atomWithValidate<string>('', { validate: v => {
  let validationSchema = YupString();

  // Check the length only when the field value is nonempty
  if (v) validationSchema = validationSchema.length(STATE_PROOF_KEY_LENGTH);

  validationSchema.matches(base64RegExp, {
    excludeEmptyString: true,
    message: (): ValidationMessage => ({key: 'fields.base64.error'})
  }).validateSync(v);
  return v;
}});

/** Key Registration - First voting round */
export const votefst = atomWithValidate<number|undefined>(undefined, {
  validate: v => { YupNumber().min(1).validateSync(v); return v; }
});

/** Key Registration - Last voting round */
export const votelst = atomWithValidate<number|undefined>(undefined, {
  validate: v => { YupNumber().min(1).validateSync(v); return v; }
});

/** Key Registration - Voting key dilution */
export const votekd = atomWithValidate<number|undefined>(undefined, {
  validate: v => { YupNumber().min(0).validateSync(v); return v; }
});

/** Key Registration - Nonparticipation */
export const nonpart = atomWithValidate<boolean>(false, { validate: v => v });
