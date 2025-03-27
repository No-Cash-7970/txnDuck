/**
 * @file Collection of atoms for stored transaction data with utility functions for loading stored
 * transaction data and extracting transaction data from the atoms
 */

import { type ReadonlyURLSearchParams } from 'next/navigation';
import { microalgosToAlgos, OnApplicationComplete, TransactionType } from 'algosdk';
import { type useStore } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { atomWithValidate } from 'jotai-form';
import {
  baseUnitsToDecimal,
  decimalToBaseUnits,
  removeNonNumericalChars,
  removeNonNumericalDecimalChars
} from '@/app/lib/utils';
import * as txnDataAtoms from './atoms';
import { MAX_VALID_ROUNDS_PERIOD, MIN_TX_FEE, Preset } from './constants';
import {
  StoredTxnData,
  type AppCallTxnData,
  type AssetConfigTxnData,
  type AssetFreezeTxnData,
  type AssetTransferTxnData,
  type KeyRegTxnData,
  type PaymentTxnData,
  RetrievedAssetInfo,
} from './types';
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
  createb64ApaaCondValidateAtom,
  generalFormControlAtom,
  keyRegFormControlAtom,
  paymentFormControlAtom
} from './field-validation';

/* Code adapted from https://github.com/pmndrs/jotai/discussions/1220#discussioncomment-2918007 */
const storage = createJSONStorage<any>(() => sessionStorage); // Set the type of storage

/** Transaction form data that is temporarily stored locally */
export const storedTxnDataAtom = atomWithStorage<StoredTxnData|undefined>(
  'txnData', undefined, storage
);

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
  jotaiStore: ReturnType<typeof useStore>,
  searchParams: ReadonlyURLSearchParams,
  storedTxnData?: StoredTxnData,
) {
  // Check if the form is being submitted. The transaction data is put into storage when the form
  // is submitted. If the form is being submitted, the transaction data does not need to be
  // restored into the atoms, so we can stop here to save time and effort.
  if (submittingForm) return;

  /*
   * Set transaction type according to preset
   */

  let txnType = storedTxnData?.txn?.type;
  const preset = searchParams.get(Preset.ParamName);

  // Determine transaction type based on the preset being used
  switch (preset) {
    case undefined: // No preset being used
      break; // Shortcut out. No need to evaluate the rest of the cases.
    case Preset.Transfer:
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

  // Set transaction type before setting any other transaction fields
  jotaiStore.set(txnDataAtoms.txnType, txnType);

  /*
   * Process URL parameters
   */

  // General transaction fields URL parameters
  const sndParam = searchParams.get('snd');
  const noteParam = searchParams.get('note');
  const unparsedFeeParam = searchParams.get('fee');
  const feeParam = unparsedFeeParam === null ? null : parseFloat(unparsedFeeParam);
  const unparsedFvParam = searchParams.get('fv');
  const fvParam = unparsedFvParam === null ? null : parseInt(unparsedFvParam);
  const unparsedLvParam = searchParams.get('lv');
  const lvParam = unparsedLvParam === null ? null : parseInt(unparsedLvParam);
  // Payment transaction fields URL parameters
  const rcvParam = searchParams.get('rcv');
  const unparsedAmtParam = searchParams.get('amt');
  const amtParam = unparsedAmtParam === null ? null : parseFloat(unparsedAmtParam);
  // Asset transfer transaction fields URL parameters
  const unparsedXaidParam = searchParams.get('xaid');
  const xaidParam = unparsedXaidParam === null
    ? null : parseInt(removeNonNumericalChars(unparsedXaidParam));
  const arcvParam = searchParams.get('arcv');
  const unparsedAamtParam = searchParams.get('aamt');
  const aamtParam = unparsedAamtParam === null
    ? null : removeNonNumericalDecimalChars(unparsedAamtParam);
  // Asset configuration transaction fields URL parameters
  const unparsedCaidParam = searchParams.get('caid');
  const caidParam = unparsedCaidParam === null
    ? null : parseInt(removeNonNumericalChars(unparsedCaidParam));
  // Asset freeze transaction fields URL parameters
  const unparsedFaidParam = searchParams.get('faid');
  const faidParam = unparsedFaidParam === null
    ? null : parseInt(removeNonNumericalChars(unparsedFaidParam));
  const faddParam = searchParams.get('fadd');
  // Key registration transaction fields URL parameters
  const votekeyParam = searchParams.get('votekey');
  const selkeyParam = searchParams.get('selkey');
  const sprfkeyParam = searchParams.get('sprfkey');
  const unparsedVotefstParam = searchParams.get('votefst');
  const votefstParam = unparsedVotefstParam === null ? null : parseInt(unparsedVotefstParam);
  const unparsedVotelstParam = searchParams.get('votelst');
  const votelstParam = unparsedVotelstParam === null ? null : parseInt(unparsedVotelstParam);
  const unparsedVotekdParam = searchParams.get('votekd');
  const votekdParam = unparsedVotekdParam === null ? null : parseInt(unparsedVotekdParam);
  // Application transaction fields URL parameters
  const unparsedApidParam = searchParams.get('apid');
  const apidParam = unparsedApidParam === null
    ? null : parseInt(removeNonNumericalChars(unparsedApidParam));

  if (preset && (
    // General
    sndParam !== null
    || noteParam !== null
    || feeParam !== null
    || fvParam !== null
    || lvParam !== null
    // Payment
    || rcvParam !== null || amtParam !== null
    // Asset transfer
    || xaidParam !== null || arcvParam !== null || aamtParam !== null
    // Asset reconfiguration
    || caidParam !== null
    // Asset freeze
    || faidParam !== null
    // Key registration
    || votekeyParam !== null
    || selkeyParam !== null
    || sprfkeyParam !== null
    || votefstParam !== null
    || votelstParam !== null
    || votekdParam !== null
    // Application
    || apidParam !== null
  )) {
    if (sndParam !== null) jotaiStore.set(txnDataAtoms.snd, sndParam);

    if (noteParam !== null) {
      jotaiStore.set(txnDataAtoms.b64Note, false);
      jotaiStore.set(txnDataAtoms.note, noteParam);
    }

    if (feeParam !== null) {
      jotaiStore.set(txnDataAtoms.useSugFee, false);
      jotaiStore.set(txnDataAtoms.fee, isNaN(feeParam) ? microalgosToAlgos(MIN_TX_FEE) : feeParam);
    }

    // Do not use suggested rounds if the URL parameter for the first valid round or last valid
    // round is specified
    if (fvParam !== null || lvParam !== null) {
      jotaiStore.set(txnDataAtoms.useSugRounds, false);
    }

    if (fvParam !== null) {
      jotaiStore.set(txnDataAtoms.fv, isNaN(fvParam) ? undefined : fvParam);
      // If the first valid round (`fv`) is set to a nonempty value and the last valid round (`lv`)
      // is not set, the last valid round will automatically be set to 1,000 rounds *after* the
      // first valid round.
      if (!isNaN(fvParam) && lvParam === null) {
        jotaiStore.set(txnDataAtoms.lv, fvParam + MAX_VALID_ROUNDS_PERIOD);
      }
    }

    if (lvParam !== null) {
      jotaiStore.set(txnDataAtoms.lv, isNaN(lvParam) ? undefined : lvParam);
      // If the last valid round (`lv`) is set to a nonempty value and the first valid round (`fv`)
      // is not set, the first valid round will automatically be set to 1,000 rounds *before* the
      // last valid round.
      if (!isNaN(lvParam) && fvParam === null) {
        jotaiStore.set(txnDataAtoms.fv, lvParam - MAX_VALID_ROUNDS_PERIOD);
      }
    }

    // Payment
    if (preset === Preset.TransferAlgos || preset === Preset.Transfer) {
      if (rcvParam !== null) jotaiStore.set(txnDataAtoms.rcv, rcvParam);

      if (amtParam !== null) {
        jotaiStore.set(txnDataAtoms.amt, isNaN(amtParam) ? undefined : amtParam);
      }
    }

    // Asset transfer, opt-in, opt-out or clawback
    if (txnType === TransactionType.axfer) {
      if (xaidParam !== null) {
        jotaiStore.set(txnDataAtoms.xaid, isNaN(xaidParam) ? undefined : xaidParam);
      }

      if (preset === Preset.AssetTransfer && xaidParam) {
        // Asset receiver and amount URL parameters are ignored if the asset ID is not present
        if (arcvParam !== null) jotaiStore.set(txnDataAtoms.arcv, arcvParam);
        if (aamtParam !== null) jotaiStore.set(txnDataAtoms.aamt, aamtParam);
      }
    }

    // Asset reconfiguration or destroy
    if (txnType === TransactionType.acfg && preset !== Preset.AssetCreate) {
      if (caidParam !== null) {
        jotaiStore.set(txnDataAtoms.caid, isNaN(caidParam) ? undefined : caidParam);
      }
    }

    // Asset freeze or unfreeze
    if (txnType === TransactionType.afrz) {
      if (faidParam !== null) {
        jotaiStore.set(txnDataAtoms.faid, isNaN(faidParam) ? undefined : faidParam);
      }

      if (faddParam !== null) jotaiStore.set(txnDataAtoms.fadd, faddParam);
    }

    // Key Registration (online)
    if (preset === Preset.RegOnline) {
      if (votekeyParam !== null) jotaiStore.set(txnDataAtoms.votekey, votekeyParam);
      if (selkeyParam !== null) jotaiStore.set(txnDataAtoms.selkey, selkeyParam);
      if (sprfkeyParam !== null) jotaiStore.set(txnDataAtoms.sprfkey, sprfkeyParam);

      if (votefstParam !== null) {
        jotaiStore.set(txnDataAtoms.votefst, isNaN(votefstParam) ? undefined : votefstParam);
      }

      if (votelstParam !== null) {
        jotaiStore.set(txnDataAtoms.votelst, isNaN(votelstParam) ? undefined : votelstParam);
      }

      if (votekdParam !== null) {
        jotaiStore.set(txnDataAtoms.votekd, isNaN(votekdParam) ? undefined : votekdParam);
      }
    }

    // Application run, opt-in, update, close, clear and delete
    if (txnType === TransactionType.appl && preset !== Preset.AppDeploy) {
      if (apidParam !== null) {
        jotaiStore.set(txnDataAtoms.apid, isNaN(apidParam) ? undefined : apidParam);
      }
    }

    // Exit because the stored transaction data should not be used when URL parameters for
    // transaction fields are specified
    return;
  }

  /*
   * Restore stored transaction data into atoms
   */

  jotaiStore.set(txnDataAtoms.snd, storedTxnData?.txn?.snd || '');
  jotaiStore.set(txnDataAtoms.b64Note, storedTxnData?.b64Note ?? false);
  jotaiStore.set(txnDataAtoms.note, storedTxnData?.txn?.note as string|undefined);
  jotaiStore.set(txnDataAtoms.useSugFee, storedTxnData?.useSugFee ?? true);
  jotaiStore.set(txnDataAtoms.fee, storedTxnData?.txn?.fee);
  jotaiStore.set(txnDataAtoms.useSugRounds, storedTxnData?.useSugRounds ?? true);
  jotaiStore.set(txnDataAtoms.fv, storedTxnData?.txn?.fv);
  jotaiStore.set(txnDataAtoms.lv, storedTxnData?.txn?.lv);

  if (!preset || preset === Preset.AppRun) {
    jotaiStore.set(txnDataAtoms.lx, (storedTxnData?.txn?.lx as string|undefined) || '');
    jotaiStore.set(txnDataAtoms.b64Lx, storedTxnData?.b64Lx ?? false);
  }

  if (!preset || preset === Preset.RekeyAccount) {
    jotaiStore.set(txnDataAtoms.rekey, storedTxnData?.txn?.rekey || '');
  }

  // Restore payment transaction data, if applicable
  if (txnType === TransactionType.pay) {
    if (!preset || preset === Preset.TransferAlgos || preset === Preset.Transfer) {
      jotaiStore.set(txnDataAtoms.rcv, (storedTxnData?.txn as PaymentTxnData)?.rcv || '');
      jotaiStore.set(txnDataAtoms.amt, (storedTxnData?.txn as PaymentTxnData)?.amt);
    }
    if (!preset || preset === Preset.CloseAccount) {
      jotaiStore.set(txnDataAtoms.close, (storedTxnData?.txn as PaymentTxnData)?.close || '');
    }
  }

  // Restore asset transfer transaction data, if applicable
  else if (txnType === TransactionType.axfer) {
    jotaiStore.set(txnDataAtoms.xaid, (storedTxnData?.txn as AssetTransferTxnData)?.xaid);

    if (preset !== Preset.AssetOptIn && preset !== Preset.AssetOptOut) {
      jotaiStore.set(txnDataAtoms.arcv, (storedTxnData?.txn as AssetTransferTxnData)?.arcv || '');

      // Stored asset amount should be denominated in base units
      const aamt = (storedTxnData?.txn as AssetTransferTxnData)?.aamt;
      jotaiStore.set(txnDataAtoms.aamt,
        aamt === undefined
          ? '' : baseUnitsToDecimal(aamt, storedTxnData?.retrievedAssetInfo?.decimals)
      );
    }
    if (!preset || preset === Preset.AssetClawback) {
      jotaiStore.set(txnDataAtoms.asnd, (storedTxnData?.txn as AssetTransferTxnData)?.asnd || '');
    }
    if (!preset || preset === Preset.AssetOptOut) {
      jotaiStore.set(txnDataAtoms.aclose,
        (storedTxnData?.txn as AssetTransferTxnData)?.aclose || ''
      );
    }

    if (storedTxnData?.retrievedAssetInfo) {
      jotaiStore.set(txnDataAtoms.retrievedAssetInfo, storedTxnData?.retrievedAssetInfo);
    }
  }

  // Restore asset configuration transaction data, if applicable
  else if (txnType === TransactionType.acfg) {
    if (preset !== Preset.AssetCreate) {
      jotaiStore.set(txnDataAtoms.caid, (storedTxnData?.txn as AssetConfigTxnData)?.caid);
    } else { // Is asset-create preset
      // Clear the asset ID in case it was set due to a different preset being used previously
      jotaiStore.set(txnDataAtoms.caid, undefined);
    }

    jotaiStore.set(txnDataAtoms.apar_un,
      ((storedTxnData?.txn as AssetConfigTxnData)?.apar_un as string|undefined) || '');
    jotaiStore.set(txnDataAtoms.apar_an, (storedTxnData?.txn as AssetConfigTxnData)?.apar_an || '');
    jotaiStore.set(txnDataAtoms.apar_t, (storedTxnData?.txn as AssetConfigTxnData)?.apar_t || '');
    jotaiStore.set(txnDataAtoms.apar_dc, (storedTxnData?.txn as AssetConfigTxnData)?.apar_dc);
    jotaiStore.set(txnDataAtoms.apar_df, !!((storedTxnData?.txn as AssetConfigTxnData)?.apar_df));
    jotaiStore.set(txnDataAtoms.apar_au, (storedTxnData?.txn as AssetConfigTxnData)?.apar_au || '');
    jotaiStore.set(txnDataAtoms.apar_am,
      ((storedTxnData?.txn as AssetConfigTxnData)?.apar_am as string|undefined) || '');
    jotaiStore.set(txnDataAtoms.b64Apar_am, storedTxnData?.b64Apar_am ?? false);
    jotaiStore.set(txnDataAtoms.apar_m, (storedTxnData?.txn as AssetConfigTxnData)?.apar_m || '');
    jotaiStore.set(txnDataAtoms.apar_f, (storedTxnData?.txn as AssetConfigTxnData)?.apar_f || '');
    jotaiStore.set(txnDataAtoms.apar_c, (storedTxnData?.txn as AssetConfigTxnData)?.apar_c || '');
    jotaiStore.set(txnDataAtoms.apar_r, (storedTxnData?.txn as AssetConfigTxnData)?.apar_r || '');

    if (storedTxnData?.retrievedAssetInfo) {
      jotaiStore.set(txnDataAtoms.retrievedAssetInfo, storedTxnData?.retrievedAssetInfo);
    }
  }

  // Restore asset freeze transaction data, if applicable
  else if (txnType === TransactionType.afrz) {
    jotaiStore.set(txnDataAtoms.faid, (storedTxnData?.txn as AssetFreezeTxnData)?.faid);
    jotaiStore.set(txnDataAtoms.fadd, (storedTxnData?.txn as AssetFreezeTxnData)?.fadd || '');

    if (preset === Preset.AssetFreeze) {
      jotaiStore.set(txnDataAtoms.afrz, true);
    } else if (preset === Preset.AssetUnfreeze) {
      jotaiStore.set(txnDataAtoms.afrz, false);
    } else {
      jotaiStore.set(txnDataAtoms.afrz, (storedTxnData?.txn as AssetFreezeTxnData)?.afrz ?? false);
    }

    if (storedTxnData?.retrievedAssetInfo) {
      jotaiStore.set(txnDataAtoms.retrievedAssetInfo, storedTxnData?.retrievedAssetInfo);
    }
  }

  // Restore key registration transaction data, if applicable
  else if (txnType === TransactionType.keyreg) {
    if (!preset || preset === Preset.RegOnline) {
      jotaiStore.set(txnDataAtoms.votekey, (storedTxnData?.txn as KeyRegTxnData)?.votekey || '');
      jotaiStore.set(txnDataAtoms.selkey, (storedTxnData?.txn as KeyRegTxnData)?.selkey || '');
      jotaiStore.set(txnDataAtoms.sprfkey, (storedTxnData?.txn as KeyRegTxnData)?.sprfkey || '');
      jotaiStore.set(txnDataAtoms.votefst, (storedTxnData?.txn as KeyRegTxnData)?.votefst);
      jotaiStore.set(txnDataAtoms.votelst, (storedTxnData?.txn as KeyRegTxnData)?.votelst);
      jotaiStore.set(txnDataAtoms.votekd, (storedTxnData?.txn as KeyRegTxnData)?.votekd);
    }
    if (!preset) {
      jotaiStore.set(txnDataAtoms.nonpart, (storedTxnData?.txn as KeyRegTxnData)?.nonpart);
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
          (storedTxnData?.txn as AppCallTxnData)?.apan
        );
        break;
    }

    if (preset !== Preset.AppDeploy) {
      jotaiStore.set(txnDataAtoms.apid, (storedTxnData?.txn as AppCallTxnData)?.apid);
    }
    if (!preset || preset === Preset.AppDeploy || preset === Preset.AppUpdate) {
      jotaiStore.set(txnDataAtoms.apap, (storedTxnData?.txn as AppCallTxnData)?.apap || '');
      jotaiStore.set(txnDataAtoms.apsu, (storedTxnData?.txn as AppCallTxnData)?.apsu || '');
    }
    if (!preset || preset === Preset.AppDeploy) {
      jotaiStore.set(txnDataAtoms.apgs_nui, (storedTxnData?.txn as AppCallTxnData)?.apgs_nui);
      jotaiStore.set(txnDataAtoms.apgs_nbs, (storedTxnData?.txn as AppCallTxnData)?.apgs_nbs);
      jotaiStore.set(txnDataAtoms.apls_nui, (storedTxnData?.txn as AppCallTxnData)?.apls_nui);
      jotaiStore.set(txnDataAtoms.apls_nbs, (storedTxnData?.txn as AppCallTxnData)?.apls_nbs);
      jotaiStore.set(txnDataAtoms.apep, (storedTxnData?.txn as AppCallTxnData)?.apep);
    }

    jotaiStore.set(txnDataAtoms.b64Apaa, storedTxnData?.b64Apaa ?? false);
    jotaiStore.set(txnDataAtoms.apaaListAtom,
      (storedTxnData?.txn as AppCallTxnData)?.apaa
        ? ((storedTxnData?.txn as AppCallTxnData)?.apaa).map(arg => {
          // Create atom for this argument
          const newAtom = atomWithValidate(arg as string, apaaValidateOptions);
          // Create conditional validation atom for this argument too
          txnDataAtoms.b64ApaaCondList.push(createb64ApaaCondValidateAtom(newAtom));
          return newAtom;
        })
        : []
    );
    jotaiStore.set(txnDataAtoms.apatListAtom,
      (storedTxnData?.txn as AppCallTxnData)?.apat
        ? ((storedTxnData?.txn as AppCallTxnData)?.apat).map(
          acct => atomWithValidate(acct, apatValidateOptions)
        )
        : []
    );
    jotaiStore.set(txnDataAtoms.apfaListAtom,
      (storedTxnData?.txn as AppCallTxnData)?.apfa
        ? ((storedTxnData?.txn as AppCallTxnData)?.apfa).map(
          app => atomWithValidate(app, apfaValidateOptions)
        )
        : []
    );
    jotaiStore.set(txnDataAtoms.apasListAtom,
      (storedTxnData?.txn as AppCallTxnData)?.apas
        ? ((storedTxnData?.txn as AppCallTxnData)?.apas).map(
          asset => atomWithValidate(asset, apasValidateOptions)
        )
        : []
    );
    jotaiStore.set(txnDataAtoms.apbxListAtom,
      (storedTxnData?.txn as AppCallTxnData)?.apbx
        ? ((storedTxnData?.txn as AppCallTxnData)?.apbx).map(
          box => ({
            i: atomWithValidate(box.i, apbxIValidateOptions),
            n: atomWithValidate(box.n, apbxNValidateOptions)
          })
        )
        : []
    );
  }
}

/** Extract the transaction data from Jotai atoms and compile the data into a single object
 * @param preset The current preset being used
 * @param jotaiStore The Jotai Store for the atoms that contains the transaction data
 * @return Object containing the transaction data
 */
export function extractTxnDataFromAtoms(
  preset: string|null,
  jotaiStore: ReturnType<typeof useStore>
): StoredTxnData {
  const generalForm = jotaiStore.get(generalFormControlAtom);
  const txnType = generalForm.values.txnType;

  // Gather base transaction data
  let baseTxnData: any = {
    type: txnType,
    snd: generalForm.values.snd,
    note: generalForm.values.note,
    fee: generalForm.values.fee,
    fv: generalForm.values.fv,
    lv: generalForm.values.lv,
    lx: generalForm.values.lx || undefined,
    rekey: generalForm.values.rekey || undefined,
  };
  let specificTxnData: any = {};
  // Save retrieve asset information so it can be used for displaying asset information when signing
  // the transaction
  let retrievedAssetInfo: RetrievedAssetInfo | undefined = undefined;

  /** Extra options concerning asset configuration transactions */
  let acfgOptions: {
    apar_mUseSnd?: boolean,
    apar_fUseSnd?: boolean,
    apar_cUseSnd?: boolean,
    apar_rUseSnd?: boolean,
    b64Apar_am?: boolean,
  } = {};
  /** Extra options concerning application call transactions */
  let applOptions: {
    b64Apaa?: boolean,
  } = {};

  // Gather payment transaction data
  if (txnType === TransactionType.pay) {
    const paymentForm = jotaiStore.get(paymentFormControlAtom);

    specificTxnData = {
      rcv: paymentForm.values.rcv,
      amt: paymentForm.values.amt,
      close: paymentForm.values.close || undefined,
    };

    if (preset === Preset.TransferAlgos || preset === Preset.Transfer) {
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

    retrievedAssetInfo = jotaiStore.get(txnDataAtoms.retrievedAssetInfo).value;
    if (retrievedAssetInfo) {
      // Remove asset addresses from asset information
      retrievedAssetInfo = {
        id: retrievedAssetInfo.id,
        name: retrievedAssetInfo.name,
        unitName: retrievedAssetInfo.unitName,
        total: retrievedAssetInfo.total,
        decimals: retrievedAssetInfo.decimals,
      };
      // Convert asset amount decimal value to base units
      specificTxnData.aamt = decimalToBaseUnits(
        `${specificTxnData.aamt}`,
        retrievedAssetInfo.decimals
      );
    }

    if (preset === Preset.AssetOptIn) {
      specificTxnData.arcv = baseTxnData.snd;
      specificTxnData.aamt = 0;
    }
    else if (preset === Preset.AssetOptOut) {
      specificTxnData.arcv = specificTxnData.aclose;
      specificTxnData.aamt = 0;
    }

    if (preset && preset !== Preset.AssetOptOut) {
      specificTxnData.aclose = false;
    }

    if (preset && preset !== Preset.AssetClawback) {
      specificTxnData.asnd = undefined;
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

    // If creating an asset
    if ((!specificTxnData.caid && preset === null) || preset === Preset.AssetCreate) {
      // Ensure asset ID is unset
      specificTxnData.caid = undefined;

      // Set the asset addresses to sender, if applicable
      if (assetConfigForm.values.apar_mUseSnd) specificTxnData.apar_m = baseTxnData.snd;
      if (assetConfigForm.values.apar_fUseSnd) specificTxnData.apar_f = baseTxnData.snd;
      if (assetConfigForm.values.apar_cUseSnd) specificTxnData.apar_c = baseTxnData.snd;
      if (assetConfigForm.values.apar_rUseSnd) specificTxnData.apar_r = baseTxnData.snd;

      acfgOptions = {
        apar_mUseSnd: !!assetConfigForm.values.apar_mUseSnd,
        apar_fUseSnd: !!assetConfigForm.values.apar_fUseSnd,
        apar_cUseSnd: !!assetConfigForm.values.apar_cUseSnd,
        apar_rUseSnd: !!assetConfigForm.values.apar_rUseSnd,
        b64Apar_am: !!assetConfigForm.values.b64Apar_am,
      };
    } else { // Not creating an asset
      retrievedAssetInfo = jotaiStore.get(txnDataAtoms.retrievedAssetInfo).value;

      if (retrievedAssetInfo) {
        // Remove asset addresses from asset information
        retrievedAssetInfo = {
          id: retrievedAssetInfo.id,
          name: retrievedAssetInfo.name,
          unitName: retrievedAssetInfo.unitName,
          total: retrievedAssetInfo.total,
          decimals: retrievedAssetInfo.decimals,
        };
      }
    }

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

    retrievedAssetInfo = jotaiStore.get(txnDataAtoms.retrievedAssetInfo).value;
    if (retrievedAssetInfo) {
      // Remove asset addresses from asset information
      retrievedAssetInfo = {
        id: retrievedAssetInfo.id,
        name: retrievedAssetInfo.name,
        unitName: retrievedAssetInfo.unitName,
        total: retrievedAssetInfo.total,
        decimals: retrievedAssetInfo.decimals,
      };
    }

    if (preset === Preset.AssetFreeze) {
      specificTxnData.afrz = true;
    } else if (preset === Preset.AssetUnfreeze) {
      specificTxnData.afrz = false;
    }
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

    if (preset === Preset.RegOnline) {
      specificTxnData.nonpart = false;
    } else if (preset === Preset.RegOffline) {
      specificTxnData = {};
    }
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

    applOptions = {
      b64Apaa: !!applForm.values.b64Apaa,
    };

    if (preset === Preset.AppRun
      || preset === Preset.AppOptIn
      || preset === Preset.AppClose
      || preset === Preset.AppClear
      || preset === Preset.AppDelete
    ) {
      specificTxnData.apap = undefined;
      specificTxnData.apsu = undefined;
      specificTxnData.apgs_nui = undefined;
      specificTxnData.apgs_nbs = undefined;
      specificTxnData.apls_nui = undefined;
      specificTxnData.apls_nbs = undefined;
      specificTxnData.apep = undefined;
    } else if  (preset === Preset.AppUpdate){
      specificTxnData.apgs_nui = undefined;
      specificTxnData.apgs_nbs = undefined;
      specificTxnData.apls_nui = undefined;
      specificTxnData.apls_nbs = undefined;
      specificTxnData.apep = undefined;
    } else if (preset === Preset.AppDeploy) {
      specificTxnData.apid = undefined;
    }
  }

  return {
    txn: {...baseTxnData, ...specificTxnData},
    useSugFee: jotaiStore.get(txnDataAtoms.useSugFee).value,
    useSugRounds: jotaiStore.get(txnDataAtoms.useSugRounds).value,
    b64Note: jotaiStore.get(txnDataAtoms.b64Note).value,
    b64Lx: jotaiStore.get(txnDataAtoms.b64Lx).value,
    retrievedAssetInfo: retrievedAssetInfo,
    ...acfgOptions,
    ...applOptions,
  };
}
