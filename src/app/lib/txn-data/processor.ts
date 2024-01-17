/** @file Functions that process transaction data and transform it into a `Transaction` object */

import * as algosdk from 'algosdk';
import { encodeTransactionNote, getAppArgsForTransaction } from '@algorandfoundation/algokit-utils';
import type * as TxnData from '@/app/lib/txn-data';
import { bytesToBase64 } from '../utils';

/** Creates a "transaction data" object from a `Transaction` object
 * @param txn Transaction object from which to create the transaction data
 * @param options Options in how to parse and encode the `Transaction` object
 * @returns "Transaction data" object that contains the information in the `Transaction` object
 */
export async function createDataFromTxn(txn: algosdk.Transaction, options: {
  /** Parse the note as byte data to be encoded to Base64? */
  b64Note?: boolean,
  /** Parse the lease as byte data to be encoded to Base64? */
  b64Lx?: boolean,
  /** Parse the metadata hash as byte data to be encoded to Base64? */
  b64Apar_am?: boolean,
} = {}): Promise<TxnData.TxnData> {
  const textDecoder = new TextDecoder;
  const output = {
    type: txn.type ?? 'pay',
    snd: algosdk.encodeAddress(txn.from.publicKey ?? new Uint8Array),
    fee: algosdk.microalgosToAlgos(txn.fee ?? 0),
    fv: txn.firstRound,
    lv: txn.lastRound,
  };

  if (txn.note?.length) {
    (output as TxnData.BaseTxnData).note = options.b64Note
      ? await bytesToBase64(txn.note)
      : textDecoder.decode(txn.note);
  }

  if (txn.lease?.length) {
    (output as TxnData.BaseTxnData).lx = options.b64Lx
      ? await bytesToBase64(txn.lease)
      : textDecoder.decode(txn.lease);
  }

  if (txn.reKeyTo) {
    (output as TxnData.BaseTxnData).rekey = algosdk.encodeAddress(txn.reKeyTo.publicKey);
  }

  if (output.type === 'pay') {
    (output as TxnData.PaymentTxnData).rcv =
      algosdk.encodeAddress(txn.to.publicKey ?? new Uint8Array);
    (output as TxnData.PaymentTxnData).amt = algosdk.microalgosToAlgos((txn.amount as number) ?? 0);

    if (txn.closeRemainderTo !== undefined) {
      (output as TxnData.PaymentTxnData).close =
        algosdk.encodeAddress(txn.closeRemainderTo.publicKey);
    }
  }

  else if (output.type === 'axfer') {
    (output as TxnData.AssetTransferTxnData).xaid = txn.assetIndex;
    (output as TxnData.AssetTransferTxnData).arcv =
      algosdk.encodeAddress(txn.to.publicKey ?? new Uint8Array);
    (output as TxnData.AssetTransferTxnData).aamt = BigInt(txn.amount ?? 0).toString();

    if (txn.assetRevocationTarget !== undefined) {
      (output as TxnData.AssetTransferTxnData).asnd =
        algosdk.encodeAddress(txn.assetRevocationTarget.publicKey);
    }

    if (txn.closeRemainderTo !== undefined) {
      (output as TxnData.AssetTransferTxnData).aclose =
        algosdk.encodeAddress(txn.closeRemainderTo.publicKey);
    }
  }

  else if (output.type === 'acfg') {
    (output as TxnData.AssetConfigTxnData).apar_un = txn.assetUnitName;
    (output as TxnData.AssetConfigTxnData).apar_an = txn.assetName;
    (output as TxnData.AssetConfigTxnData).apar_t = BigInt(txn.assetTotal ?? 0).toString();
    (output as TxnData.AssetConfigTxnData).apar_dc = txn.assetDecimals;
    (output as TxnData.AssetConfigTxnData).apar_df = !!txn.assetDefaultFrozen;
    (output as TxnData.AssetConfigTxnData).apar_au = txn.assetURL;
    (output as TxnData.AssetConfigTxnData).apar_m =
      algosdk.encodeAddress(txn.assetManager?.publicKey ?? new Uint8Array);
    (output as TxnData.AssetConfigTxnData).apar_f =
      algosdk.encodeAddress(txn.assetFreeze?.publicKey ?? new Uint8Array);
    (output as TxnData.AssetConfigTxnData).apar_c =
      algosdk.encodeAddress(txn.assetClawback?.publicKey ?? new Uint8Array);
    (output as TxnData.AssetConfigTxnData).apar_r =
      algosdk.encodeAddress(txn.assetReserve?.publicKey ?? new Uint8Array);

    if (txn.assetMetadataHash && txn.assetMetadataHash.length > 0) {
      (output as TxnData.AssetConfigTxnData).apar_am = options.b64Apar_am
        ? await bytesToBase64(txn.assetMetadataHash)
        : textDecoder.decode(txn.assetMetadataHash);
    }

    if (!!txn.assetIndex) (output as TxnData.AssetConfigTxnData).caid = txn.assetIndex;
  }

  else if (output.type === 'afrz') {
    (output as TxnData.AssetFreezeTxnData).faid = txn.assetIndex;
    (output as TxnData.AssetFreezeTxnData).fadd =
      algosdk.encodeAddress(txn.freezeAccount?.publicKey ?? new Uint8Array);
    (output as TxnData.AssetFreezeTxnData).afrz = txn.freezeState;
  }

  else if (output.type === 'keyreg') {
    if (txn.voteKey.length > 0) {
      (output as TxnData.KeyRegTxnData).votekey = await bytesToBase64(txn.voteKey);
    }

    if (txn.selectionKey.length > 0) {
      (output as TxnData.KeyRegTxnData).selkey = await bytesToBase64(txn.selectionKey);
    }

    if (txn.stateProofKey.length > 0) {
      (output as TxnData.KeyRegTxnData).sprfkey = await bytesToBase64(txn.stateProofKey);
    }

    if (!!txn.voteFirst) (output as TxnData.KeyRegTxnData).votefst = txn.voteFirst;

    if (!!txn.voteLast) (output as TxnData.KeyRegTxnData).votelst = txn.voteLast;

    if (!!txn.voteKeyDilution) (output as TxnData.KeyRegTxnData).votekd = txn.voteKeyDilution;

    if (txn.nonParticipation !== undefined) {
      (output as TxnData.KeyRegTxnData).nonpart = txn.nonParticipation;
    }
  }

  else if (output.type === 'appl') {
    (output as TxnData.AppCallTxnData).apan = txn.appOnComplete;
    (output as TxnData.AppCallTxnData).apgs_nui = txn.appGlobalInts;
    (output as TxnData.AppCallTxnData).apgs_nbs = txn.appGlobalByteSlices;
    (output as TxnData.AppCallTxnData).apls_nui = txn.appLocalInts;
    (output as TxnData.AppCallTxnData).apls_nbs = txn.appLocalByteSlices;
    (output as TxnData.AppCallTxnData).apep = txn.extraPages;

    if (!!txn.appIndex) (output as TxnData.AppCallTxnData).apid = txn.appIndex;

    if (txn.appArgs !== undefined) {
      (output as TxnData.AppCallTxnData).apaa =
        txn.appArgs.map(appArg => textDecoder.decode(appArg)); // Base64?
    }

    if (txn.appApprovalProgram.length > 0) {
      (output as TxnData.AppCallTxnData).apap = textDecoder.decode(txn.appApprovalProgram);
    }

    if (txn.appClearProgram.length > 0) {
      (output as TxnData.AppCallTxnData).apsu = textDecoder.decode(txn.appClearProgram);
    }

    if (txn.appAccounts !== undefined) {
      (output as TxnData.AppCallTxnData).apat =
        txn.appAccounts.map(acct =>  algosdk.encodeAddress(acct.publicKey));
    }

    if (txn.appForeignApps !== undefined) {
      (output as TxnData.AppCallTxnData).apfa = txn.appForeignApps;
    }

    if (txn.appForeignAssets !== undefined) {
      (output as TxnData.AppCallTxnData).apas = txn.appForeignAssets;
    }

    if (txn.boxes !== undefined) {
      (output as TxnData.AppCallTxnData).apbx =
        txn.boxes.map(box => (
          {i: box.appIndex, n: textDecoder.decode(box.name ?? new Uint8Array)}
        ));
    }
  }

  return output;
}

/** Creates a `Transaction` object from the given transaction data
 * @param txnData Transaction data from which to create a `Transaction` object
 * @param genesisID Genesis ID of the network the transaction will be sent
 * @param genesisHash Genesis hash of the network the transaction will be sent
 * @param flatFee If the specified fee is to be the fee for the transaction and not the fee per byte
 * @return `Transaction` object that represents the given transaction data
 */
export function createTxnFromData(
  txnData: TxnData.TxnData,
  genesisID: string,
  genesisHash: string,
  flatFee = true
) {
  switch (txnData.type) {
    case algosdk.TransactionType.pay:
      return createPayTxn(txnData as TxnData.PaymentTxnData, genesisID, genesisHash, flatFee);
    case algosdk.TransactionType.axfer:
      return createAxferTxn(
        txnData as TxnData.AssetTransferTxnData,
        genesisID,
        genesisHash,
        flatFee
      );
    case algosdk.TransactionType.acfg:
      return createAcfgTxn(txnData as TxnData.AssetConfigTxnData, genesisID, genesisHash, flatFee);
    case algosdk.TransactionType.afrz:
      return createAfrzTxn(txnData as TxnData.AssetFreezeTxnData, genesisID, genesisHash, flatFee);
    case algosdk.TransactionType.keyreg:
      return createKeyRegTxn(txnData as TxnData.KeyRegTxnData, genesisID, genesisHash, flatFee);
    case algosdk.TransactionType.appl:
      return createApplTxn(txnData as TxnData.AppCallTxnData, genesisID, genesisHash, flatFee);
    default:
      throw Error('Unsupported transaction type');
  }
}

/** Creates a `Transaction` object that represents an Algorand payment transaction */
function createPayTxn(
  payTxnData: TxnData.PaymentTxnData,
  genesisID: string,
  genesisHash: string,
  flatFee = true
) {
  const fee = algosdk.algosToMicroalgos(payTxnData.fee);
  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: payTxnData.snd,
    to: payTxnData.rcv,
    amount: algosdk.algosToMicroalgos(payTxnData.amt),
    note: payTxnData.note?.constructor === Uint8Array
      ? payTxnData.note : encodeTransactionNote(payTxnData.note),
    rekeyTo: payTxnData.rekey || undefined,
    closeRemainderTo: payTxnData.close || undefined,
    suggestedParams: {
      fee,
      flatFee,
      firstRound: payTxnData.fv,
      lastRound: payTxnData.lv,
      genesisHash,
      genesisID,
    }
  });

  if (payTxnData.lx) {
    txn.addLease(
      payTxnData.lx.constructor === Uint8Array
        ? payTxnData.lx : (new TextEncoder).encode(payTxnData.lx as string),
      flatFee ? 0 : fee
    );
  }

  return txn;
}

/** Creates a `Transaction` object that represents an Algorand asset transfer transaction */
function createAxferTxn(
  axferTxnData: TxnData.AssetTransferTxnData,
  genesisID: string,
  genesisHash: string,
  flatFee = true
) {
  const fee = algosdk.algosToMicroalgos(axferTxnData.fee);
  const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: axferTxnData.snd,
    to: axferTxnData.arcv,
    assetIndex: axferTxnData.xaid,
    amount: BigInt(axferTxnData.aamt),
    closeRemainderTo: axferTxnData.aclose || undefined,
    revocationTarget: axferTxnData.asnd || undefined,
    note: axferTxnData.note?.constructor === Uint8Array
      ? axferTxnData.note : encodeTransactionNote(axferTxnData.note),
    rekeyTo: axferTxnData.rekey || undefined,
    suggestedParams: {
      fee,
      flatFee,
      firstRound: axferTxnData.fv,
      lastRound: axferTxnData.lv,
      genesisHash,
      genesisID,
    }
  });

  if (axferTxnData.lx) {
    txn.addLease(
      axferTxnData.lx.constructor === Uint8Array
        ? axferTxnData.lx : (new TextEncoder).encode(axferTxnData.lx as string),
      flatFee ? 0 : fee
    );
  }

  return txn;
}

/** Creates a `Transaction` object that represents an Algorand asset configuration transaction */
function createAcfgTxn(
  acfgTxnData: TxnData.AssetConfigTxnData,
  genesisID: string,
  genesisHash: string,
  flatFee = true
) {
  const fee = algosdk.algosToMicroalgos(acfgTxnData.fee);
  let txn;

  if (!acfgTxnData.caid) { // If asset creation transaction
    txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: acfgTxnData.snd,
      note: acfgTxnData.note?.constructor === Uint8Array
        ? acfgTxnData.note : encodeTransactionNote(acfgTxnData.note),
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
        fee,
        flatFee,
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
        fee,
        flatFee,
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
        fee,
        flatFee,
        firstRound: acfgTxnData.fv,
        lastRound: acfgTxnData.lv,
        genesisHash,
        genesisID,
      }
    });
  }

  if (acfgTxnData.lx) {
    txn.addLease(
      acfgTxnData.lx.constructor === Uint8Array
        ? acfgTxnData.lx : (new TextEncoder).encode(acfgTxnData.lx as string),
      flatFee ? 0 : fee
    );
  }

  return txn;
}

/** Creates a `Transaction` object that represents an Algorand asset freeze transaction */
function createAfrzTxn(
  afrzTxnData: TxnData.AssetFreezeTxnData,
  genesisID: string,
  genesisHash: string,
  flatFee = true
) {
  const fee = algosdk.algosToMicroalgos(afrzTxnData.fee);
  const txn = algosdk.makeAssetFreezeTxnWithSuggestedParamsFromObject({
    from: afrzTxnData.snd,
    note: afrzTxnData.note?.constructor === Uint8Array
      ? afrzTxnData.note : encodeTransactionNote(afrzTxnData.note),
    rekeyTo: afrzTxnData.rekey || undefined,
    assetIndex: afrzTxnData.faid,
    freezeTarget: afrzTxnData.fadd,
    freezeState: afrzTxnData.afrz,
    suggestedParams: {
      fee,
      flatFee,
      firstRound: afrzTxnData.fv,
      lastRound: afrzTxnData.lv,
      genesisHash,
      genesisID,
    }
  });

  if (afrzTxnData.lx) {
    txn.addLease(
      afrzTxnData.lx.constructor === Uint8Array
        ? afrzTxnData.lx : (new TextEncoder).encode(afrzTxnData.lx as string),
      flatFee ? 0 : fee
    );
  }

  return txn;
}

/** Creates a `Transaction` object that represents an Algorand key registration transaction */
function createKeyRegTxn(
  keyRegTxnData: TxnData.KeyRegTxnData,
  genesisID: string,
  genesisHash: string,
  flatFee = true
) {
  const fee = algosdk.algosToMicroalgos(keyRegTxnData.fee);
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
    note: keyRegTxnData.note?.constructor === Uint8Array
      ? keyRegTxnData.note : encodeTransactionNote(keyRegTxnData.note),
    rekeyTo: keyRegTxnData.rekey || undefined,
    suggestedParams: {
      fee,
      flatFee,
      firstRound: keyRegTxnData.fv,
      lastRound: keyRegTxnData.lv,
      genesisHash,
      genesisID,
    }
  });

  if (keyRegTxnData.lx) {
    txn.addLease(
      keyRegTxnData.lx.constructor === Uint8Array
        ? keyRegTxnData.lx : (new TextEncoder).encode(keyRegTxnData.lx as string),
      flatFee ? 0 : fee
    );
  }

  return txn;
}

/** Creates a `Transaction` object that represents an Algorand application call transaction */
function createApplTxn(
  applTxnData: TxnData.AppCallTxnData,
  genesisID: string,
  genesisHash: string,
  flatFee = true
) {
  const fee = algosdk.algosToMicroalgos(applTxnData.fee);
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
    note: applTxnData.note?.constructor === Uint8Array
      ? applTxnData.note : encodeTransactionNote(applTxnData.note),
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
      fee,
      flatFee,
      firstRound: applTxnData.fv,
      lastRound: applTxnData.lv,
      genesisHash,
      genesisID,
    },
  });

  if (applTxnData.lx) {
    txn.addLease(
      applTxnData.lx.constructor === Uint8Array
        ? applTxnData.lx : (new TextEncoder).encode(applTxnData.lx as string),
      flatFee ? 0 : fee
    );
  }

  return txn;
}
