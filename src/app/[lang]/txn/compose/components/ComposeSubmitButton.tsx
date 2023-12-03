import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { useAtomValue, useStore } from 'jotai';
import { atomWithValidate } from 'jotai-form';
import { OnApplicationComplete, TransactionType } from 'algosdk';
import { useTranslation } from '@/app/i18n/client';
import * as TxnData from '@/app/lib/txn-data';
import { FormControls } from 'jotai-form/dist/src/atomWithFormControls';
import { ignoreFormErrorsAtom } from '@/app/lib/app-settings';

type Props = {
  /** Language */
  lng?: string
};

/** Submit button for the "Compose Transaction" form */
export default function ComposeSubmitButton({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['compose_txn', 'common']);
  /** A flag for indicating that the form is being submitted */
  const [submittingForm, setSubmittingForm] = useState(false);
  const jotaiStore = useStore();
  const storedTxnData = useAtomValue(TxnData.storedTxnDataAtom);
  const ignoreFormErrors = useAtomValue(ignoreFormErrorsAtom);
  const router = useRouter();
  const currentURLParams = useSearchParams();
  const preset = currentURLParams.get(TxnData.Preset.ParamName);

  useEffect(() => {
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
      case TxnData.Preset.TransferAlgos:
      case TxnData.Preset.RekeyAccount:
      case TxnData.Preset.CloseAccount:
        txnType = TransactionType.pay;
        break;
      case TxnData.Preset.RegOnline:
      case TxnData.Preset.RegOffline:
      case TxnData.Preset.RegNonpart:
        txnType = TransactionType.keyreg;
        break;
      case TxnData.Preset.AppRun:
      case TxnData.Preset.AppOptIn:
      case TxnData.Preset.AppDeploy:
      case TxnData.Preset.AppUpdate:
      case TxnData.Preset.AppClose:
      case TxnData.Preset.AppClear:
      case TxnData.Preset.AppDelete:
        txnType = TransactionType.appl;
        break;
      case TxnData.Preset.AssetTransfer:
      case TxnData.Preset.AssetOptIn:
      case TxnData.Preset.AssetOptOut:
      case TxnData.Preset.AssetClawback:
        txnType = TransactionType.axfer;
        break;
      case TxnData.Preset.AssetCreate:
      case TxnData.Preset.AssetReconfig:
      case TxnData.Preset.AssetDestroy:
        txnType = TransactionType.acfg;
        break;
      case TxnData.Preset.AssetFreeze:
      case TxnData.Preset.AssetUnfreeze:
        txnType = TransactionType.afrz;
        break;
    }

    /*
     * Restore stored transaction data into atoms
     */

    jotaiStore.set(TxnData.txnDataAtoms.txnType, txnType);
    jotaiStore.set(TxnData.txnDataAtoms.snd, storedTxnData?.snd || '');
    jotaiStore.set(TxnData.txnDataAtoms.note, storedTxnData?.note);
    jotaiStore.set(TxnData.txnDataAtoms.fee, storedTxnData?.fee);
    jotaiStore.set(TxnData.txnDataAtoms.fv, storedTxnData?.fv);
    jotaiStore.set(TxnData.txnDataAtoms.lv, storedTxnData?.lv);

    if (!preset || preset === TxnData.Preset.AppRun) {
      jotaiStore.set(TxnData.txnDataAtoms.lx, storedTxnData?.lx || '');
    }

    if (!preset || preset === TxnData.Preset.RekeyAccount) {
      jotaiStore.set(TxnData.txnDataAtoms.rekey, storedTxnData?.rekey || '');
    }

    // Restore payment transaction data, if applicable
    if (txnType === TransactionType.pay) {
      if (!preset || preset === TxnData.Preset.TransferAlgos) {
        jotaiStore.set(TxnData.txnDataAtoms.rcv,
          (storedTxnData as TxnData.PaymentTxnData)?.rcv || ''
        );
        jotaiStore.set(TxnData.txnDataAtoms.amt, (storedTxnData as TxnData.PaymentTxnData)?.amt);
      }
      if (!preset || preset === TxnData.Preset.CloseAccount) {
        jotaiStore.set(TxnData.txnDataAtoms.close,
          (storedTxnData as TxnData.PaymentTxnData)?.close || ''
        );
      }
    }

    // Restore asset transfer transaction data, if applicable
    else if (txnType === TransactionType.axfer) {
      jotaiStore.set(TxnData.txnDataAtoms.xaid,
        (storedTxnData as TxnData.AssetTransferTxnData)?.xaid
      );

      if (preset !== TxnData.Preset.AssetOptIn && preset !== TxnData.Preset.AssetOptOut) {
        jotaiStore.set(TxnData.txnDataAtoms.arcv,
          (storedTxnData as TxnData.AssetTransferTxnData)?.arcv || ''
        );
        jotaiStore.set(TxnData.txnDataAtoms.aamt,
          (storedTxnData as TxnData.AssetTransferTxnData)?.aamt || ''
        );
      }
      if (!preset || preset === TxnData.Preset.AssetClawback) {
        jotaiStore.set(TxnData.txnDataAtoms.asnd,
          (storedTxnData as TxnData.AssetTransferTxnData)?.asnd || ''
        );
      }
      if (!preset || preset === TxnData.Preset.AssetOptOut) {
        jotaiStore.set(TxnData.txnDataAtoms.aclose,
          (storedTxnData as TxnData.AssetTransferTxnData)?.aclose || ''
        );
      }
    }

    // Restore asset configuration transaction data, if applicable
    else if (txnType === TransactionType.acfg) {
      if (preset !== TxnData.Preset.AssetCreate) {
        jotaiStore.set(TxnData.txnDataAtoms.caid,
          (storedTxnData as TxnData.AssetConfigTxnData)?.caid
        );
      }
      jotaiStore.set(TxnData.txnDataAtoms.apar_un,
        (storedTxnData as TxnData.AssetConfigTxnData)?.apar_un || ''
      );
      jotaiStore.set(TxnData.txnDataAtoms.apar_an,
        (storedTxnData as TxnData.AssetConfigTxnData)?.apar_an || ''
      );
      jotaiStore.set(TxnData.txnDataAtoms.apar_t,
        (storedTxnData as TxnData.AssetConfigTxnData)?.apar_t || ''
      );
      jotaiStore.set(TxnData.txnDataAtoms.apar_dc,
        (storedTxnData as TxnData.AssetConfigTxnData)?.apar_dc
      );
      jotaiStore.set(TxnData.txnDataAtoms.apar_df,
        !!((storedTxnData as TxnData.AssetConfigTxnData)?.apar_df)
      );
      jotaiStore.set(TxnData.txnDataAtoms.apar_au,
        (storedTxnData as TxnData.AssetConfigTxnData)?.apar_au || ''
      );
      jotaiStore.set(TxnData.txnDataAtoms.apar_m,
        (storedTxnData as TxnData.AssetConfigTxnData)?.apar_m || ''
      );
      jotaiStore.set(TxnData.txnDataAtoms.apar_f,
        (storedTxnData as TxnData.AssetConfigTxnData)?.apar_f || ''
      );
      jotaiStore.set(TxnData.txnDataAtoms.apar_c,
        (storedTxnData as TxnData.AssetConfigTxnData)?.apar_c || ''
      );
      jotaiStore.set(TxnData.txnDataAtoms.apar_r,
        (storedTxnData as TxnData.AssetConfigTxnData)?.apar_r || ''
      );
      jotaiStore.set(TxnData.txnDataAtoms.apar_am,
        (storedTxnData as TxnData.AssetConfigTxnData)?.apar_am || ''
      );
    }

    // Restore asset freeze transaction data, if applicable
    else if (txnType === TransactionType.afrz) {
      jotaiStore.set(TxnData.txnDataAtoms.faid, (
        storedTxnData as TxnData.AssetFreezeTxnData)?.faid
      );
      jotaiStore.set(TxnData.txnDataAtoms.fadd,
        (storedTxnData as TxnData.AssetFreezeTxnData)?.fadd || ''
      );

      if (preset === TxnData.Preset.AssetFreeze) {
        jotaiStore.set(TxnData.txnDataAtoms.afrz, true);
      } else if (preset === TxnData.Preset.AssetUnfreeze) {
        jotaiStore.set(TxnData.txnDataAtoms.afrz, false);
      } else {
        jotaiStore.set(TxnData.txnDataAtoms.afrz,
          (storedTxnData as TxnData.AssetFreezeTxnData)?.afrz ?? false
        );
      }
    }

    // Restore key registration transaction data, if applicable
    else if (txnType === TransactionType.keyreg) {
      if (!preset || preset === TxnData.Preset.RegOnline) {
        jotaiStore.set(TxnData.txnDataAtoms.votekey,
          (storedTxnData as TxnData.KeyRegTxnData)?.votekey || ''
        );
        jotaiStore.set(TxnData.txnDataAtoms.selkey,
          (storedTxnData as TxnData.KeyRegTxnData)?.selkey || ''
        );
        jotaiStore.set(TxnData.txnDataAtoms.sprfkey,
          (storedTxnData as TxnData.KeyRegTxnData)?.sprfkey || ''
        );
        jotaiStore.set(TxnData.txnDataAtoms.votefst,
          (storedTxnData as TxnData.KeyRegTxnData)?.votefst
        );
        jotaiStore.set(TxnData.txnDataAtoms.votelst,
          (storedTxnData as TxnData.KeyRegTxnData)?.votelst
        );
        jotaiStore.set(TxnData.txnDataAtoms.votekd,
          (storedTxnData as TxnData.KeyRegTxnData)?.votekd
        );
      }
      if (!preset) {
        jotaiStore.set(TxnData.txnDataAtoms.nonpart,
          (storedTxnData as TxnData.KeyRegTxnData)?.nonpart
        );
      }
      if (preset === TxnData.Preset.RegNonpart) {
        jotaiStore.set(TxnData.txnDataAtoms.nonpart, true);
      }
    }

    // Restore application call transaction data, if applicable
    else if (txnType === TransactionType.appl) {
      switch (preset) {
        case TxnData.Preset.AppRun:
        case TxnData.Preset.AppDeploy:
          jotaiStore.set(TxnData.txnDataAtoms.apan, OnApplicationComplete.NoOpOC);
          break;
        case TxnData.Preset.AppOptIn:
          jotaiStore.set(TxnData.txnDataAtoms.apan, OnApplicationComplete.OptInOC);
          break;
        case TxnData.Preset.AppUpdate:
          jotaiStore.set(TxnData.txnDataAtoms.apan, OnApplicationComplete.UpdateApplicationOC);
          break;
        case TxnData.Preset.AppClose:
          jotaiStore.set(TxnData.txnDataAtoms.apan, OnApplicationComplete.CloseOutOC);
          break;
        case TxnData.Preset.AppClear:
          jotaiStore.set(TxnData.txnDataAtoms.apan, OnApplicationComplete.ClearStateOC);
          break;
        case TxnData.Preset.AppDelete:
          jotaiStore.set(TxnData.txnDataAtoms.apan, OnApplicationComplete.DeleteApplicationOC);
          break;
        default:
          jotaiStore.set(TxnData.txnDataAtoms.apan,
            (storedTxnData as TxnData.AppCallTxnData)?.apan
          );
          break;
      }

      if (preset !== TxnData.Preset.AppDeploy) {
        jotaiStore.set(TxnData.txnDataAtoms.apid, (storedTxnData as TxnData.AppCallTxnData)?.apid);
      }
      if (!preset || preset === TxnData.Preset.AppDeploy || preset === TxnData.Preset.AppUpdate) {
        jotaiStore.set(TxnData.txnDataAtoms.apap,
          (storedTxnData as TxnData.AppCallTxnData)?.apap || ''
        );
        jotaiStore.set(TxnData.txnDataAtoms.apsu,
          (storedTxnData as TxnData.AppCallTxnData)?.apsu || ''
        );
      }
      if (!preset || preset === TxnData.Preset.AppDeploy) {
        jotaiStore.set(TxnData.txnDataAtoms.apgs_nui,
          (storedTxnData as TxnData.AppCallTxnData)?.apgs_nui
        );
        jotaiStore.set(TxnData.txnDataAtoms.apgs_nbs,
          (storedTxnData as TxnData.AppCallTxnData)?.apgs_nbs
        );
        jotaiStore.set(TxnData.txnDataAtoms.apls_nui,
          (storedTxnData as TxnData.AppCallTxnData)?.apls_nui
        );
        jotaiStore.set(TxnData.txnDataAtoms.apls_nbs,
          (storedTxnData as TxnData.AppCallTxnData)?.apls_nbs
        );
        jotaiStore.set(TxnData.txnDataAtoms.apep, (storedTxnData as TxnData.AppCallTxnData)?.apep);
      }

      jotaiStore.set(TxnData.txnDataAtoms.apaaListAtom,
        (storedTxnData as TxnData.AppCallTxnData)?.apaa
          ? ((storedTxnData as TxnData.AppCallTxnData)?.apaa).map(
            arg => atomWithValidate(arg, TxnData.apaaValidateOptions)
          )
          : []
      );
      jotaiStore.set(TxnData.txnDataAtoms.apatListAtom,
        (storedTxnData as TxnData.AppCallTxnData)?.apat
          ? ((storedTxnData as TxnData.AppCallTxnData)?.apat).map(
            acct => atomWithValidate(acct, TxnData.apatValidateOptions)
          )
          : []
      );
      jotaiStore.set(TxnData.txnDataAtoms.apfaListAtom,
        (storedTxnData as TxnData.AppCallTxnData)?.apfa
          ? ((storedTxnData as TxnData.AppCallTxnData)?.apfa).map(
            app => atomWithValidate(app, TxnData.apfaValidateOptions)
          )
          : []
      );
      jotaiStore.set(TxnData.txnDataAtoms.apasListAtom,
        (storedTxnData as TxnData.AppCallTxnData)?.apas
          ? ((storedTxnData as TxnData.AppCallTxnData)?.apas).map(
            asset => atomWithValidate(asset, TxnData.apasValidateOptions)
          )
          : []
      );
      jotaiStore.set(TxnData.txnDataAtoms.apbxListAtom,
        (storedTxnData as TxnData.AppCallTxnData)?.apbx
          ? ((storedTxnData as TxnData.AppCallTxnData)?.apbx).map(
            box => ({
              i: atomWithValidate(box.i, TxnData.apbxIValidateOptions),
              n: atomWithValidate(box.n, TxnData.apbxNValidateOptions)
            })
          )
          : []
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedTxnData]);

  /** Focus and scroll to the first invalid field.
   * @param invalidFields Names of the fields that are invalid
   */
  const scrollToFirstInvalidField = (invalidFields: Set<string>) => {
    // Focus and scroll to first invalid field
    if (invalidFields.size) {
      const firstInvalidField = invalidFields.values().next().value;
      const field = document.getElementById(`${firstInvalidField}-field`);
      const input = document.getElementById(`${firstInvalidField}-input`);

      // There may not be an input for the "field" if it is an array or grouping of fields
      if (input) input.focus();
      else field?.focus();

      field?.scrollIntoView({behavior: 'smooth'});
    }
  };

  /** Get all of the invalid fields within the given form.
   * @param form Collection of validation form controls to check
   * @returns List of all the invalid fields
   */
  const getInvalidFields = (form: FormControls<string, any>) => {
    return form.isValid
      ? new Set<string>()
      : new Set<string>(Object.keys(form.fieldErrors)
        .filter(field => form.fieldErrors[field]) as string[]
      );
  };

  /** Check if the form is valid and show all validation errors, if there are any.
   * @returns Whether or not the form is valid
   */
  const isFormValid = (): boolean => {
    const generalForm = jotaiStore.get(TxnData.generalFormControlAtom);
    const txnType = generalForm.values.txnType;

    // Gather all invalid general fields in the main validation rules
    const invalidGeneralFields = getInvalidFields(generalForm);
    // If "rekey address" field did not meet the conditional validation
    const rekey = jotaiStore.get(TxnData.rekeyConditionalRequireAtom);
    if (!rekey.isValidating && !rekey.isValid) invalidGeneralFields.add('rekey');
    // Add "first valid round" field as an invalid general field if the first/last valid rounds did
    // not pass the special group validation
    if (!(jotaiStore.get(TxnData.fvLvFormControlAtom)).isValid) {
      invalidGeneralFields.add('fv');
    }

    scrollToFirstInvalidField(invalidGeneralFields);

    /*
     * Continue, even if there are invalid general, so we can find and highlight more invalid fields
     */

    /** Are the other (non-general) field invalid? */
    let areOtherFieldsInvalid = false;

    // Check payment transaction data
    if (txnType === TransactionType.pay) {
      // Gather all invalid payment fields in the main validation rules
      const paymentForm = jotaiStore.get(TxnData.paymentFormControlAtom);
      const invalidPaymentFields = getInvalidFields(paymentForm);

      // Do not include fields that have a predetermined value as invalid fields
      if (preset === TxnData.Preset.RekeyAccount || preset === TxnData.Preset.CloseAccount) {
        invalidPaymentFields.delete('rcv');
        invalidPaymentFields.delete('amt');
      }
      // If "close address" field did not meet the conditional validation
      const close = jotaiStore.get(TxnData.closeConditionalRequireAtom);
      if (!close.isValidating && !close.isValid) {
        invalidPaymentFields.add('close');
      }

      if (!invalidGeneralFields.size) scrollToFirstInvalidField(invalidPaymentFields);

      areOtherFieldsInvalid = !!invalidPaymentFields.size;
    }

    // Check asset transfer transaction data
    else if (txnType === TransactionType.axfer) {
      // Gather all invalid asset transfer fields in the main validation rules
      const assetTransferForm = jotaiStore.get(TxnData.assetTransferFormControlAtom);
      const invalidAssetTransferFields = getInvalidFields(assetTransferForm);

      // Do not include fields that have a predetermined value as invalid fields
      if (preset === TxnData.Preset.AssetOptIn || preset === TxnData.Preset.AssetOptOut) {
        invalidAssetTransferFields.delete('arcv');
        invalidAssetTransferFields.delete('aamt');
      }
      // If "asset close address" field did not meet the conditional validation
      const aclose = jotaiStore.get(TxnData.acloseConditionalRequireAtom);
      if (!aclose.isValidating && !aclose.isValid) {
        invalidAssetTransferFields.add('aclose');
      }
      // If "clawback address" field did not meet the conditional validation
      const asnd = jotaiStore.get(TxnData.asndConditionalRequireAtom);
      if (!asnd.isValidating && !asnd.isValid) {
        invalidAssetTransferFields.add('asnd');
      }

      if (!invalidGeneralFields.size) scrollToFirstInvalidField(invalidAssetTransferFields);

      areOtherFieldsInvalid = !!invalidAssetTransferFields.size;
    }

    // Check asset configuration transaction data
    else if (txnType === TransactionType.acfg) {
      // Gather all invalid asset transfer fields in the main validation rules
      const assetConfigForm = jotaiStore.get(TxnData.assetConfigFormControlAtom);
      const invalidAssetConfigFields = getInvalidFields(assetConfigForm);

      // If "asset ID" field did not meet the condtional validation
      const caid = jotaiStore.get(TxnData.caidConditionalRequireAtom);
      if (!caid.isValidating && !caid.isValid) {
        invalidAssetConfigFields.add('caid');
      }
      // If "asset total" field did not meet the condtional validation
      const aparT = jotaiStore.get(TxnData.aparTConditionalRequireAtom);
      if (!aparT.isValidating && !aparT.isValid) {
        invalidAssetConfigFields.add('apar_t');
      }
      // If "asset decimals" field did not meet the condtional validation
      const aparDc = jotaiStore.get(TxnData.aparDcConditionalRequireAtom);
      if (!aparDc.isValidating && !aparDc.isValid) {
        invalidAssetConfigFields.add('apar_dc');
      }

      if (!invalidGeneralFields.size) scrollToFirstInvalidField(invalidAssetConfigFields);

      areOtherFieldsInvalid = !!invalidAssetConfigFields.size;
    }

    // Check asset freeze transaction data
    else if (txnType === TransactionType.afrz) {
      // Gather all invalid asset freeze fields in the main validation rules
      const assetFreezeForm = jotaiStore.get(TxnData.assetFreezeFormControlAtom);
      const invalidAssetFreezeFields = getInvalidFields(assetFreezeForm);

      if (!invalidGeneralFields.size) scrollToFirstInvalidField(invalidAssetFreezeFields);

      areOtherFieldsInvalid = !!invalidAssetFreezeFields.size;
    }

    // Check key registration transaction data
    else if (txnType === TransactionType.keyreg) {
      // Gather all invalid key registration fields in the main validation rules
      const keyRegForm = jotaiStore.get(TxnData.keyRegFormControlAtom);
      const invalidKeyRegFields = getInvalidFields(keyRegForm);

      // If "vote key" field did not meet the condtional validation
      const votekey = jotaiStore.get(TxnData.votekeyConditionalRequireAtom);
      if (!votekey.isValidating && !votekey.isValid) {
        invalidKeyRegFields.add('votekey');
      }
      // If "selection key" field did not meet the condtional validation
      const selkey = jotaiStore.get(TxnData.selkeyConditionalRequireAtom);
      if (!selkey.isValidating && !selkey.isValid) {
        invalidKeyRegFields.add('selkey');
      }
      // If "state proof key" field did not meet the condtional validation
      const sprfkey = jotaiStore.get(TxnData.sprfkeyConditionalRequireAtom);
      if (!sprfkey.isValidating && !sprfkey.isValid) {
        invalidKeyRegFields.add('sprfkey');
      }
      // If "first voting round" field did not meet the condtional validation
      const votefst = jotaiStore.get(TxnData.votefstConditionalRequireAtom);
      if (!votefst.isValidating && !votefst.isValid) {
        invalidKeyRegFields.add('votefst');
      }
      // If "last voting round" field did not meet the condtional validation
      const votelst = jotaiStore.get(TxnData.votelstConditionalRequireAtom);
      if (!votelst.isValidating && !votelst.isValid) {
        invalidKeyRegFields.add('votelst');
      }
      // If "key dilution" field did not meet the condtional validation
      const votekd = jotaiStore.get(TxnData.votekdConditionalRequireAtom);
      if (!votekd.isValidating && !votekd.isValid) {
        invalidKeyRegFields.add('votekd');
      }
      // Add "first valid round" field as an invalid general field if the first/last valid rounds
      // did not pass the special group validation
      const votefstVotelst = jotaiStore.get(TxnData.votefstVotelstFormControlAtom);
      if (!votefstVotelst.isValidating && !votefstVotelst.isValid) {
        invalidKeyRegFields.add('votelst');
      }

      if (!invalidGeneralFields.size) scrollToFirstInvalidField(invalidKeyRegFields);

      areOtherFieldsInvalid = !!invalidKeyRegFields.size;
    }

    // Check application call transaction data
    else if (txnType === TransactionType.appl) {
      // Gather all invalid application call fields in the main validation rules
      const applForm = jotaiStore.get(TxnData.applFormControlAtom);
      const invalidApplFields = getInvalidFields(applForm);
      // If "application ID" field did not meet the condtional validation
      const apid = jotaiStore.get(TxnData.apidConditionalRequireAtom);
      if (!apid.isValidating && !apid.isValid) {
        invalidApplFields.add('apid');
      }

      const apaaList = jotaiStore.get(TxnData.txnDataAtoms.apaaListAtom);
      // If there are too many "application argument" fields
      if (apaaList.length > TxnData.MAX_APP_ARGS) {
        invalidApplFields.add('apaa');
      }
      apaaList.forEach((apaaAtom, i) => {
        const apaa = jotaiStore.get(apaaAtom);
        // If this "application argument" field did not meet the condtional validation
        if (!apaa.isValid) invalidApplFields.add(`apaa-${i}`);
      });

      // If "approval program" field did not meet the condtional validation
      const apap = jotaiStore.get(TxnData.apapConditionalRequireAtom);
      if (!apap.isValidating && !apap.isValid) {
        invalidApplFields.add('apap');
      }
      // If "clear program" field did not meet the condtional validation
      const apsu = jotaiStore.get(TxnData.apsuConditionalRequireAtom);
      if (!apsu.isValidating && !apsu.isValid) {
        invalidApplFields.add('apsu');
      }
      // If "global integers" field did not meet the condtional validation
      const apgsNui = jotaiStore.get(TxnData.apgsNuiConditionalRequireAtom);
      if (!apgsNui.isValidating && !apgsNui.isValid) {
        invalidApplFields.add('apgs_nui');
      }
      // If "global byte slices" field did not meet the condtional validation
      const apgsNbs = jotaiStore.get(TxnData.apgsNbsConditionalRequireAtom);
      if (!apgsNbs.isValidating && !apgsNbs.isValid) {
        invalidApplFields.add('apgs_nbs');
      }
      // If "global integers" and "global byte slices" fields together did not meet the condtional
      // "max globals" validation
      const maxGlobalsCheck = jotaiStore.get(TxnData.maxAppGlobalsCheckAtom);
      if (!maxGlobalsCheck.isValidating && !maxGlobalsCheck.isValid) {
        invalidApplFields.add('apgs_nui');
        invalidApplFields.add('apgs_nbs');
      }
      // If "local integers" field did not meet the condtional validation
      const aplsNui = jotaiStore.get(TxnData.aplsNuiConditionalRequireAtom);
      if (!aplsNui.isValidating && !aplsNui.isValid) {
        invalidApplFields.add('apls_nui');
      }
      // If "local byte slices" field did not meet the condtional validation
      const aplsNbs = jotaiStore.get(TxnData.aplsNbsConditionalRequireAtom);
      if (!aplsNbs.isValidating && !aplsNbs.isValid) {
        invalidApplFields.add('apls_nbs');
      }
      // If "local integers" and "local byte slices" fields together did not meet the condtional
      // "max locals" validation
      const maxLocalsCheck = jotaiStore.get(TxnData.maxAppLocalsCheckAtom);
      if (!maxLocalsCheck.isValidating && !maxLocalsCheck.isValid) {
        invalidApplFields.add('apls_nui');
        invalidApplFields.add('apls_nbs');
      }
      // If "extra pages" field did not meet the condtional validation
      const apep = jotaiStore.get(TxnData.apepConditionalRequireAtom);
      if (!apep.isValidating && !apep.isValid) {
        invalidApplFields.add('apep');
      }

      const apatList = jotaiStore.get(TxnData.txnDataAtoms.apatListAtom);
      const apfaList = jotaiStore.get(TxnData.txnDataAtoms.apfaListAtom);
      const apasList = jotaiStore.get(TxnData.txnDataAtoms.apasListAtom);
      const apbxList = jotaiStore.get(TxnData.txnDataAtoms.apbxListAtom);

      // If there are too many application dependencies
      if ((apatList.length + apfaList.length + apasList.length + apbxList.length)
        > TxnData.MAX_APP_TOTAL_DEPS
      ) {
        invalidApplFields.add('apdeps');
      }

      // If there are too many "application account reference" fields
      if (apatList.length > TxnData.MAX_APP_ACCTS) invalidApplFields.add('apat');

      apatList.forEach((apatAtom, i) => {
        const apat = jotaiStore.get(apatAtom);
        // If this "application account reference" field is invalid
        if (!apat.isValid) invalidApplFields.add(`apat-${i}`);
      });
      apfaList.forEach((apfaAtom, i) => {
        const apfa = jotaiStore.get(apfaAtom);
        // If this "application foreign app" field is invalid
        if (!apfa.isValid) invalidApplFields.add(`apfa-${i}`);
      });
      apasList.forEach((apasAtom, i) => {
        const apas = jotaiStore.get(apasAtom);
        // If this "application asset reference" field is invalid
        if (!apas.isValid) invalidApplFields.add(`apas-${i}`);
      });
      apbxList.forEach((apbxAtom, i) => {
        const apbxI = jotaiStore.get(apbxAtom.i);
        const apbxN = jotaiStore.get(apbxAtom.n);
        // If this "application box ID" field is invalid
        if (!apbxI.isValid) invalidApplFields.add(`apbx_i-${i}`);
        // If this "application box name" field is invalid
        if (!apbxN.isValid) invalidApplFields.add(`apbx_n-${i}`);
      });

      if (!invalidGeneralFields.size) scrollToFirstInvalidField(invalidApplFields);

      areOtherFieldsInvalid = !!invalidApplFields.size;
    }

    return !invalidGeneralFields.size && !areOtherFieldsInvalid;
  };

  /** "Submit" the form by processing the form data and saving the data into local storage if there
   * are no form validation errors.
   */
  const submitData = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Check if the form is valid only if the "ignore form error" setting is off
    if (!ignoreFormErrors && !isFormValid()) {
      jotaiStore.set(TxnData.showFormErrorsAtom, true);
      return;
    }

    const generalForm = jotaiStore.get(TxnData.generalFormControlAtom);
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
      const paymentForm = jotaiStore.get(TxnData.paymentFormControlAtom);

      specificTxnData = {
        rcv: paymentForm.values.rcv,
        amt: paymentForm.values.amt,
        close: paymentForm.values.close || undefined,
      };

      if (preset === TxnData.Preset.TransferAlgos) {
        specificTxnData.close = undefined;
        baseTxnData.rekey = undefined;
      }
      else if (preset === TxnData.Preset.RekeyAccount) {
        specificTxnData.rcv = baseTxnData.snd;
        specificTxnData.amt = 0;
      }
      else if (preset === TxnData.Preset.CloseAccount) {
        specificTxnData.rcv = specificTxnData.close;
        specificTxnData.amt = 0;
        baseTxnData.rekey = undefined;
      }
    }

    // Gather asset transfer transaction data
    else if (txnType === TransactionType.axfer) {
      const assetTransferForm = jotaiStore.get(TxnData.assetTransferFormControlAtom);

      specificTxnData = {
        arcv: assetTransferForm.values.arcv,
        xaid: assetTransferForm.values.xaid,
        aamt: assetTransferForm.values.aamt,
        asnd: assetTransferForm.values.asnd || undefined,
        aclose: assetTransferForm.values.aclose || undefined,
      };

      if (preset === TxnData.Preset.AssetOptIn) {
        specificTxnData.arcv = baseTxnData.snd;
        specificTxnData.aamt = 0;
      }
      else if (preset === TxnData.Preset.AssetOptOut) {
        specificTxnData.arcv = specificTxnData.aclose;
        specificTxnData.aamt = 0;
      }
    }

    // Gather asset configuration transaction data
    else if (txnType === TransactionType.acfg) {
      const assetConfigForm = jotaiStore.get(TxnData.assetConfigFormControlAtom);

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

      if (preset === TxnData.Preset.AssetDestroy) {
        specificTxnData.apar_m = undefined;
        specificTxnData.apar_f = undefined;
        specificTxnData.apar_c = undefined;
        specificTxnData.apar_r = undefined;
      }
    }

    // Gather asset freeze transaction data
    else if (txnType === TransactionType.afrz) {
      const assetFreezeForm = jotaiStore.get(TxnData.assetFreezeFormControlAtom);

      specificTxnData = {
        faid: assetFreezeForm.values.faid,
        fadd: assetFreezeForm.values.fadd,
        afrz: assetFreezeForm.values.afrz,
      };
    }

    // Gather key registration transaction data
    else if (txnType === TransactionType.keyreg) {
      const keyRegForm = jotaiStore.get(TxnData.keyRegFormControlAtom);

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
      const applForm = jotaiStore.get(TxnData.applFormControlAtom);

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
        apaa: jotaiStore.get(TxnData.txnDataAtoms.apaaListAtom).map(
          (apaaAtom) => jotaiStore.get(apaaAtom).value ?? ''
        ),
        apat: jotaiStore.get(TxnData.txnDataAtoms.apatListAtom).map(
          (apatAtom) => jotaiStore.get(apatAtom).value ?? ''
        ),
        apfa: jotaiStore.get(TxnData.txnDataAtoms.apfaListAtom).map(
          (apfaAtom) => jotaiStore.get(apfaAtom).value ?? ''
        ),
        apas: jotaiStore.get(TxnData.txnDataAtoms.apasListAtom).map(
          (apasAtom) => jotaiStore.get(apasAtom).value ?? ''
        ),
        apbx: jotaiStore.get(TxnData.txnDataAtoms.apbxListAtom).map((apbxAtom) => ({
          i: jotaiStore.get(apbxAtom.i).value ?? '',
          n: jotaiStore.get(apbxAtom.n).value ?? '',
        })),
      };
    }

    // Going to "submit" the form data
    setSubmittingForm(true);
    // "Submit" transaction data by storing it into local/session storage
    jotaiStore.set(TxnData.storedTxnDataAtom, { ...baseTxnData, ...specificTxnData });
    // Go to sign-transaction page
    router.push(`/${lng}/txn/sign` + (currentURLParams.size ? `?${currentURLParams}` : ''));
  };

  return (<>
    <button type='submit' className='btn btn-primary w-full' onClick={submitData}>
      {t('sign_txn_btn')}
      <IconArrowRight aria-hidden className='rtl:hidden' />
      <IconArrowLeft aria-hidden className='hidden rtl:inline' />
    </button>
  </>);
}
