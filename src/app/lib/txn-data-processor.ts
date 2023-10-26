import * as algosdk from 'algosdk';
import { encodeTransactionNote } from '@algorandfoundation/algokit-utils';
import type { AssetTransferTxnData, PaymentTxnData, TxnData } from '@/app/lib/txn-data';

/** Creates an `Transaction` object that represents an Algorand transaction */
export function createTxnFromData(txnData: TxnData['txn'], genesisID: string, genesisHash: string) {
  switch (txnData.type) {
    case algosdk.TransactionType.pay:
      return createPayTxn(txnData as PaymentTxnData, genesisID, genesisHash);
    case algosdk.TransactionType.axfer:
      return createAxferTxn(txnData as AssetTransferTxnData, genesisID, genesisHash);
    default:
      throw Error('Unsupported transaction type');
  }
}

/** Creates an `Transaction` object that represents an Algorand payment transaction */
function createPayTxn(payTxnData: PaymentTxnData, genesisID: string, genesisHash: string) {
  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: payTxnData.snd,
    to: payTxnData.rcv,
    amount: algosdk.algosToMicroalgos(payTxnData.amt),
    note: encodeTransactionNote(payTxnData.note),
    rekeyTo: payTxnData.rekey || undefined,
    closeRemainderTo: payTxnData.close || undefined,
    suggestedParams: {
      fee: algosdk.algosToMicroalgos(payTxnData.fee),
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

/** Creates an `Transaction` object that represents an Algorand payment transaction */
function createAxferTxn(
  axferTxnData: AssetTransferTxnData,
  genesisID: string,
  genesisHash: string
) {
  const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: axferTxnData.snd,
    to: axferTxnData.arcv,
    assetIndex: axferTxnData.xaid,
    amount: BigInt(axferTxnData.aamt),
    closeRemainderTo: axferTxnData.aclose || undefined,
    revocationTarget: axferTxnData.asnd || undefined,
    note: encodeTransactionNote(axferTxnData.note),
    rekeyTo: axferTxnData.rekey || undefined,
    suggestedParams: {
      fee: algosdk.algosToMicroalgos(axferTxnData.fee),
      flatFee: true,
      firstRound: axferTxnData.fv,
      lastRound: axferTxnData.lv,
      genesisHash,
      genesisID,
    }
  });

  if (axferTxnData.lx) {
    txn.addLease((new TextEncoder).encode(axferTxnData.lx));
  }

  return txn;
}
