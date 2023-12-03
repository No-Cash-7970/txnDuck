/** @file Collection of types used to represent transaction data */

import { OnApplicationComplete, TransactionType } from "algosdk";
import { SetStateAction, WritableAtom } from "jotai";
import { SyncState } from "jotai-form/dist/src/atomWithValidate";

/** Collection of keys, or "names" of the transaction presets */
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
  xaid: number;
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

/** Validation error message */
export type ValidationMessage = {
  /** Translation key for the validation message */
  key: string,
  /** Dictionary containing values the validation message needs */
  dict?: {[k: string]: any}
}
/** Type of validation atom */
export type validationAtom<T> = WritableAtom<SyncState<T>, [SetStateAction<T>], void>
/** Type for a group of atoms that represent a box reference */
export type BoxRefAtomGroup = {
  /** ID of the application that contains the box */
  i: validationAtom<BoxRef['i']>,
  /** Name of box to reference */
  n: validationAtom<BoxRef['n']>,
};
