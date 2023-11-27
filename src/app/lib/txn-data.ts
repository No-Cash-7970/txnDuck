/** @file Collection of variables that contain the global state for transaction form data */

import {
  ALGORAND_MIN_TX_FEE,
  microalgosToAlgos,
  OnApplicationComplete,
  type TransactionType
} from 'algosdk';
import { atom, SetStateAction, WritableAtom } from 'jotai';
import { atomWithFormControls, atomWithValidate, validateAtoms } from 'jotai-form';
import { SyncState } from 'jotai-form/dist/src/atomWithValidate';
import { atomWithStorage, createJSONStorage, splitAtom } from 'jotai/utils';
import {
  number as YupNumber,
  string as YupString,
  mixed as YupMixed,
  setLocale as YupSetLocale,
} from 'yup';

export const ADDRESS_LENGTH = 58;
export const LEASE_MAX_LENGTH = 32; // The max length if only ASCII characters are used
export const NOTE_MAX_LENGTH = 250; // In UTF-8 characters, not bytes
export const MIN_TX_FEE = ALGORAND_MIN_TX_FEE;

// eslint-disable-next-line max-len
// From https://developer.algorand.org/docs/get-details/transactions/transactions/#asset-configuration-transaction
export const UNIT_NAME_MAX_LENGTH = 8;
export const ASSET_NAME_MAX_LENGTH = 32;
export const URL_MAX_LENGTH = 96;
export const METADATA_HASH_MAX_LENGTH = 32;
export const MAX_DECIMAL_PLACES = 19;

// https://developer.algorand.org/docs/get-details/parameter_tables/
// https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#resource-availability
export const MAX_APP_TOTAL_DEPS = 8; // Max total dependencies
export const MAX_APP_ARGS = 16;
export const MAX_APP_GLOBALS = 64;
export const MAX_APP_LOCALS = 16;
export const MAX_APP_EXTRA_PAGES = 3;
export const MAX_APP_ACCTS = 4; // Max app accounts
export const MAX_APP_KEY_LENGTH = 64; // Max length of key in application storage

export enum Preset {
  /** Preset query parameter name */
  ParamName = 'preset',

  /** Transfer algos */
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

/** Box reference */
export type BoxRef = {
  /** ID of the application that contains the box */
  i: number|null,
  /** Name of box to reference */
  n: string,
};

/** Data common to all transaction types */
export interface BaseTxnData {
  /** Type */
  type: Omit<TransactionType, 'stpf'>;
  /** Sender */
  snd: string;
  /** Note */
  note?: string;
  /** Fee */
  fee: number;
  /** First valid round */
  fv: number;
  /** Last valid round */
  lv: number;
  /** Rekey to */
  rekey?: string;
  /** Lease */
  lx?: string;
}
/** Data for a payment transaction */
export interface PaymentTxnData extends BaseTxnData {
  type: TransactionType.pay;
  /** Receiver */
  rcv: string;
  /** Amount */
  amt: number;
  /** Close remainder to */
  close?: string;
}
/** Data for a asset transfer transaction */
export interface AssetTransferTxnData extends BaseTxnData {
  type: TransactionType.axfer;
  /** Asset receiver */
  arcv: string;
  /** Asset ID */
  xaid: number,
  /** Asset amount */
  aamt: number|string; // String because the number could be larger than 2^53 - 1
  /** Revocation target */
  asnd?: string;
  /** Close remainder of asset to */
  aclose?: string;
}
/** Data for a asset configuration transaction */
export interface AssetConfigTxnData extends BaseTxnData {
  type: TransactionType.acfg;
  /** Asset ID */
  caid?: number;
  /** Unit name */
  apar_un: string;
  /** Asset name */
  apar_an: string;
  /** Total */
  apar_t: number|string; // String because the number could be larger than 2^53 - 1
  /** Number of decimals places */
  apar_dc?: number;
  /** Frozen by default? */
  apar_df: boolean;
  /** URL */
  apar_au: string;
  /** Manager address */
  apar_m: string;
  /** Freeze address */
  apar_f: string;
  /** Clawback address */
  apar_c: string;
  /** Reserve address */
  apar_r: string;
  /** Metadata hash */
  apar_am: string;
}
/** Data for a asset freeze transaction */
export interface AssetFreezeTxnData extends BaseTxnData {
  type: TransactionType.afrz;
  /** Asset ID */
  faid: number;
  /** Freeze address */
  fadd: string;
  /** Freeze? */
  afrz: boolean;
}
/** Data for a key registration transaction */
export interface KeyRegTxnData extends BaseTxnData {
  type: TransactionType.keyreg;
  /** Voting key */
  votekey: string;
  /** Selection key */
  selkey: string;
  /** State proof key */
  sprfkey: string;
  /** First voting round */
  votefst?: number;
  /** Last voting round */
  votelst?: number;
  /** Voting key dilution */
  votekd?: number;
  /** Nonparticipation */
  nonpart: boolean;
}
/** Data for a application call transaction */
export interface AppCallTxnData extends BaseTxnData {
  type: TransactionType.appl;
  /** Application ID */
  apid?: number;
  /** OnComplete (Action type) */
  apan: OnApplicationComplete;
  /** Application arguments */
  apaa: string[];

  /** Approval program */
  apap: string;
  /** Clear-state program */
  apsu: string;
  /** Number of global integers */
  apgs_nui?: number;
  /** Number of global bytes slices */
  apgs_nbs?: number;
  /** Number of local integers */
  apls_nui?: number;
  /** Number of local bytes slices */
  apls_nbs?: number;
  /** Number of extra program pages */
  apep?: number;

  /** Foreign accounts */
  apat: string[];
  /** Foreign applications */
  apfa: number[];
  /** Foreign assets */
  apas: number[];
  /** Box references */
  apbx: BoxRef[];
}
/** Data for the transaction being built */
export type TxnData = BaseTxnData
  | PaymentTxnData
  | AssetTransferTxnData
  | AssetConfigTxnData
  | AssetFreezeTxnData
  | KeyRegTxnData
  | AppCallTxnData;



/* Code adapted from https://github.com/pmndrs/jotai/discussions/1220#discussioncomment-2918007 */
const storage = createJSONStorage<any>(() => sessionStorage);
/** Transaction form data that is temporarily stored locally */
export const storedTxnDataAtom = atomWithStorage<TxnData|undefined>('txnData', undefined, storage);
/** Signed transaction, as a Data URI string, that is stored locally */
export const storedSignedTxnAtom =
  atomWithStorage<string|undefined>('signedTxn', undefined, storage);



/** Validation error message */
export type ValidationMessage = {
  /** Translation key for the validation message */
  key: string,
  /** Dictionary containing values the validation message needs */
  dict?: {[k: string]: any}
}
/** Validation atom */
export type validationAtom<T> = WritableAtom<SyncState<T>, [SetStateAction<T>], void>
/** Box reference atoms */
export type BoxRefAtomGroup = {
  /** ID of the application that contains the box */
  i: validationAtom<BoxRef['i']>,
  /** Name of box to reference */
  n: validationAtom<BoxRef['n']>,
};

YupSetLocale({
  // use constant translation keys for messages without values
  mixed: {
    required: (): ValidationMessage => ({key: 'form.error.required'}),
  },
  string: {
    length: ({length}): ValidationMessage => (
      {key: 'form.error.string.length', dict: {count: length}}
    ),
    max: ({max}): ValidationMessage => ({key: 'form.error.string.max', dict: {count: max}}),
  },
  number: {
    min: ({min}): ValidationMessage => ({key: 'form.error.number.min', dict: {min}}),
    max: ({max}): ValidationMessage => ({key: 'form.error.number.max', dict: {max}}),
  }
});

/** Validation schema for wallet address */
export const addressSchema = YupString().trim().length(ADDRESS_LENGTH);
/** Validation schemea for asset/application IDs */
export const idSchema = YupNumber().min(1);

/** Atom containing flag for triggering the form errors to be shown */
export const showFormErrorsAtom = atom(false);
/**
 * Validation atom that should contain the name of the current transaction preset, which is usually
 * determined by a URL query parameter.
 */
export const presetAtom = atomWithValidate<string|null>(null, {validate: v => v});

// NOTE: A validation atom must be wrapped in a regular atom to be used in a `splitAtom` array
/** Application - Application arguments */
export const apaaListAtom = atom<validationAtom<string>[]>([]);
/** Application dependencies - Foreign accounts */
export const apatListAtom = atom<validationAtom<string>[]>([]);
/** Application dependencies - Foreign applications */
export const apfaListAtom = atom<validationAtom<number|null>[]>([]);
/** Application dependencies - Foreign assets */
export const apasListAtom = atom<validationAtom<number|null>[]>([]);
/** Application dependencies - Box references */
export const apbxListAtom = atom<BoxRefAtomGroup[]>([]);

/* Application argument validation options */
export const apaaValidateOptions = { validate: (v: string) => v };
/* Application address reference validation options */
export const apatValidateOptions = {
  validate: (v: string) => {
    addressSchema.required().validateSync(v === '' ? undefined : v);
    return v;
  }
};
/* Application account reference validation options */
export const apfaValidateOptions = {
  validate: (v: number|null) => { idSchema.required().validateSync(v); return v; }
};
/* Application asset reference validation options */
export const apasValidateOptions = {
  validate: (v: number|null) => { idSchema.required().validateSync(v); return v; }
};
/* Application box ID validation options */
export const apbxIValidateOptions = {
  validate: (v: number|null) => { YupNumber().min(0).required().validateSync(v); return v; }
};
/* Application box name validation options */
export const apbxNValidateOptions = {
  validate: (v: string) => {
    YupString().max(MAX_APP_KEY_LENGTH).validateSync(v);
    return v;
  }
};

/** Collection of Jotai atoms containing */
export const txnDataAtoms = {

  /** Transaction type */
  txnType: atomWithValidate<Omit<TransactionType, 'stpf'>|undefined>(undefined, {
    validate: v => { YupString().required().validateSync(v); return v; }
  }),
  /** Sender */
  snd: atomWithValidate<string>('', {
    validate: v => {
      addressSchema.required().validateSync(v === '' ? undefined : v);
      return v;
    }
  }),
  /** Fee */
  fee: atomWithValidate<number|undefined>(undefined, {
    validate: v => {
      YupNumber().required().min(microalgosToAlgos(ALGORAND_MIN_TX_FEE)).validateSync(v);
      return v;
    }
  }),
  /** Note */
  note: atomWithValidate<string|undefined>(undefined, {
    validate: v => {
      YupString().max(NOTE_MAX_LENGTH).validateSync(v === '' ? undefined : v);
      return v;
    }
  }),
  /** First round */
  fv: atomWithValidate<number|undefined>(undefined, {
    validate: v => { YupNumber().required().min(1).validateSync(v); return v; }
  }),
  /** Last round */
  lv: atomWithValidate<number|undefined>(undefined, {
    validate: v => { YupNumber().required().min(1).validateSync(v); return v; }
  }),
  /** Lease */
  lx: atomWithValidate<string>('', {
    validate: v => {
      YupString().trim().max(LEASE_MAX_LENGTH).validateSync(v === '' ? undefined : v);
      return v;
    }
  }),
  /** Rekey to */
  rekey: atomWithValidate<string>('', {
    validate: v => {
      addressSchema.validateSync(v === '' ? undefined : v);
      return v;
    }
  }),

  /*
   * Payment
   */

  /** Payment - Receiver */
  rcv: atomWithValidate<string>('', {
    validate: v => {
      addressSchema.required().validateSync(v === '' ? undefined : v);
      return v;
    }
  }),
  /** Payment - Amount */
  amt: atomWithValidate<number|undefined>(undefined, {
    validate: v => {
      YupNumber().required().min(0).validateSync(v);
      return v;
    }
  }),
  /** Payment - Close remainder to */
  close: atomWithValidate<string>('', {
    validate: v => {
      addressSchema.validateSync(v === '' ? undefined : v);
      return v;
    }
  }),

  /*
   * Asset Transfer
   */

  /** Asset transfer - Asset ID */
  xaid: atomWithValidate<number|undefined>(undefined, {
    validate: v => { idSchema.required().validateSync(v); return v; }
  }),
  /** Asset transfer - Revocation Target (the account from which the asset will be revoked) */
  asnd: atomWithValidate<string>('', {
    validate: v => {
      addressSchema.validateSync(v === '' ? undefined : v);
      return v;
    }
  }),
  /** Asset transfer - Asset receiver */
  arcv: atomWithValidate<string>('', {
    validate: v => {
      addressSchema.required().validateSync(v === '' ? undefined : v);
      return v;
    }
  }),
  /** Asset transfer - Asset amount */
  aamt: atomWithValidate<number|string>('', {
    validate: v => {
      YupNumber().required().min(0).validateSync(v === '' ? undefined : v);
      return v;
    }
  }),
  /** Asset transfer - Close remainder of asset to */
  aclose: atomWithValidate<string>('', {
    validate: v => {
      addressSchema.validateSync(v === '' ? undefined : v);
      return v;
    }
  }),

  /*
   * Asset Configuration
   */

  /** Asset configuration - Asset ID */
  caid: atomWithValidate<number|undefined>(undefined, {
    validate: v => { idSchema.validateSync(v); return v; }
  }),
  /** Asset configuration - Unit name */
  apar_un: atomWithValidate<string>('', {
    validate: v => {
      YupString().max(UNIT_NAME_MAX_LENGTH).validateSync(v === '' ? undefined : v);
      return v;
    }
  }),
  /** Asset configuration - Asset name */
  apar_an: atomWithValidate<string>('', {
    validate: v => {
      YupString().max(ASSET_NAME_MAX_LENGTH).validateSync(v === '' ? undefined : v);
      return v;
    }
  }),
  /** Asset configuration - Total */
  apar_t: atomWithValidate<number|string>('', {
    validate: v => {
      YupNumber().min(1).validateSync(v === '' ? undefined : v);
      return v;
    }
  }),
  /** Asset configuration - Number of decimals places */
  apar_dc: atomWithValidate<number|undefined>(undefined, {
    validate: v => {
      YupNumber().min(0).max(MAX_DECIMAL_PLACES).validateSync(v);
      return v;
    }
  }),
  /** Asset configuration - Frozen by default? */
  apar_df: atomWithValidate<boolean>(false, { validate: v => v }),
  /** Asset configuration - URL */
  apar_au: atomWithValidate<string>('', {
    validate: v => {
      YupString().max(URL_MAX_LENGTH).validateSync(v === '' ? undefined : v);
      return v;
    }
  }),
  /** Asset configuration - Manager address */
  apar_m: atomWithValidate<string>('', {
    validate: v => {
      addressSchema.validateSync(v === '' ? undefined : v);
      return v;
    }
  }),
  /** Asset configuration - Freeze address */
  apar_f: atomWithValidate<string>('', {
    validate: v => {
      addressSchema.validateSync(v === '' ? undefined : v);
      return v;
    }
  }),
  /** Asset configuration - Clawback address */
  apar_c: atomWithValidate<string>('', {
    validate: v => {
      addressSchema.validateSync(v === '' ? undefined : v);
      return v;
    }
  }),
  /** Asset configuration - Reserve address */
  apar_r: atomWithValidate<string>('', {
    validate: v => {
      addressSchema.validateSync(v === '' ? undefined : v);
      return v;
    }
  }),
  /** Asset configuration - Metadata hash */
  apar_am: atomWithValidate<string>('', {
    validate: v => {
      YupString().max(METADATA_HASH_MAX_LENGTH).validateSync(v === '' ? undefined : v);
      return v;
    }
  }),

  /*
   * Asset Freeze
   */

  /** Asset freeze - Asset ID */
  faid: atomWithValidate<number|undefined>(undefined, {
    validate: v => { idSchema.required().validateSync(v); return v; }
  }),
  /** Asset freeze - Freeze address */
  fadd: atomWithValidate<string>('', {
    validate: v => {
      addressSchema.required().validateSync(v === '' ? undefined : v);
      return v;
    }
  }),
  /** Asset freeze - Freeze asset? */
  afrz: atomWithValidate<boolean>(false, { validate: v => v }),

  /*
   * Application
   */

  /** Application - Application ID */
  apid: atomWithValidate<number|undefined>(undefined, {
    validate: v => { idSchema.validateSync(v); return v; }
  }),
  /** Application - OnComplete (Action type) */
  apan: atomWithValidate<OnApplicationComplete>(0, {
    validate: v => { YupNumber().required().validateSync(v); return v; }
  }),
  /** Application - Collection of atoms for application arguments */
  apaa: splitAtom(apaaListAtom),

  /*
   * Application properties
   */

  /** Application properties - Approval program */
  apap: atomWithValidate<string>('', { validate: v => v }),
  /** Application properties - Clear-state program */
  apsu: atomWithValidate<string>('', { validate: v => v }),
  /** Application properties - Number of global integers */
  apgs_nui: atomWithValidate<number|undefined>(undefined, {
    validate: v => {
      YupNumber().min(0).validateSync(v);
      return v;
    }
  }),
  /** Application properties - Number of global bytes slices */
  apgs_nbs: atomWithValidate<number|undefined>(undefined, {
    validate: v => {
      YupNumber().min(0).validateSync(v);
      return v;
    }
  }),
  /** Application properties - Number of local integers */
  apls_nui: atomWithValidate<number|undefined>(undefined, {
    validate: v => {
      YupNumber().min(0).validateSync(v);
      return v;
    }
  }),
  /** Application properties - Number of local bytes slices */
  apls_nbs: atomWithValidate<number|undefined>(undefined, {
    validate: v => {
      YupNumber().min(0).validateSync(v);
      return v;
    }
  }),
  /** Application properties - Number of extra program pages */
  apep: atomWithValidate<number|undefined>(undefined, {
    validate: v => {
      YupNumber().min(0).max(MAX_APP_EXTRA_PAGES).validateSync(v);
      return v;
    }
  }),

  /*
   * Application dependencies
   */

  /** Application dependencies - Collection of atoms for foreign accounts */
  apat: splitAtom(apatListAtom),
  /** Application dependencies - Collection of atoms for foreign applications */
  apfa: splitAtom(apfaListAtom),
  /** Application dependencies - Collection of atoms for foreign assets */
  apas: splitAtom(apasListAtom),
  /** Application dependencies - Collection of atoms for box references */
  apbx: splitAtom(apbxListAtom),

  /*
   * Key Registration
   */

  /** Key Registration - Voting key */
  votekey: atomWithValidate<string>('', { validate: v => v }),
  /** Key Registration - Selection key */
  selkey: atomWithValidate<string>('', { validate: v => v }),
  /** Key Registration - State proof key */
  sprfkey: atomWithValidate<string>('', { validate: v => v }),
  /** Key Registration - First voting round */
  votefst: atomWithValidate<number|undefined>(undefined, {
    validate: v => { YupNumber().min(1).validateSync(v); return v; }
  }),
  /** Key Registration - Last voting round */
  votelst: atomWithValidate<number|undefined>(undefined, {
    validate: v => { YupNumber().min(1).validateSync(v); return v; }
  }),
  /** Key Registration - Voting key dilution */
  votekd: atomWithValidate<number|undefined>(undefined, {
    validate: v => { YupNumber().min(0).validateSync(v); return v; }
  }),
  /** Key Registration - Nonparticipation */
  nonpart: atomWithValidate<boolean>(false, { validate: v => v }),

};

/*
 * General validation form groups
 */
export const generalFormControlAtom = atomWithFormControls({
  txnType: txnDataAtoms.txnType,
  snd: txnDataAtoms.snd,
  fee: txnDataAtoms.fee,
  note: txnDataAtoms.note,
  fv: txnDataAtoms.fv,
  lv: txnDataAtoms.lv,
  lx: txnDataAtoms.lx,
  rekey: txnDataAtoms.rekey,
});
export const rekeyConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  rekey: txnDataAtoms.rekey,
}, (values) => {
  if (values.preset === Preset.RekeyAccount) {
    YupString().required().validateSync(values.rekey);
  }
});
export const fvLvFormControlAtom = validateAtoms({
  fv: txnDataAtoms.fv,
  lv: txnDataAtoms.lv,
}, (values) => {
    if (values.lv !== undefined) { // If a last round has been entered yet
      // First valid round must be less than the last valid round
      YupNumber()
        .max((values.lv as number),
          ({max}): ValidationMessage => ({key: 'fields.fv.max_error', dict: {max}})
        )
        .validateSync(values.fv);
    }
});

/*
 * Payment validation form groups
 */
export const paymentFormControlAtom = atomWithFormControls({
  rcv: txnDataAtoms.rcv,
  amt: txnDataAtoms.amt,
  close: txnDataAtoms.close,
});
export const closeConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  close: txnDataAtoms.close,
}, (values) => {
  if (values.preset === Preset.CloseAccount) {
    YupString().required().validateSync(values.close);
  }
});

/*
 * Asset transfer validation form groups
 */
export const assetTransferFormControlAtom = atomWithFormControls({
  xaid: txnDataAtoms.xaid,
  asnd: txnDataAtoms.asnd,
  arcv: txnDataAtoms.arcv,
  aamt: txnDataAtoms.aamt,
  aclose: txnDataAtoms.aclose,
});
export const asndConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  asnd: txnDataAtoms.asnd,
}, (values) => {
  if (values.preset === Preset.AssetClawback) {
    YupString().required().validateSync(values.asnd);
  }
});
export const acloseConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  aclose: txnDataAtoms.aclose,
}, (values) => {
  if (values.preset === Preset.AssetOptOut) {
    YupString().required().validateSync(values.aclose);
  }
});

/*
 * Asset configuration validation form groups
 */
export const assetConfigFormControlAtom = atomWithFormControls({
  caid: txnDataAtoms.caid,
  apar_un: txnDataAtoms.apar_un,
  apar_an: txnDataAtoms.apar_an,
  apar_t: txnDataAtoms.apar_t,
  apar_dc: txnDataAtoms.apar_dc,
  apar_df: txnDataAtoms.apar_df,
  apar_au: txnDataAtoms.apar_au,
  apar_m: txnDataAtoms.apar_m,
  apar_f: txnDataAtoms.apar_f,
  apar_c: txnDataAtoms.apar_c,
  apar_r: txnDataAtoms.apar_r,
  apar_am: txnDataAtoms.apar_am,
});
export const caidConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  caid: txnDataAtoms.caid,
}, (values) => {
  if (values.preset === Preset.AssetReconfig || values.preset === Preset.AssetDestroy) {
    YupNumber().required().validateSync(values.caid);
  }
});
export const aparTConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  caid: txnDataAtoms.caid,
  apar_t: txnDataAtoms.apar_t,
}, (values) => {
  if (values.preset === Preset.AssetCreate || !values.caid) {
    YupMixed().required().validateSync(values.apar_t === '' ? undefined : values.apar_t);
  }
});
export const aparDcConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  caid: txnDataAtoms.caid,
  apar_dc: txnDataAtoms.apar_dc,
}, (values) => {
  if (values.preset === Preset.AssetCreate || !values.caid) {
    YupNumber().required().validateSync(values.apar_dc);
  }
});

/*
 * Asset freeze validation form group
 */
export const assetFreezeFormControlAtom = atomWithFormControls({
  faid: txnDataAtoms.faid,
  fadd: txnDataAtoms.fadd,
  afrz: txnDataAtoms.afrz,
});

/*
 * Application validation form groups
 */
export const applFormControlAtom = atomWithFormControls({
  apid: txnDataAtoms.apid,
  apan: txnDataAtoms.apan,
  apap: txnDataAtoms.apap,
  apsu: txnDataAtoms.apsu,
  apgs_nui: txnDataAtoms.apgs_nui,
  apgs_nbs: txnDataAtoms.apgs_nbs,
  apls_nui: txnDataAtoms.apls_nui,
  apls_nbs: txnDataAtoms.apls_nbs,
  apep: txnDataAtoms.apep,
});
export const apidConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  apan: txnDataAtoms.apan,
  apid: txnDataAtoms.apid,
}, (values) => {
  if (values.apan !== OnApplicationComplete.NoOpOC
    || (values.preset && values.preset !== Preset.AppDeploy)
  ) {
    YupNumber().required().validateSync(values.apid);
  }
});
export const apapConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  apid: txnDataAtoms.apid,
  apan: txnDataAtoms.apan,
  apap: txnDataAtoms.apap,
}, (values) => {
  if (// Creating application
    ((!values.preset && values.apan === OnApplicationComplete.NoOpOC && !values.apid)
      || values.preset === Preset.AppDeploy)
    // Updating application
    || values.apan === OnApplicationComplete.UpdateApplicationOC
  ) {
    YupString().trim().required().validateSync(values.apap);
  }
});
export const apsuConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  apid: txnDataAtoms.apid,
  apan: txnDataAtoms.apan,
  apsu: txnDataAtoms.apsu,
}, (values) => {
  if (// Creating application
    ((!values.preset && values.apan === OnApplicationComplete.NoOpOC && !values.apid)
      || values.preset === Preset.AppDeploy)
    // Updating application
    || values.apan === OnApplicationComplete.UpdateApplicationOC
  ) {
    YupString().trim().required().validateSync(values.apsu);
  }
});
export const apgsNuiConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  apid: txnDataAtoms.apid,
  apan: txnDataAtoms.apan,
  apgs_nui: txnDataAtoms.apgs_nui,
}, (values) => {
  if (// Creating application
    ((!values.preset && values.apan === OnApplicationComplete.NoOpOC && !values.apid)
      || values.preset === Preset.AppDeploy)
  ) {
    YupNumber().required().validateSync(values.apgs_nui);
  }
});
export const apgsNbsConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  apid: txnDataAtoms.apid,
  apan: txnDataAtoms.apan,
  apgs_nbs: txnDataAtoms.apgs_nbs,
}, (values) => {
  if (// Creating application
    ((!values.preset && values.apan === OnApplicationComplete.NoOpOC && !values.apid)
      || values.preset === Preset.AppDeploy)
  ) {
    YupNumber().required().validateSync(values.apgs_nbs);
  }
});
export const maxAppGlobalsCheckAtom = validateAtoms({
  apgs_nui: txnDataAtoms.apgs_nui,
  apgs_nbs: txnDataAtoms.apgs_nbs,
}, (values) => {
  if (values.apgs_nui !== undefined && values.apgs_nbs !== undefined) {
    // The total number of globals must not exceed the max
    YupNumber()
      .max(MAX_APP_GLOBALS,
        ({max}): ValidationMessage => ({key: 'fields.app_global_state.max_error', dict: {max}})
      )
      .validateSync(values.apgs_nui + values.apgs_nbs);
  }
});
export const aplsNuiConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  apid: txnDataAtoms.apid,
  apan: txnDataAtoms.apan,
  apls_nui: txnDataAtoms.apls_nui,
}, (values) => {
  if (// Creating application
    ((!values.preset && values.apan === OnApplicationComplete.NoOpOC && !values.apid)
      || values.preset === Preset.AppDeploy)
  ) {
    YupNumber().required().validateSync(values.apls_nui);
  }
});
export const aplsNbsConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  apid: txnDataAtoms.apid,
  apan: txnDataAtoms.apan,
  apls_nbs: txnDataAtoms.apls_nbs,
}, (values) => {
  if (// Creating application
    ((!values.preset && values.apan === OnApplicationComplete.NoOpOC && !values.apid)
      || values.preset === Preset.AppDeploy)
  ) {
    YupNumber().required().validateSync(values.apls_nbs);
  }
});
export const maxAppLocalsCheckAtom = validateAtoms({
  apls_nui: txnDataAtoms.apls_nui,
  apls_nbs: txnDataAtoms.apls_nbs,
}, (values) => {
  if (values.apls_nui !== undefined && values.apls_nbs !== undefined) {
    // The total number of locals must not exceed the max
    YupNumber()
      .max(MAX_APP_LOCALS,
        ({max}): ValidationMessage => ({key: 'fields.app_local_state.max_error', dict: {max}})
      )
      .validateSync(values.apls_nui + values.apls_nbs);
  }
});
export const apepConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  apid: txnDataAtoms.apid,
  apan: txnDataAtoms.apan,
  apep: txnDataAtoms.apep,
}, (values) => {
  if (// Creating application
    ((!values.preset && values.apan === OnApplicationComplete.NoOpOC && !values.apid)
      || values.preset === Preset.AppDeploy)
  ) {
    YupNumber().required().validateSync(values.apep);
  }
});

/*
 * Key registration validation form groups
 */
export const keyRegFormControlAtom = atomWithFormControls({
  votekey: txnDataAtoms.votekey,
  selkey: txnDataAtoms.selkey,
  sprfkey: txnDataAtoms.sprfkey,
  votefst: txnDataAtoms.votefst,
  votelst: txnDataAtoms.votelst,
  votekd: txnDataAtoms.votekd,
  nonpart: txnDataAtoms.nonpart,
});
export const votekeyConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  votekey: txnDataAtoms.votekey,
}, (values) => {
  if (values.preset === Preset.RegOnline) {
    YupString().trim().required().validateSync(values.votekey);
  }
});
export const selkeyConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  selkey: txnDataAtoms.selkey,
}, (values) => {
  if (values.preset === Preset.RegOnline) {
    YupString().trim().required().validateSync(values.selkey);
  }
});
export const sprfkeyConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  sprfkey: txnDataAtoms.sprfkey,
}, (values) => {
  if (values.preset === Preset.RegOnline) {
    YupString().trim().required().validateSync(values.sprfkey);
  }
});
export const votefstConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  votefst: txnDataAtoms.votefst,
}, (values) => {
  if (values.preset === Preset.RegOnline) {
    YupNumber().required().validateSync(values.votefst);
  }
});
export const votelstConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  votelst: txnDataAtoms.votelst,
}, (values) => {
  if (values.preset === Preset.RegOnline) {
    YupNumber().required().validateSync(values.votelst);
  }
});
export const votekdConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  votekd: txnDataAtoms.votekd,
}, (values) => {
  if (values.preset === Preset.RegOnline) {
    YupNumber().required().validateSync(values.votekd);
  }
});
export const votefstVotelstFormControlAtom = validateAtoms({
  votefst: txnDataAtoms.votefst,
  votelst: txnDataAtoms.votelst,
}, (values) => {
    if (values.votelst !== undefined) { // If a last round has been entered yet
      // First voting round must be less than the last voting round
      YupNumber()
        .max((values.votelst as number), ({max}): ValidationMessage => (
          {key: 'fields.votefst.max_error', dict: {max}}
        ))
        .validateSync(values.votefst);
    }
});
