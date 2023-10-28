import * as algosdk from 'algosdk';
import { encodeTransactionNote } from '@algorandfoundation/algokit-utils';
import type * as TxnData from '@/app/lib/txn-data';

/** Creates an `Transaction` object that represents an Algorand transaction */
export function createTxnFromData(
  txnData: TxnData.TxnData['txn'],
  genesisID: string,
  genesisHash: string
) {
  switch (txnData.type) {
    case algosdk.TransactionType.pay:
      return createPayTxn(txnData as TxnData.PaymentTxnData, genesisID, genesisHash);
    case algosdk.TransactionType.axfer:
      return createAxferTxn(txnData as TxnData.AssetTransferTxnData, genesisID, genesisHash);
    case algosdk.TransactionType.acfg:
      return createAcfgTxn(txnData as TxnData.AssetConfigTxnData, genesisID, genesisHash);
    default:
      throw Error('Unsupported transaction type');
  }
}

/** Creates an `Transaction` object that represents an Algorand payment transaction */
function createPayTxn(payTxnData: TxnData.PaymentTxnData, genesisID: string, genesisHash: string) {
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

/** Creates an `Transaction` object that represents an Algorand asset transfer transaction */
function createAxferTxn(
  axferTxnData: TxnData.AssetTransferTxnData,
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

/** Creates an `Transaction` object that represents an Algorand asset configuration transaction */
function createAcfgTxn(
  acfgTxnData: TxnData.AssetConfigTxnData,
  genesisID: string,
  genesisHash: string
) {
  let txn;

  if (!acfgTxnData.caid) { // If asset creation transaction
    txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: acfgTxnData.snd,
      note: encodeTransactionNote(acfgTxnData.note),
      rekeyTo: acfgTxnData.rekey || undefined,
      unitName: acfgTxnData.apar_un || undefined,
      assetName: acfgTxnData.apar_an || undefined,
      total: BigInt(acfgTxnData.apar_t || ''),
      decimals: acfgTxnData.apar_dc || 0,
      defaultFrozen: !!acfgTxnData.apar_f,
      assetMetadataHash: acfgTxnData.apar_am || undefined,
      assetURL: acfgTxnData.apar_au || undefined,
      manager: acfgTxnData.apar_m || undefined,
      freeze: acfgTxnData.apar_f || undefined,
      clawback: acfgTxnData.apar_c || undefined,
      reserve: acfgTxnData.apar_r || undefined,
      suggestedParams: {
        fee: algosdk.algosToMicroalgos(acfgTxnData.fee),
        flatFee: true,
        firstRound: acfgTxnData.fv,
        lastRound: acfgTxnData.lv,
        genesisHash,
        genesisID,
      }
    });
  } else if (
    acfgTxnData.apar_m
    || acfgTxnData.apar_f
    || acfgTxnData.apar_c
    || acfgTxnData.apar_r
  ) { // If asset configuration transaction
    txn = algosdk.makeAssetConfigTxnWithSuggestedParamsFromObject({
      from: acfgTxnData.snd,
      note: encodeTransactionNote(acfgTxnData.note),
      rekeyTo: acfgTxnData.rekey || undefined,
      assetIndex: acfgTxnData.caid,
      manager: acfgTxnData.apar_m || undefined,
      freeze: acfgTxnData.apar_f || undefined,
      clawback: acfgTxnData.apar_c || undefined,
      reserve: acfgTxnData.apar_r || undefined,
      suggestedParams: {
        fee: algosdk.algosToMicroalgos(acfgTxnData.fee),
        flatFee: true,
        firstRound: acfgTxnData.fv,
        lastRound: acfgTxnData.lv,
        genesisHash,
        genesisID,
      },
      strictEmptyAddressChecking: false,
    });
  } else { // Is asset destroy transaction
    txn = algosdk.makeAssetDestroyTxnWithSuggestedParamsFromObject({
      from: acfgTxnData.snd,
      note: encodeTransactionNote(acfgTxnData.note),
      rekeyTo: acfgTxnData.rekey || undefined,
      assetIndex: acfgTxnData.caid,
      suggestedParams: {
        fee: algosdk.algosToMicroalgos(acfgTxnData.fee),
        flatFee: true,
        firstRound: acfgTxnData.fv,
        lastRound: acfgTxnData.lv,
        genesisHash,
        genesisID,
      }
    });
  }

  if (acfgTxnData.lx) {
    txn.addLease((new TextEncoder).encode(acfgTxnData.lx));
  }

  return txn;
}
