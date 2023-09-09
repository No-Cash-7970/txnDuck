import {
  TransactionType,
  algosToMicroalgos,
  makePaymentTxnWithSuggestedParamsFromObject,
} from 'algosdk';
import { encodeTransactionNote } from '@algorandfoundation/algokit-utils';

interface BaseTxnData {
  /** Type */
  type: Omit<TransactionType, 'stpf'>,
  /** Sender */
  snd: string,
  /** Note */
  note?: string,
  /** Fee */
  fee: number
  /** First valid round */
  fv: number,
  /** Last valid round */
  lv: number,
  /** Rekey to */
  rekey?: string,
  /** Lease */
  lx?: string,
}

interface PaymentTxnData extends BaseTxnData {
  type: TransactionType.pay,
  /** Receiver */
  rcv: string,
  /** Amount */
  amt: number,
  /** Close remainder to */
  close?: string,
}

type TxnData = BaseTxnData | PaymentTxnData

/** Creates an `Transaction` object that represents an Algorand transaction */
export function createTxnFromData(txnData: TxnData, genesisID: string, genesisHash: string) {
  if (txnData.type === TransactionType.pay) {
    return createPayTxn(txnData as PaymentTxnData, genesisID, genesisHash);
  }

  throw Error('Unsupported transaction type');
}

/** Creates an `Transaction` object that represents an Algorand payment transaction */
function createPayTxn(payTxnData: PaymentTxnData, genesisID: string, genesisHash: string) {
  const txn = makePaymentTxnWithSuggestedParamsFromObject({
    from: payTxnData.snd,
    to: payTxnData.rcv,
    amount: algosToMicroalgos(payTxnData.amt),
    note: encodeTransactionNote(payTxnData.note),
    rekeyTo: payTxnData.rekey || undefined,
    closeRemainderTo: payTxnData.close || undefined,
    suggestedParams: {
      fee: (payTxnData.fee).algos().microAlgos,
      flatFee: true,
      firstRound: payTxnData.fv,
      lastRound: payTxnData.lv,
      genesisHash,
      genesisID,
    }
  });

  if (payTxnData.lx) {
    txn.addLease((new TextEncoder).encode(payTxnData.lx));
  }

  return txn;
}
