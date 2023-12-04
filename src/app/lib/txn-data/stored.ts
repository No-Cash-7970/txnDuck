/** @file Collection of atoms for stored transaction data */

import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import {
  type AppCallTxnData,
  type AssetConfigTxnData,
  type AssetFreezeTxnData,
  type AssetTransferTxnData,
  type KeyRegTxnData,
  type PaymentTxnData,
  type TxnData,
  Preset,
} from './types';
import { atomWithValidate } from 'jotai-form';
import { type useStore } from 'jotai';
import { OnApplicationComplete, TransactionType } from 'algosdk';
import * as txnDataAtoms from './atoms';
import {
  apaaValidateOptions,
  apasValidateOptions,
  apatValidateOptions,
  apbxIValidateOptions,
  apbxNValidateOptions,
  apfaValidateOptions,
  applFormControlAtom,
  assetConfigFormControlAtom,
  assetFreezeFormControlAtom,
  assetTransferFormControlAtom,
  generalFormControlAtom,
  keyRegFormControlAtom,
  paymentFormControlAtom
} from './field-validation';

/* Code adapted from https://github.com/pmndrs/jotai/discussions/1220#discussioncomment-2918007 */
const storage = createJSONStorage<any>(() => sessionStorage); // Set they type of storage

/** Transaction form data that is temporarily stored locally */
export const storedTxnDataAtom = atomWithStorage<TxnData|undefined>('txnData', undefined, storage);

/** Signed transaction, as a Data URI string, that is stored locally */
export const storedSignedTxnAtom =
  atomWithStorage<string|undefined>('signedTxn', undefined, storage);

/** Load stored transaction data into Jotai atoms
 * @param submittingForm A flag for indicating that the form is being submitted
 * @param preset The current preset being used
 * @param jotaiStore  The Jotai Store for the atoms that will contain the transaction data
 * @param storedTxnData The stored transaction data to be put into Jotai atoms
 */
export function loadStoredTxnData(
  submittingForm: boolean,
  preset: string|null,
  jotaiStore: ReturnType<typeof useStore>,
  storedTxnData?: TxnData,
) {
  // Check if the form is being submitted. The transaction data is put into storage when the form
  // is submitted. If the form is being submitted, the transaction data does not need to be
  // restored into the atoms, so we can stop here to save time and effort.
  if (submittingForm) return;
  // Nothing else to do if there is no stored transaction data and not using a preset
  if (!storedTxnData && !preset) return;

  // NOTE: At this point, there is stored transaction and/or using a preset.  Certain field atoms
  // may be set according the preset being used.

  /*
   * Set transaction type according to preset
   */

  let txnType = storedTxnData?.type;

  switch (preset) {
    case Preset.TransferAlgos:
    case Preset.RekeyAccount:
    case Preset.CloseAccount:
      txnType = TransactionType.pay;
      break;
    case Preset.RegOnline:
    case Preset.RegOffline:
    case Preset.RegNonpart:
      txnType = TransactionType.keyreg;
      break;
    case Preset.AppRun:
    case Preset.AppOptIn:
    case Preset.AppDeploy:
    case Preset.AppUpdate:
    case Preset.AppClose:
    case Preset.AppClear:
    case Preset.AppDelete:
      txnType = TransactionType.appl;
      break;
    case Preset.AssetTransfer:
    case Preset.AssetOptIn:
    case Preset.AssetOptOut:
    case Preset.AssetClawback:
      txnType = TransactionType.axfer;
      break;
    case Preset.AssetCreate:
    case Preset.AssetReconfig:
    case Preset.AssetDestroy:
      txnType = TransactionType.acfg;
      break;
    case Preset.AssetFreeze:
    case Preset.AssetUnfreeze:
      txnType = TransactionType.afrz;
      break;
  }

  /*
   * Restore stored transaction data into atoms
   */

  jotaiStore.set(txnDataAtoms.txnType, txnType);
  jotaiStore.set(txnDataAtoms.snd, storedTxnData?.snd || '');
  jotaiStore.set(txnDataAtoms.note, storedTxnData?.note);
  jotaiStore.set(txnDataAtoms.fee, storedTxnData?.fee);
  jotaiStore.set(txnDataAtoms.fv, storedTxnData?.fv);
  jotaiStore.set(txnDataAtoms.lv, storedTxnData?.lv);

  if (!preset || preset === Preset.AppRun) {
    jotaiStore.set(txnDataAtoms.lx, storedTxnData?.lx || '');
  }

  if (!preset || preset === Preset.RekeyAccount) {
    jotaiStore.set(txnDataAtoms.rekey, storedTxnData?.rekey || '');
  }

  // Restore payment transaction data, if applicable
  if (txnType === TransactionType.pay) {
    if (!preset || preset === Preset.TransferAlgos) {
      jotaiStore.set(txnDataAtoms.rcv, (storedTxnData as PaymentTxnData)?.rcv || '');
      jotaiStore.set(txnDataAtoms.amt, (storedTxnData as PaymentTxnData)?.amt);
    }
    if (!preset || preset === Preset.CloseAccount) {
      jotaiStore.set(txnDataAtoms.close, (storedTxnData as PaymentTxnData)?.close || '');
    }
  }

  // Restore asset transfer transaction data, if applicable
  else if (txnType === TransactionType.axfer) {
    jotaiStore.set(txnDataAtoms.xaid, (storedTxnData as AssetTransferTxnData)?.xaid);

    if (preset !== Preset.AssetOptIn && preset !== Preset.AssetOptOut) {
      jotaiStore.set(txnDataAtoms.arcv, (storedTxnData as AssetTransferTxnData)?.arcv || '');
      jotaiStore.set(txnDataAtoms.aamt, (storedTxnData as AssetTransferTxnData)?.aamt || '');
    }
    if (!preset || preset === Preset.AssetClawback) {
      jotaiStore.set(txnDataAtoms.asnd, (storedTxnData as AssetTransferTxnData)?.asnd || '');
    }
    if (!preset || preset === Preset.AssetOptOut) {
      jotaiStore.set(txnDataAtoms.aclose, (storedTxnData as AssetTransferTxnData)?.aclose || '');
    }
  }

  // Restore asset configuration transaction data, if applicable
  else if (txnType === TransactionType.acfg) {
    if (preset !== Preset.AssetCreate) {
      jotaiStore.set(txnDataAtoms.caid, (storedTxnData as AssetConfigTxnData)?.caid);
    }
    jotaiStore.set(txnDataAtoms.apar_un, (storedTxnData as AssetConfigTxnData)?.apar_un || '');
    jotaiStore.set(txnDataAtoms.apar_an, (storedTxnData as AssetConfigTxnData)?.apar_an || '');
    jotaiStore.set(txnDataAtoms.apar_t, (storedTxnData as AssetConfigTxnData)?.apar_t || '');
    jotaiStore.set(txnDataAtoms.apar_dc, (storedTxnData as AssetConfigTxnData)?.apar_dc);
    jotaiStore.set(txnDataAtoms.apar_df, !!((storedTxnData as AssetConfigTxnData)?.apar_df));
    jotaiStore.set(txnDataAtoms.apar_au, (storedTxnData as AssetConfigTxnData)?.apar_au || '');
    jotaiStore.set(txnDataAtoms.apar_m, (storedTxnData as AssetConfigTxnData)?.apar_m || '');
    jotaiStore.set(txnDataAtoms.apar_f, (storedTxnData as AssetConfigTxnData)?.apar_f || '');
    jotaiStore.set(txnDataAtoms.apar_c, (storedTxnData as AssetConfigTxnData)?.apar_c || '');
    jotaiStore.set(txnDataAtoms.apar_r, (storedTxnData as AssetConfigTxnData)?.apar_r || '');
    jotaiStore.set(txnDataAtoms.apar_am, (storedTxnData as AssetConfigTxnData)?.apar_am || '');
  }

  // Restore asset freeze transaction data, if applicable
  else if (txnType === TransactionType.afrz) {
    jotaiStore.set(txnDataAtoms.faid, (storedTxnData as AssetFreezeTxnData)?.faid);
    jotaiStore.set(txnDataAtoms.fadd, (storedTxnData as AssetFreezeTxnData)?.fadd || '');

    if (preset === Preset.AssetFreeze) {
      jotaiStore.set(txnDataAtoms.afrz, true);
    } else if (preset === Preset.AssetUnfreeze) {
      jotaiStore.set(txnDataAtoms.afrz, false);
    } else {
      jotaiStore.set(txnDataAtoms.afrz, (storedTxnData as AssetFreezeTxnData)?.afrz ?? false);
    }
  }

  // Restore key registration transaction data, if applicable
  else if (txnType === TransactionType.keyreg) {
    if (!preset || preset === Preset.RegOnline) {
      jotaiStore.set(txnDataAtoms.votekey, (storedTxnData as KeyRegTxnData)?.votekey || '');
      jotaiStore.set(txnDataAtoms.selkey, (storedTxnData as KeyRegTxnData)?.selkey || '');
      jotaiStore.set(txnDataAtoms.sprfkey, (storedTxnData as KeyRegTxnData)?.sprfkey || '');
      jotaiStore.set(txnDataAtoms.votefst, (storedTxnData as KeyRegTxnData)?.votefst);
      jotaiStore.set(txnDataAtoms.votelst, (storedTxnData as KeyRegTxnData)?.votelst);
      jotaiStore.set(txnDataAtoms.votekd, (storedTxnData as KeyRegTxnData)?.votekd);
    }
    if (!preset) {
      jotaiStore.set(txnDataAtoms.nonpart, (storedTxnData as KeyRegTxnData)?.nonpart);
    }
    if (preset === Preset.RegNonpart) {
      jotaiStore.set(txnDataAtoms.nonpart, true);
    }
  }

  // Restore application call transaction data, if applicable
  else if (txnType === TransactionType.appl) {
    switch (preset) {
      case Preset.AppRun:
      case Preset.AppDeploy:
        jotaiStore.set(txnDataAtoms.apan, OnApplicationComplete.NoOpOC);
        break;
      case Preset.AppOptIn:
        jotaiStore.set(txnDataAtoms.apan, OnApplicationComplete.OptInOC);
        break;
      case Preset.AppUpdate:
        jotaiStore.set(txnDataAtoms.apan, OnApplicationComplete.UpdateApplicationOC);
        break;
      case Preset.AppClose:
        jotaiStore.set(txnDataAtoms.apan, OnApplicationComplete.CloseOutOC);
        break;
      case Preset.AppClear:
        jotaiStore.set(txnDataAtoms.apan, OnApplicationComplete.ClearStateOC);
        break;
      case Preset.AppDelete:
        jotaiStore.set(txnDataAtoms.apan, OnApplicationComplete.DeleteApplicationOC);
        break;
      default:
        jotaiStore.set(txnDataAtoms.apan,
          (storedTxnData as AppCallTxnData)?.apan
        );
        break;
    }

    if (preset !== Preset.AppDeploy) {
      jotaiStore.set(txnDataAtoms.apid, (storedTxnData as AppCallTxnData)?.apid);
    }
    if (!preset || preset === Preset.AppDeploy || preset === Preset.AppUpdate) {
      jotaiStore.set(txnDataAtoms.apap, (storedTxnData as AppCallTxnData)?.apap || '');
      jotaiStore.set(txnDataAtoms.apsu, (storedTxnData as AppCallTxnData)?.apsu || '');
    }
    if (!preset || preset === Preset.AppDeploy) {
      jotaiStore.set(txnDataAtoms.apgs_nui, (storedTxnData as AppCallTxnData)?.apgs_nui);
      jotaiStore.set(txnDataAtoms.apgs_nbs, (storedTxnData as AppCallTxnData)?.apgs_nbs);
      jotaiStore.set(txnDataAtoms.apls_nui, (storedTxnData as AppCallTxnData)?.apls_nui);
      jotaiStore.set(txnDataAtoms.apls_nbs, (storedTxnData as AppCallTxnData)?.apls_nbs);
      jotaiStore.set(txnDataAtoms.apep, (storedTxnData as AppCallTxnData)?.apep);
    }

    jotaiStore.set(txnDataAtoms.apaaListAtom,
      (storedTxnData as AppCallTxnData)?.apaa
        ? ((storedTxnData as AppCallTxnData)?.apaa).map(
          arg => atomWithValidate(arg, apaaValidateOptions)
        )
        : []
    );
    jotaiStore.set(txnDataAtoms.apatListAtom,
      (storedTxnData as AppCallTxnData)?.apat
        ? ((storedTxnData as AppCallTxnData)?.apat).map(
          acct => atomWithValidate(acct, apatValidateOptions)
        )
        : []
    );
    jotaiStore.set(txnDataAtoms.apfaListAtom,
      (storedTxnData as AppCallTxnData)?.apfa
        ? ((storedTxnData as AppCallTxnData)?.apfa).map(
          app => atomWithValidate(app, apfaValidateOptions)
        )
        : []
    );
    jotaiStore.set(txnDataAtoms.apasListAtom,
      (storedTxnData as AppCallTxnData)?.apas
        ? ((storedTxnData as AppCallTxnData)?.apas).map(
          asset => atomWithValidate(asset, apasValidateOptions)
        )
        : []
    );
    jotaiStore.set(txnDataAtoms.apbxListAtom,
      (storedTxnData as AppCallTxnData)?.apbx
        ? ((storedTxnData as AppCallTxnData)?.apbx).map(
          box => ({
            i: atomWithValidate(box.i, apbxIValidateOptions),
            n: atomWithValidate(box.n, apbxNValidateOptions)
          })
        )
        : []
    );
  }
}

/**
 * Extract the transaction data from Jotai atoms and compile the data into a single object
 * @param preset The current preset being used
 * @param jotaiStore The Jotai Store for the atoms that contains the transaction data
 * @return Object containing the transaction data
 */
export function extractTxnDataFromAtoms(
  preset: string|null,
  jotaiStore: ReturnType<typeof useStore>
): TxnData {
  const generalForm = jotaiStore.get(generalFormControlAtom);
  const txnType = generalForm.values.txnType;

  // Gather base transaction data
  let baseTxnData: any = {
    type: txnType,
    snd: generalForm.values.snd,
    note: generalForm.values.note,
    fee: generalForm.values.fee as number,
    fv: generalForm.values.fv as number,
    lv: generalForm.values.lv as number,
    lx: generalForm.values.lx || undefined,
    rekey: generalForm.values.rekey || undefined,
  };
  let specificTxnData: any = {};

  // Gather payment transaction data
  if (txnType === TransactionType.pay) {
    const paymentForm = jotaiStore.get(paymentFormControlAtom);

    specificTxnData = {
      rcv: paymentForm.values.rcv,
      amt: paymentForm.values.amt,
      close: paymentForm.values.close || undefined,
    };

    if (preset === Preset.TransferAlgos) {
      specificTxnData.close = undefined;
      baseTxnData.rekey = undefined;
    }
    else if (preset === Preset.RekeyAccount) {
      specificTxnData.rcv = baseTxnData.snd;
      specificTxnData.amt = 0;
    }
    else if (preset === Preset.CloseAccount) {
      specificTxnData.rcv = specificTxnData.close;
      specificTxnData.amt = 0;
      baseTxnData.rekey = undefined;
    }
  }

  // Gather asset transfer transaction data
  else if (txnType === TransactionType.axfer) {
    const assetTransferForm = jotaiStore.get(assetTransferFormControlAtom);

    specificTxnData = {
      arcv: assetTransferForm.values.arcv,
      xaid: assetTransferForm.values.xaid,
      aamt: assetTransferForm.values.aamt,
      asnd: assetTransferForm.values.asnd || undefined,
      aclose: assetTransferForm.values.aclose || undefined,
    };

    if (preset === Preset.AssetOptIn) {
      specificTxnData.arcv = baseTxnData.snd;
      specificTxnData.aamt = 0;
    }
    else if (preset === Preset.AssetOptOut) {
      specificTxnData.arcv = specificTxnData.aclose;
      specificTxnData.aamt = 0;
    }
  }

  // Gather asset configuration transaction data
  else if (txnType === TransactionType.acfg) {
    const assetConfigForm = jotaiStore.get(assetConfigFormControlAtom);

    specificTxnData = {
      caid: assetConfigForm.values.caid,
      apar_un: assetConfigForm.values.apar_un,
      apar_an: assetConfigForm.values.apar_an,
      apar_t: assetConfigForm.values.apar_t,
      apar_dc: assetConfigForm.values.apar_dc,
      apar_df: assetConfigForm.values.apar_df,
      apar_au: assetConfigForm.values.apar_au,
      apar_m: assetConfigForm.values.apar_m,
      apar_f: assetConfigForm.values.apar_f,
      apar_c: assetConfigForm.values.apar_c,
      apar_r: assetConfigForm.values.apar_r,
      apar_am: assetConfigForm.values.apar_am,
    };

    if (preset === Preset.AssetDestroy) {
      specificTxnData.apar_m = undefined;
      specificTxnData.apar_f = undefined;
      specificTxnData.apar_c = undefined;
      specificTxnData.apar_r = undefined;
    }
  }

  // Gather asset freeze transaction data
  else if (txnType === TransactionType.afrz) {
    const assetFreezeForm = jotaiStore.get(assetFreezeFormControlAtom);

    specificTxnData = {
      faid: assetFreezeForm.values.faid,
      fadd: assetFreezeForm.values.fadd,
      afrz: assetFreezeForm.values.afrz,
    };
  }

  // Gather key registration transaction data
  else if (txnType === TransactionType.keyreg) {
    const keyRegForm = jotaiStore.get(keyRegFormControlAtom);

    specificTxnData = {
      votekey: keyRegForm.values.votekey,
      selkey: keyRegForm.values.selkey,
      sprfkey: keyRegForm.values.sprfkey,
      votefst: keyRegForm.values.votefst,
      votelst: keyRegForm.values.votelst,
      votekd: keyRegForm.values.votekd,
      nonpart: keyRegForm.values.nonpart,
    };
  }

  // Gather application call transaction data
  else if (txnType === TransactionType.appl) {
    const applForm = jotaiStore.get(applFormControlAtom);

    specificTxnData = {
      apid: applForm.values.apid,
      apan: applForm.values.apan,
      apap: applForm.values.apap,
      apsu: applForm.values.apsu,
      apgs_nui: applForm.values.apgs_nui,
      apgs_nbs: applForm.values.apgs_nbs,
      apls_nui: applForm.values.apls_nui,
      apls_nbs: applForm.values.apls_nbs,
      apep: applForm.values.apep,
      apaa: jotaiStore.get(txnDataAtoms.apaaListAtom).map(
        (apaaAtom) => jotaiStore.get(apaaAtom).value ?? ''
      ),
      apat: jotaiStore.get(txnDataAtoms.apatListAtom).map(
        (apatAtom) => jotaiStore.get(apatAtom).value ?? ''
      ),
      apfa: jotaiStore.get(txnDataAtoms.apfaListAtom).map(
        (apfaAtom) => jotaiStore.get(apfaAtom).value ?? ''
      ),
      apas: jotaiStore.get(txnDataAtoms.apasListAtom).map(
        (apasAtom) => jotaiStore.get(apasAtom).value ?? ''
      ),
      apbx: jotaiStore.get(txnDataAtoms.apbxListAtom).map((apbxAtom) => ({
        i: jotaiStore.get(apbxAtom.i).value ?? '',
        n: jotaiStore.get(apbxAtom.n).value ?? '',
      })),
    };
  }

  return { ...baseTxnData, ...specificTxnData };
}
