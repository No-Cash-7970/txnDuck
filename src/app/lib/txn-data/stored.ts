/** @file Collection of atoms for stored transaction data */

import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { TxnData } from './types';

/* Code adapted from https://github.com/pmndrs/jotai/discussions/1220#discussioncomment-2918007 */
const storage = createJSONStorage<any>(() => sessionStorage); // Set they type of storage

/** Transaction form data that is temporarily stored locally */
export const storedTxnDataAtom = atomWithStorage<TxnData|undefined>('txnData', undefined, storage);

/** Signed transaction, as a Data URI string, that is stored locally */
export const storedSignedTxnAtom =
  atomWithStorage<string|undefined>('signedTxn', undefined, storage);
