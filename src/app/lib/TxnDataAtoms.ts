import type { OnApplicationComplete, Transaction, TransactionType } from "algosdk";
import { type PrimitiveAtom, atom } from "jotai";

/** Transaction being built */
export const txn = atom<Transaction|undefined>(undefined);

/** Transaction type */
export const txnType = atom<Omit<TransactionType, 'stpf'>|undefined>(undefined);
/** Sender */
export const snd = atom<string>('');
/** Fee */
export const fee = atom<number|undefined>(undefined);
/** Note */
export const note = atom<string|undefined>(undefined);
/** First round */
export const fv = atom<number|undefined>(undefined);
/** Last round */
export const lv = atom<number|undefined>(undefined);
/** Lease */
export const lx = atom<string>('');
/** Rekey to */
export const rekey = atom<string>('');

/*
 * Payment
 */

/** Payment - Receiver */
export const rcv = atom<string>('');
/** Payment - Amount */
export const amt = atom<number|undefined>(undefined);
/** Payment - Close remainder to */
export const close = atom<string>('');

/*
 * Asset Transfer
 */

/** Asset transfer - Asset ID */
export const xaid = atom<number|undefined>(undefined);
/** Asset transfer - Sender */
export const asnd = atom<string>('');
/** Asset transfer - Asset receiver */
export const arcv = atom<string>('');
/** Asset transfer - Asset amount */
export const aamt = atom<number|bigint|undefined>(undefined);
/** Asset transfer - Close remainder of asset To */
export const aclose = atom<string>('');

/*
 * Asset Configuration
 */

/** Asset configuration - Asset ID */
export const caid = atom<number|undefined>(undefined);
/** Asset configuration - Unit name */
export const apar_un = atom<string>('');
/** Asset configuration - Asset name */
export const apar_an = atom<string>('');
/** Asset configuration - Total */
export const apar_t = atom<number|bigint|undefined>(undefined);
/** Asset configuration - Number of decimals places */
export const apar_dc = atom<number|undefined>(undefined);
/** Asset configuration - Frozen by default? */
export const apar_df = atom<boolean>(false);
/** Asset configuration - URL */
export const apar_au = atom<string>('');
/** Asset configuration - Manager address */
export const apar_m = atom<string>('');
/** Asset configuration - Freeze address */
export const apar_f = atom<string>('');
/** Asset configuration - Clawback address */
export const apar_c = atom<string>('');
/** Asset configuration - Reserve address */
export const apar_r = atom<string>('');
/** Asset configuration - Metadata hash */
export const apar_am = atom<string>('');

/*
 * Asset Freeze
 */

/** Asset freeze - Asset ID */
export const faid = atom<number|undefined>(undefined);
/** Asset freeze - Freeze address */
export const fadd = atom<string>('');
/** Asset freeze - Freeze asset? */
export const afrz = atom<string>('');

/*
 * Application
 */

/** Application - Application ID */
export const apid = atom<number|undefined>(undefined);
/** Application - OnComplete (Action type) */
export const apan = atom<OnApplicationComplete|undefined>(undefined);
/** Application - Application arguments */
export const apaa = atom<(string|number)[]>([]);

/*
 * Application properties
 */

/** Application properties - Approval program */
export const apap = atom<string|Uint8Array|undefined>(undefined);
/** Application properties - Clear-state program */
export const apsu = atom<string|Uint8Array|undefined>(undefined);
/** Application properties - Number of global integers */
export const apgs_nui = atom<number|undefined>(undefined);
/** Application properties - Number of global bytes slices */
export const apgs_nbs = atom<number|undefined>(undefined);
/** Application properties - Number of local integers */
export const apls_nui = atom<number|undefined>(undefined);
/** Application properties - Number of local bytes slices */
export const apls_nbs = atom<number|undefined>(undefined);
/** Application properties - Number of extra program pages */
export const apep = atom<number|undefined>(undefined);

/*
 * Application dependencies
 */

/** Application dependencies - Foreign accounts */
export const apat = atom<string[]>([]);
/** Application dependencies - Foreign applications */
export const apfa = atom<number[]>([]);
/** Application dependencies - Foreign assets */
export const apas = atom<number[]>([]);
/** Box reference */
type BoxRef = {
  /** ID of the application that contains the box */
  i: PrimitiveAtom<number>,
  /** Name of box to reference */
  n: PrimitiveAtom<string>,
};
/** Application dependencies - Box references */
export const apbx = atom<BoxRef[]>([]);
