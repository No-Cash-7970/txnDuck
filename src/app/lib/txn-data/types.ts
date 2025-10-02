/** @file Collection of types used to represent transaction data */

import { OnApplicationComplete, TransactionType } from "algosdk";
import { validationAtom } from "@/app/lib/utils";

/** Box reference */
export type BoxRef = {
  /** ID of the application that contains the box */
  i: number|null,
  /** Name of box to reference */
  n: string,
};

/** Retrieved asset information */
export type RetrievedAssetInfo = {
  /** Asset ID */
  id: string,
  /** Asset name */
  name?: string,
  /** Unit name */
  unitName?: string,
  /** Total number of asset (not in decimal form) */
  total: number | string,
  /** Number of decimals asset amounts should have when displayed */
  decimals: number,
  /** Manager address */
  manager?: string,
  /** Freeze address */
  freeze?: string,
  /** Clawback address */
  clawback?: string,
  /** Reserve address */
  reserve?: string,
};

/** Data common to all transaction types */
export interface BaseTxnData {
  /** Type */
  type: Omit<TransactionType, 'stpf'>;
  /** Sender */
  snd: string;
  /** Note */
  note?: string | Uint8Array;
  /** Fee (in Algos, not microAlgos) */
  fee: number;
  /** First valid round */
  fv: number;
  /** Last valid round */
  lv: number;
  /** Rekey to */
  rekey?: string;
  /** Lease */
  lx?: string | Uint8Array;
  /** Group ID */
  grpId?: string;
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
  aamt: number | string; // String because the number could be larger than 2^53 - 1
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
  apar_t: number | string; // String because the number could be larger than 2^53 - 1
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
  apar_am: string | Uint8Array;
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
  apaa: string[] | Uint8Array[];

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

/** Transaction data temporarily stored */
export interface StoredTxnData {
  /** Transaction data */
  txn: TxnData;
  /** Use suggested fee? */
  useSugFee: boolean;
  /** Use suggested first & last valid rounds? */
  useSugRounds: boolean;
  /** Is the note Base64 encoded data? */
  b64Note: boolean;
  /** Is the lease Base64 encoded data? */
  b64Lx: boolean;
  /** Set manager address to the sender address? */
  apar_mUseSnd?: boolean;
  /** Set freeze address to the sender address? */
  apar_fUseSnd?: boolean;
  /** Set clawback address to the sender address? */
  apar_cUseSnd?: boolean;
  /** Set reserve address to the sender address? */
  apar_rUseSnd?: boolean;
  /** Is the metadata hash Base84 encoded data? */
  b64Apar_am?: boolean;
  /** Are all application arguments Base64 encoded data? */
  b64Apaa?: boolean;
  /** Information about the asset that was retrieved when the asset ID was given */
  retrievedAssetInfo?: RetrievedAssetInfo;
}

/** Type for a group of atoms that represent a box reference */
export type BoxRefAtomGroup = {
  /** ID of the application that contains the box */
  i: validationAtom<BoxRef['i']>,
  /** Name of box to reference */
  n: validationAtom<BoxRef['n']>,
};
