import * as algosdk from 'algosdk';
import { encodeTransactionNote, getAppArgsForTransaction } from '@algorandfoundation/algokit-utils';
import type * as TxnData from '@/app/lib/txn-data';

/** Creates a `Transaction` object that represents an Algorand transaction
 * @param txnData Transaction data from which to create a `Transaction` object
 * @param genesisID Genesis ID of the network the transaction will be sent
 * @param genesisHash Genesis hash of the network the transaction will be sent
 */
export function createTxnFromData(
  txnData: TxnData.TxnData,
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
    case algosdk.TransactionType.afrz:
      return createAfrzTxn(txnData as TxnData.AssetFreezeTxnData, genesisID, genesisHash);
    case algosdk.TransactionType.keyreg:
      return createKeyRegTxn(txnData as TxnData.KeyRegTxnData, genesisID, genesisHash);
    case algosdk.TransactionType.appl:
      return createApplTxn(txnData as TxnData.AppCallTxnData, genesisID, genesisHash);
    default:
      throw Error('Unsupported transaction type');
  }
}

/** Creates a `Transaction` object that represents an Algorand payment transaction */
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

/** Creates a `Transaction` object that represents an Algorand asset transfer transaction */
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

/** Creates a `Transaction` object that represents an Algorand asset configuration transaction */
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
      defaultFrozen: acfgTxnData.apar_df,
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
  } else if ( // If asset configuration transaction
    acfgTxnData.apar_m || acfgTxnData.apar_f || acfgTxnData.apar_c || acfgTxnData.apar_r
  ) {
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

/** Creates a `Transaction` object that represents an Algorand asset freeze transaction */
function createAfrzTxn(
  afrzTxnData: TxnData.AssetFreezeTxnData,
  genesisID: string,
  genesisHash: string
) {
  const txn = algosdk.makeAssetFreezeTxnWithSuggestedParamsFromObject({
    from: afrzTxnData.snd,
    note: encodeTransactionNote(afrzTxnData.note),
    rekeyTo: afrzTxnData.rekey || undefined,
    assetIndex: afrzTxnData.faid,
    freezeTarget: afrzTxnData.fadd,
    freezeState: afrzTxnData.afrz,
    suggestedParams: {
      fee: algosdk.algosToMicroalgos(afrzTxnData.fee),
      flatFee: true,
      firstRound: afrzTxnData.fv,
      lastRound: afrzTxnData.lv,
      genesisHash,
      genesisID,
    }
  });

  if (afrzTxnData.lx) {
    txn.addLease((new TextEncoder).encode(afrzTxnData.lx));
  }

  return txn;
}

/** Creates a `Transaction` object that represents an Algorand key registration transaction */
function createKeyRegTxn(
  keyRegTxnData: TxnData.KeyRegTxnData,
  genesisID: string,
  genesisHash: string
) {
  const keyRegData = keyRegTxnData.nonpart
    ? { nonParticipation: true } // Activating "nonparticipation"
    : {
      voteKey: keyRegTxnData.votekey || undefined,
      selectionKey: keyRegTxnData.selkey || undefined,
      stateProofKey: keyRegTxnData.sprfkey || undefined,
      voteFirst: keyRegTxnData.votefst || undefined,
      voteLast: keyRegTxnData.votelst || undefined,
      voteKeyDilution: keyRegTxnData.votekd || undefined,
      nonParticipation: keyRegTxnData.nonpart, // false or unset
    };

  const txn = algosdk.makeKeyRegistrationTxnWithSuggestedParamsFromObject({
    ...keyRegData,
    from: keyRegTxnData.snd,
    note: encodeTransactionNote(keyRegTxnData.note),
    rekeyTo: keyRegTxnData.rekey || undefined,
    suggestedParams: {
      fee: algosdk.algosToMicroalgos(keyRegTxnData.fee),
      flatFee: true,
      firstRound: keyRegTxnData.fv,
      lastRound: keyRegTxnData.lv,
      genesisHash,
      genesisID,
    }
  });

  if (keyRegTxnData.lx) {
    txn.addLease((new TextEncoder).encode(keyRegTxnData.lx));
  }

  return txn;
}

/** Creates a `Transaction` object that represents an Algorand application call transaction */
function createApplTxn(
  applTxnData: TxnData.AppCallTxnData,
  genesisID: string,
  genesisHash: string
) {
  const encoder = new TextEncoder;
  const encodedAppArgs = getAppArgsForTransaction({
    accounts: applTxnData.apat,
    appArgs: applTxnData.apaa,
    apps: applTxnData.apfa,
    assets: applTxnData.apas,
    boxes: applTxnData.apbx.map(box => ({ appId: box.i || 0, name: box.n })),
  });

  const txn = algosdk.makeApplicationCallTxnFromObject({
    ...encodedAppArgs,
    from: applTxnData.snd,
    note: encodeTransactionNote(applTxnData.note),
    rekeyTo: applTxnData.rekey || undefined,
    appIndex: applTxnData.apid ?? 0,
    onComplete: applTxnData.apan,
    approvalProgram: applTxnData.apap ? encoder.encode(applTxnData.apap) : undefined,
    clearProgram: applTxnData.apsu ? encoder.encode(applTxnData.apsu) : undefined,
    numGlobalInts: applTxnData.apgs_nui,
    numGlobalByteSlices: applTxnData.apgs_nbs,
    numLocalInts: applTxnData.apls_nui,
    numLocalByteSlices: applTxnData.apls_nbs,
    extraPages: applTxnData.apep,
    suggestedParams: {
      fee: algosdk.algosToMicroalgos(applTxnData.fee),
      flatFee: true,
      firstRound: applTxnData.fv,
      lastRound: applTxnData.lv,
      genesisHash,
      genesisID,
    },
  });

  if (applTxnData.lx) {
    txn.addLease(encoder.encode(applTxnData.lx));
  }

  return txn;
}
