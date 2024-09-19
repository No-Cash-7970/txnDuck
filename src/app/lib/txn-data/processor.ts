/** @file Functions that process transaction data and transform it into a `Transaction` object */

import algosdk from 'algosdkv3';
import { encodeTransactionNote, getAppArgsForTransaction } from '@algorandfoundation/algokit-utils';
import * as TxnData from '@/app/lib/txn-data';

/** Creates a "transaction data" object from a `Transaction` object
 * @param txn Transaction object from which to create the transaction data
 * @param options Options in how to parse and encode the `Transaction` object
 * @returns "Transaction data" object that contains the information in the `Transaction` object
 */
export function createDataFromTxn(txn: algosdk.Transaction, options: {
  /** Parse the note as byte data to be encoded to Base64? */
  b64Note?: boolean,
  /** Parse the lease as byte data to be encoded to Base64? */
  b64Lx?: boolean,
  /** Parse the metadata hash as byte data to be encoded to Base64? */
  b64Apar_am?: boolean,
  /** The network's minimum transaction fee */
  minFee?: number,
} = {}): TxnData.TxnData {
  const textDecoder = new TextDecoder;
  const output = {
    type: txn.type ?? 'pay',
    snd: txn.sender.toString(),
    fee: algosdk.microalgosToAlgos(Number(txn.fee) ?? 0),
    fv: Number(txn.firstValid),
    lv: Number(txn.lastValid),
  };

  if (txn.note?.length) {
    (output as TxnData.BaseTxnData).note = options.b64Note
      ? algosdk.bytesToBase64(txn.note)
      : textDecoder.decode(txn.note);
  }

  if (txn.lease?.length) {
    (output as TxnData.BaseTxnData).lx = options.b64Lx
      ? algosdk.bytesToBase64(txn.lease)
      : textDecoder.decode(txn.lease);
  }

  if (txn.rekeyTo) {
    (output as TxnData.BaseTxnData).rekey = txn.rekeyTo.toString();
  }

  if (output.type === 'pay') {
    (output as TxnData.PaymentTxnData).rcv = txn.payment?.receiver.toString() ?? '';
    (output as TxnData.PaymentTxnData).amt = algosdk.microalgosToAlgos(
      Number(txn.payment?.amount ?? 0)
    );

    if (txn.payment?.closeRemainderTo !== undefined) {
      (output as TxnData.PaymentTxnData).close = txn.payment.closeRemainderTo.toString();
    }
  }

  else if (output.type === 'axfer') {
    (output as TxnData.AssetTransferTxnData).xaid = Number(txn.assetTransfer?.assetIndex);
    (output as TxnData.AssetTransferTxnData).arcv = txn.assetTransfer?.receiver.toString() ?? '';
    (output as TxnData.AssetTransferTxnData).aamt = txn.assetTransfer?.amount.toString() ?? 0;

    if (txn.assetTransfer?.assetSender !== undefined) {
      (output as TxnData.AssetTransferTxnData).asnd = txn.assetTransfer.assetSender.toString();
    }

    if (txn.assetTransfer?.closeRemainderTo !== undefined) {
      (output as TxnData.AssetTransferTxnData).aclose =
        txn.assetTransfer?.closeRemainderTo.toString();
    }
  }

  else if (output.type === 'acfg') {
    (output as TxnData.AssetConfigTxnData).apar_un = txn.assetConfig?.unitName ?? '';
    (output as TxnData.AssetConfigTxnData).apar_an = txn.assetConfig?.assetName ?? '';
    (output as TxnData.AssetConfigTxnData).apar_t = txn.assetConfig?.total.toString() ?? '';
    (output as TxnData.AssetConfigTxnData).apar_dc = txn.assetConfig?.decimals;
    (output as TxnData.AssetConfigTxnData).apar_df = !!txn.assetConfig?.defaultFrozen;
    (output as TxnData.AssetConfigTxnData).apar_au = txn.assetConfig?.assetURL ?? '';
    (output as TxnData.AssetConfigTxnData).apar_m = txn.assetConfig?.manager?.toString() ?? '';
    (output as TxnData.AssetConfigTxnData).apar_f = txn.assetConfig?.freeze?.toString() ?? '';
    (output as TxnData.AssetConfigTxnData).apar_c = txn.assetConfig?.clawback?.toString() ?? '';
    (output as TxnData.AssetConfigTxnData).apar_r = txn.assetConfig?.reserve?.toString() ?? '';

    if (txn.assetConfig?.assetMetadataHash && txn.assetConfig?.assetMetadataHash.length > 0) {
      (output as TxnData.AssetConfigTxnData).apar_am = options.b64Apar_am
        ? algosdk.bytesToBase64(txn.assetConfig?.assetMetadataHash)
        : textDecoder.decode(txn.assetConfig?.assetMetadataHash);
    }

    if (!!txn.assetConfig?.assetIndex) {
      (output as TxnData.AssetConfigTxnData).caid = txn.assetConfig?.assetIndex
        ? Number(txn.assetConfig?.assetIndex) : undefined;
    }
  }

  else if (output.type === 'afrz') {
    (output as TxnData.AssetFreezeTxnData).faid = Number(txn.assetFreeze?.assetIndex);
    (output as TxnData.AssetFreezeTxnData).fadd = txn.assetFreeze?.freezeAccount?.toString() ?? '';
    (output as TxnData.AssetFreezeTxnData).afrz = !!txn.assetFreeze?.frozen;
  }

  else if (output.type === 'keyreg') {
    if (txn.keyreg?.voteKey?.length) {
      (output as TxnData.KeyRegTxnData).votekey = algosdk.bytesToBase64(txn.keyreg?.voteKey);
    }

    if (txn.keyreg?.selectionKey?.length) {
      (output as TxnData.KeyRegTxnData).selkey = algosdk.bytesToBase64(txn.keyreg?.selectionKey);
    }

    if (txn.keyreg?.stateProofKey?.length) {
      (output as TxnData.KeyRegTxnData).sprfkey = algosdk.bytesToBase64(txn.keyreg?.stateProofKey);
    }

    if (!!txn.keyreg?.voteFirst) {
      (output as TxnData.KeyRegTxnData).votefst = Number(txn.keyreg.voteFirst);
    }

    if (!!txn.keyreg?.voteLast) {
      (output as TxnData.KeyRegTxnData).votelst = Number(txn.keyreg.voteLast);
    }

    if (!!txn.keyreg?.voteKeyDilution) {
      (output as TxnData.KeyRegTxnData).votekd = Number(txn.keyreg.voteKeyDilution);
    }

    if (txn.keyreg?.nonParticipation !== undefined) {
      (output as TxnData.KeyRegTxnData).nonpart = txn.keyreg?.nonParticipation;
    }
  }

  else if (output.type === 'appl') {
    (output as TxnData.AppCallTxnData).apan = txn.applicationCall?.onComplete ?? 0;
    (output as TxnData.AppCallTxnData).apgs_nui = txn.applicationCall?.numGlobalInts;
    (output as TxnData.AppCallTxnData).apgs_nbs = txn.applicationCall?.numGlobalByteSlices;
    (output as TxnData.AppCallTxnData).apls_nui = txn.applicationCall?.numLocalInts;
    (output as TxnData.AppCallTxnData).apls_nbs = txn.applicationCall?.numLocalByteSlices;
    (output as TxnData.AppCallTxnData).apep = txn.applicationCall?.extraPages;

    if (!!txn.applicationCall?.appIndex) {
      (output as TxnData.AppCallTxnData).apid = Number(txn.applicationCall.appIndex);
    }

    if (txn.applicationCall?.appArgs) {
      (output as TxnData.AppCallTxnData).apaa =
        txn.applicationCall.appArgs.map(appArg => textDecoder.decode(appArg)); // Base64?
    }

    if (txn.applicationCall?.approvalProgram.length) {
      (output as TxnData.AppCallTxnData).apap =
        textDecoder.decode(txn.applicationCall.approvalProgram);
    }

    if (txn.applicationCall?.clearProgram.length) {
      (output as TxnData.AppCallTxnData).apsu =
        textDecoder.decode(txn.applicationCall.clearProgram);
    }

    if (txn.applicationCall?.accounts) {
      (output as TxnData.AppCallTxnData).apat =
        txn.applicationCall.accounts.map(acct => acct.toString());
    }

    if (txn.applicationCall?.foreignApps) {
      (output as TxnData.AppCallTxnData).apfa =
        txn.applicationCall.foreignApps.map(app => Number(app));
    }

    if (txn.applicationCall?.foreignAssets) {
      (output as TxnData.AppCallTxnData).apas =
        txn.applicationCall.foreignAssets.map(asset => Number(asset));
    }

    if (txn.applicationCall?.boxes) {
      (output as TxnData.AppCallTxnData).apbx = txn.applicationCall.boxes.map(box => ({
        i: Number(box.appIndex),
        n: textDecoder.decode(box.name),
      }));
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
  flatFee = true,
  minFee = TxnData.MIN_TX_FEE,
) {
  switch (txnData.type) {
    case algosdk.TransactionType.pay:
      return createPayTxn(
        txnData as TxnData.PaymentTxnData,
        genesisID,
        genesisHash,
        flatFee,
        minFee,
      );
    case algosdk.TransactionType.axfer:
      return createAxferTxn(
        txnData as TxnData.AssetTransferTxnData,
        genesisID,
        genesisHash,
        flatFee,
        minFee,
      );
    case algosdk.TransactionType.acfg:
      return createAcfgTxn(
        txnData as TxnData.AssetConfigTxnData,
        genesisID,
        genesisHash,
        flatFee,
        minFee,
      );
    case algosdk.TransactionType.afrz:
      return createAfrzTxn(
        txnData as TxnData.AssetFreezeTxnData,
        genesisID,
        genesisHash,
        flatFee,
        minFee,
      );
    case algosdk.TransactionType.keyreg:
      return createKeyRegTxn(
        txnData as TxnData.KeyRegTxnData,
        genesisID,
        genesisHash,
        flatFee,
        minFee,
      );
    case algosdk.TransactionType.appl:
      return createApplTxn(
        txnData as TxnData.AppCallTxnData,
        genesisID,
        genesisHash,
        flatFee,
        minFee,
      );
    default:
      throw Error('Unsupported transaction type');
  }
}

/** Creates a `Transaction` object that represents an Algorand payment transaction */
function createPayTxn(
  payTxnData: TxnData.PaymentTxnData,
  genesisID: string,
  genesisHash: string,
  flatFee: boolean,
  minFee = TxnData.MIN_TX_FEE,
) {
  const fee = algosdk.algosToMicroalgos(payTxnData.fee);
  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    sender: payTxnData.snd,
    receiver: payTxnData.rcv,
    amount: algosdk.algosToMicroalgos(payTxnData.amt),
    note: payTxnData.note?.constructor === Uint8Array
      ? payTxnData.note : encodeTransactionNote(payTxnData.note),
    rekeyTo: payTxnData.rekey || undefined,
    closeRemainderTo: payTxnData.close || undefined,
    lease: payTxnData.lx?.constructor === Uint8Array
      ? payTxnData.lx
      : (payTxnData.lx ? (new TextEncoder).encode(payTxnData.lx as string) : undefined),
    suggestedParams: {
      fee,
      flatFee,
      minFee,
      firstValid: payTxnData.fv,
      lastValid: payTxnData.lv,
      genesisHash: algosdk.base64ToBytes(genesisHash),
      genesisID,
    }
  });

  return txn;
}

/** Creates a `Transaction` object that represents an Algorand asset transfer transaction */
function createAxferTxn(
  axferTxnData: TxnData.AssetTransferTxnData,
  genesisID: string,
  genesisHash: string,
  flatFee: boolean,
  minFee = TxnData.MIN_TX_FEE,
) {
  const fee = algosdk.algosToMicroalgos(axferTxnData.fee);
  const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    sender: axferTxnData.snd,
    receiver: axferTxnData.arcv,
    assetIndex: axferTxnData.xaid,
    amount: BigInt(axferTxnData.aamt),
    closeRemainderTo: axferTxnData.aclose || undefined,
    assetSender: axferTxnData.asnd || undefined,
    note: axferTxnData.note?.constructor === Uint8Array
      ? axferTxnData.note : encodeTransactionNote(axferTxnData.note),
    rekeyTo: axferTxnData.rekey || undefined,
    lease: axferTxnData.lx?.constructor === Uint8Array
      ? axferTxnData.lx
      : (axferTxnData.lx ? (new TextEncoder).encode(axferTxnData.lx as string) : undefined),
    suggestedParams: {
      fee,
      flatFee,
      minFee,
      firstValid: axferTxnData.fv,
      lastValid: axferTxnData.lv,
      genesisHash: algosdk.base64ToBytes(genesisHash),
      genesisID,
    }
  });

  return txn;
}

/** Creates a `Transaction` object that represents an Algorand asset configuration transaction */
function createAcfgTxn(
  acfgTxnData: TxnData.AssetConfigTxnData,
  genesisID: string,
  genesisHash: string,
  flatFee: boolean,
  minFee = TxnData.MIN_TX_FEE,
) {
  const fee = algosdk.algosToMicroalgos(acfgTxnData.fee);
  let txn;

  if (!acfgTxnData.caid) { // If asset creation transaction
    txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      sender: acfgTxnData.snd,
      note: acfgTxnData.note?.constructor === Uint8Array
        ? acfgTxnData.note : encodeTransactionNote(acfgTxnData.note),
      rekeyTo: acfgTxnData.rekey || undefined,
      unitName: acfgTxnData.apar_un || undefined,
      assetName: acfgTxnData.apar_an || undefined,
      total: BigInt(acfgTxnData.apar_t || ''),
      decimals: acfgTxnData.apar_dc || 0,
      defaultFrozen: acfgTxnData.apar_df,
      assetMetadataHash: acfgTxnData.apar_am?.constructor === Uint8Array
        ? acfgTxnData.apar_am
        : (acfgTxnData.apar_am
            ? (new TextEncoder).encode(acfgTxnData.apar_am as string) : undefined
          ),
      assetURL: acfgTxnData.apar_au || undefined,
      manager: acfgTxnData.apar_m || undefined,
      freeze: acfgTxnData.apar_f || undefined,
      clawback: acfgTxnData.apar_c || undefined,
      reserve: acfgTxnData.apar_r || undefined,
      lease: acfgTxnData.lx?.constructor === Uint8Array
        ? acfgTxnData.lx
        : (acfgTxnData.lx ? (new TextEncoder).encode(acfgTxnData.lx as string) : undefined),
      suggestedParams: {
        fee,
        flatFee,
        minFee,
        firstValid: acfgTxnData.fv,
        lastValid: acfgTxnData.lv,
        genesisHash: algosdk.base64ToBytes(genesisHash),
        genesisID,
      }
    });
  } else if ( // If asset configuration transaction
    acfgTxnData.apar_m || acfgTxnData.apar_f || acfgTxnData.apar_c || acfgTxnData.apar_r
  ) {
    txn = algosdk.makeAssetConfigTxnWithSuggestedParamsFromObject({
      sender: acfgTxnData.snd,
      note: encodeTransactionNote(acfgTxnData.note),
      rekeyTo: acfgTxnData.rekey || undefined,
      assetIndex: acfgTxnData.caid,
      manager: acfgTxnData.apar_m || undefined,
      freeze: acfgTxnData.apar_f || undefined,
      clawback: acfgTxnData.apar_c || undefined,
      reserve: acfgTxnData.apar_r || undefined,
      lease: acfgTxnData.lx?.constructor === Uint8Array
        ? acfgTxnData.lx
        : (acfgTxnData.lx ? (new TextEncoder).encode(acfgTxnData.lx as string) : undefined),
      suggestedParams: {
        fee,
        flatFee,
        minFee,
        firstValid: acfgTxnData.fv,
        lastValid: acfgTxnData.lv,
        genesisHash: algosdk.base64ToBytes(genesisHash),
        genesisID,
      },
      strictEmptyAddressChecking: false,
    });
  } else { // Is asset destroy transaction
    txn = algosdk.makeAssetDestroyTxnWithSuggestedParamsFromObject({
      sender: acfgTxnData.snd,
      note: encodeTransactionNote(acfgTxnData.note),
      rekeyTo: acfgTxnData.rekey || undefined,
      assetIndex: acfgTxnData.caid,
      lease: acfgTxnData.lx?.constructor === Uint8Array
        ? acfgTxnData.lx
        : (acfgTxnData.lx ? (new TextEncoder).encode(acfgTxnData.lx as string) : undefined),
      suggestedParams: {
        fee,
        flatFee,
        minFee,
        firstValid: acfgTxnData.fv,
        lastValid: acfgTxnData.lv,
        genesisHash: algosdk.base64ToBytes(genesisHash),
        genesisID,
      }
    });
  }

  return txn;
}

/** Creates a `Transaction` object that represents an Algorand asset freeze transaction */
function createAfrzTxn(
  afrzTxnData: TxnData.AssetFreezeTxnData,
  genesisID: string,
  genesisHash: string,
  flatFee: boolean,
  minFee = TxnData.MIN_TX_FEE,
) {
  const fee = algosdk.algosToMicroalgos(afrzTxnData.fee);
  const txn = algosdk.makeAssetFreezeTxnWithSuggestedParamsFromObject({
    sender: afrzTxnData.snd,
    note: afrzTxnData.note?.constructor === Uint8Array
      ? afrzTxnData.note : encodeTransactionNote(afrzTxnData.note),
    rekeyTo: afrzTxnData.rekey || undefined,
    assetIndex: afrzTxnData.faid,
    freezeTarget: afrzTxnData.fadd,
    frozen: afrzTxnData.afrz,
    lease: afrzTxnData.lx?.constructor === Uint8Array
        ? afrzTxnData.lx
        : (afrzTxnData.lx ? (new TextEncoder).encode(afrzTxnData.lx as string) : undefined),
    suggestedParams: {
      fee,
      flatFee,
      minFee,
      firstValid: afrzTxnData.fv,
      lastValid: afrzTxnData.lv,
      genesisHash: algosdk.base64ToBytes(genesisHash),
      genesisID,
    }
  });

  return txn;
}

/** Creates a `Transaction` object that represents an Algorand key registration transaction */
function createKeyRegTxn(
  keyRegTxnData: TxnData.KeyRegTxnData,
  genesisID: string,
  genesisHash: string,
  flatFee: boolean,
  minFee = TxnData.MIN_TX_FEE,
) {
  const fee = algosdk.algosToMicroalgos(keyRegTxnData.fee);
  const keyRegData = keyRegTxnData.nonpart
    ? { nonParticipation: true } // Activating "nonparticipation"
    : {
      voteKey: keyRegTxnData.votekey ? algosdk.base64ToBytes(keyRegTxnData.votekey) : undefined,
      selectionKey: keyRegTxnData.selkey ? algosdk.base64ToBytes(keyRegTxnData.selkey) : undefined,
      stateProofKey: keyRegTxnData.sprfkey
        ? algosdk.base64ToBytes(keyRegTxnData.sprfkey) : undefined,
      voteFirst: keyRegTxnData.votefst || undefined,
      voteLast: keyRegTxnData.votelst || undefined,
      voteKeyDilution: keyRegTxnData.votekd || undefined,
      nonParticipation: keyRegTxnData.nonpart, // false or unset
    };

  const txn = algosdk.makeKeyRegistrationTxnWithSuggestedParamsFromObject({
    ...keyRegData,
    sender: keyRegTxnData.snd,
    note: keyRegTxnData.note?.constructor === Uint8Array
      ? keyRegTxnData.note : encodeTransactionNote(keyRegTxnData.note),
    rekeyTo: keyRegTxnData.rekey || undefined,
    lease: keyRegTxnData.lx?.constructor === Uint8Array
        ? keyRegTxnData.lx
        : (keyRegTxnData.lx ? (new TextEncoder).encode(keyRegTxnData.lx as string) : undefined),
    suggestedParams: {
      fee,
      flatFee,
      minFee,
      firstValid: keyRegTxnData.fv,
      lastValid: keyRegTxnData.lv,
      genesisHash: algosdk.base64ToBytes(genesisHash),
      genesisID,
    }
  });

  return txn;
}

/** Creates a `Transaction` object that represents an Algorand application call transaction */
function createApplTxn(
  applTxnData: TxnData.AppCallTxnData,
  genesisID: string,
  genesisHash: string,
  flatFee: boolean,
  minFee = TxnData.MIN_TX_FEE,
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
    sender: applTxnData.snd,
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
    lease: applTxnData.lx?.constructor === Uint8Array
      ? applTxnData.lx
      : (applTxnData.lx ? (new TextEncoder).encode(applTxnData.lx as string) : undefined),
    suggestedParams: {
      fee,
      flatFee,
      minFee,
      firstValid: applTxnData.fv,
      lastValid: applTxnData.lv,
      genesisHash: algosdk.base64ToBytes(genesisHash),
      genesisID,
    },
  });

  return txn;
}
