/** @file Collection of functions for validating the whole form */

import { type useStore } from "jotai";
import { TransactionType } from "algosdkv3";
import {
  apaaListAtom,
  apasListAtom,
  apatListAtom,
  apbxListAtom,
  apfaListAtom,
  b64ApaaCondList
} from "./atoms";
import { Preset, MAX_APP_ACCTS, MAX_APP_ARGS, MAX_APP_TOTAL_DEPS } from "./constants";
import * as FieldValidation from "./field-validation";

/** Check if the form is valid and show all validation errors, if there are any.
 * @param preset The current preset being used
 * @param jotaiStore The Jotai Store for the atoms that contains the transaction data
 * @returns Whether or not the form is valid
 */
export function isFormValid(
  preset: string|null,
  jotaiStore: ReturnType<typeof useStore>
): boolean {
  const generalForm = jotaiStore.get(FieldValidation.generalFormControlAtom);
  const txnType = generalForm.values.txnType;

  // Gather all invalid general fields in the main validation rules
  const invalidGeneralFields = getInvalidFields(generalForm);

  // If "fee" field did not meet the conditional validation
  const fee = jotaiStore.get(FieldValidation.feeConditionalRequireAtom);
  if (!fee.isValidating && !fee.isValid) invalidGeneralFields.add('fee');

  // If "note" field did not meet the conditional validation
  const noteMax = jotaiStore.get(FieldValidation.noteConditionalMaxAtom);
  if (!noteMax.isValidating && !noteMax.isValid) invalidGeneralFields.add('note');
  const noteB64 = jotaiStore.get(FieldValidation.noteConditionalBase64Atom);
  if (!noteB64.isValidating && !noteB64.isValid) invalidGeneralFields.add('note');

  // If "first valid round" field did not meet the conditional validation
  const fv = jotaiStore.get(FieldValidation.fvConditionalRequireAtom);
  if (!fv.isValidating && !fv.isValid) invalidGeneralFields.add('fv');

  // If "last valid round" field did not meet the conditional validation
  const lv = jotaiStore.get(FieldValidation.lvConditionalRequireAtom);
  if (!lv.isValidating && !lv.isValid) invalidGeneralFields.add('lv');

  // Add "first valid round" field as an invalid general field if the first/last valid rounds did
  // not pass the special group validation
  const fvLvComparison = jotaiStore.get(FieldValidation.fvLvFormControlAtom);
  if (!fvLvComparison.isValidating && !fvLvComparison.isValid) invalidGeneralFields.add('fv');

  // If "lease" field did not meet the conditional validation
  const lxLength = jotaiStore.get(FieldValidation.lxConditionalLengthAtom);
  if (!lxLength.isValidating && !lxLength.isValid) invalidGeneralFields.add('lx');
  const lxB64 = jotaiStore.get(FieldValidation.lxConditionalBase64Atom);
  if (!lxB64.isValidating && !lxB64.isValid) invalidGeneralFields.add('lx');

  // If "rekey address" field did not meet the conditional validation
  const rekey = jotaiStore.get(FieldValidation.rekeyConditionalRequireAtom);
  if (!rekey.isValidating && !rekey.isValid) invalidGeneralFields.add('rekey');

  scrollToFirstInvalidField(invalidGeneralFields);

  /*
   * Continue, even if there are invalid general, so we can find and highlight more invalid fields
   */

  /** Are the other (non-general) field invalid? */
  let areOtherFieldsInvalid = false;

  // Check payment transaction data
  if (txnType === TransactionType.pay) {
    // Gather all invalid payment fields in the main validation rules
    const paymentForm = jotaiStore.get(FieldValidation.paymentFormControlAtom);
    const invalidPaymentFields = getInvalidFields(paymentForm);

    // Do not include fields that have a predetermined value as invalid fields
    if (preset === Preset.RekeyAccount || preset === Preset.CloseAccount) {
      invalidPaymentFields.delete('rcv');
      invalidPaymentFields.delete('amt');
    }
    // If "close address" field did not meet the conditional validation
    const close = jotaiStore.get(FieldValidation.closeConditionalRequireAtom);
    if (!close.isValidating && !close.isValid) invalidPaymentFields.add('close');

    if (!invalidGeneralFields.size) scrollToFirstInvalidField(invalidPaymentFields);

    areOtherFieldsInvalid = !!invalidPaymentFields.size;
  }

  // Check asset transfer transaction data
  else if (txnType === TransactionType.axfer) {
    // Gather all invalid asset transfer fields in the main validation rules
    const assetTransferForm = jotaiStore.get(FieldValidation.assetTransferFormControlAtom);
    const invalidAssetTransferFields = getInvalidFields(assetTransferForm);

    // Do not include fields that have a predetermined value as invalid fields
    if (preset === Preset.AssetOptIn || preset === Preset.AssetOptOut) {
      invalidAssetTransferFields.delete('arcv');
      invalidAssetTransferFields.delete('aamt');
    }
    // If "asset close address" field did not meet the conditional validation
    const aclose = jotaiStore.get(FieldValidation.acloseConditionalRequireAtom);
    if (!aclose.isValidating && !aclose.isValid) invalidAssetTransferFields.add('aclose');

    // If "clawback address" field did not meet the conditional validation
    const asnd = jotaiStore.get(FieldValidation.asndConditionalRequireAtom);
    if (!asnd.isValidating && !asnd.isValid) invalidAssetTransferFields.add('asnd');

    if (!invalidGeneralFields.size) scrollToFirstInvalidField(invalidAssetTransferFields);

    areOtherFieldsInvalid = !!invalidAssetTransferFields.size;
  }

  // Check asset configuration transaction data
  else if (txnType === TransactionType.acfg) {
    // Gather all invalid asset transfer fields in the main validation rules
    const assetConfigForm = jotaiStore.get(FieldValidation.assetConfigFormControlAtom);
    const invalidAssetConfigFields = getInvalidFields(assetConfigForm);

    // If "asset ID" field did not meet the conditional validation
    const caid = jotaiStore.get(FieldValidation.caidConditionalRequireAtom);
    if (!caid.isValidating && !caid.isValid) invalidAssetConfigFields.add('caid');

    // If "asset total" field did not meet the conditional validation
    const aparT = jotaiStore.get(FieldValidation.aparTConditionalRequireAtom);
    if (!aparT.isValidating && !aparT.isValid) invalidAssetConfigFields.add('apar_t');

    // If "asset decimals" field did not meet the conditional validation
    const aparDc = jotaiStore.get(FieldValidation.aparDcConditionalRequireAtom);
    if (!aparDc.isValidating && !aparDc.isValid) invalidAssetConfigFields.add('apar_dc');

    // If "metadata hash" field did not meet the conditional validation
    const aparAmLength = jotaiStore.get(FieldValidation.aparAmConditionalLengthAtom);
    if (!aparAmLength.isValidating && !aparAmLength.isValid) {
      invalidAssetConfigFields.add('apar_am');
    };
    const aparAmB64 = jotaiStore.get(FieldValidation.aparAmConditionalBase64Atom);
    if (!aparAmB64.isValidating && !aparAmB64.isValid) invalidAssetConfigFields.add('apar_am');

    if (!invalidGeneralFields.size) scrollToFirstInvalidField(invalidAssetConfigFields);

    areOtherFieldsInvalid = !!invalidAssetConfigFields.size;
  }

  // Check asset freeze transaction data
  else if (txnType === TransactionType.afrz) {
    // Gather all invalid asset freeze fields in the main validation rules
    const assetFreezeForm = jotaiStore.get(FieldValidation.assetFreezeFormControlAtom);
    const invalidAssetFreezeFields = getInvalidFields(assetFreezeForm);

    if (!invalidGeneralFields.size) scrollToFirstInvalidField(invalidAssetFreezeFields);

    areOtherFieldsInvalid = !!invalidAssetFreezeFields.size;
  }

  // Check key registration transaction data
  else if (txnType === TransactionType.keyreg) {
    // Gather all invalid key registration fields in the main validation rules
    const keyRegForm = jotaiStore.get(FieldValidation.keyRegFormControlAtom);
    const invalidKeyRegFields = getInvalidFields(keyRegForm);

    // If "vote key" field did not meet the condtional validation
    const votekey = jotaiStore.get(FieldValidation.votekeyConditionalRequireAtom);
    if (!votekey.isValidating && !votekey.isValid) invalidKeyRegFields.add('votekey');

    // If "selection key" field did not meet the condtional validation
    const selkey = jotaiStore.get(FieldValidation.selkeyConditionalRequireAtom);
    if (!selkey.isValidating && !selkey.isValid) invalidKeyRegFields.add('selkey');

    // If "state proof key" field did not meet the condtional validation
    const sprfkey = jotaiStore.get(FieldValidation.sprfkeyConditionalRequireAtom);
    if (!sprfkey.isValidating && !sprfkey.isValid) invalidKeyRegFields.add('sprfkey');

    // If "first voting round" field did not meet the condtional validation
    const votefst = jotaiStore.get(FieldValidation.votefstConditionalRequireAtom);
    if (!votefst.isValidating && !votefst.isValid) invalidKeyRegFields.add('votefst');

    // If "last voting round" field did not meet the condtional validation
    const votelst = jotaiStore.get(FieldValidation.votelstConditionalRequireAtom);
    if (!votelst.isValidating && !votelst.isValid) invalidKeyRegFields.add('votelst');

    // If "key dilution" field did not meet the condtional validation
    const votekd = jotaiStore.get(FieldValidation.votekdConditionalRequireAtom);
    if (!votekd.isValidating && !votekd.isValid) invalidKeyRegFields.add('votekd');

    // Add "first valid round" field as an invalid general field if the first/last valid rounds
    // did not pass the special group validation
    const votefstVotelst = jotaiStore.get(FieldValidation.votefstVotelstFormControlAtom);
    if (!votefstVotelst.isValidating && !votefstVotelst.isValid) invalidKeyRegFields.add('votelst');

    if (!invalidGeneralFields.size) scrollToFirstInvalidField(invalidKeyRegFields);

    areOtherFieldsInvalid = !!invalidKeyRegFields.size;
  }

  // Check application call transaction data
  else if (txnType === TransactionType.appl) {
    // Gather all invalid application call fields in the main validation rules
    const applForm = jotaiStore.get(FieldValidation.applFormControlAtom);
    const invalidApplFields = getInvalidFields(applForm);

    // If "application ID" field did not meet the condtional validation
    const apid = jotaiStore.get(FieldValidation.apidConditionalRequireAtom);
    if (!apid.isValidating && !apid.isValid) invalidApplFields.add('apid');


    const apaaList = jotaiStore.get(apaaListAtom);
    // If there are too many "application argument" fields
    if (apaaList.length > MAX_APP_ARGS) invalidApplFields.add('apaa');

    apaaList.forEach((apaaAtom, i) => {
      const apaa = jotaiStore.get(apaaAtom);
      const b64ApaaCond = jotaiStore.get(b64ApaaCondList[i]);
      // If this "application argument" field did not meet the condtional validation
      if (!apaa.isValid || (!b64ApaaCond.isValidating && !b64ApaaCond.isValid)){
        invalidApplFields.add(`apaa-${i}`);
      }
    });

    // If "approval program" field did not meet the condtional validation
    const apap = jotaiStore.get(FieldValidation.apapConditionalRequireAtom);
    if (!apap.isValidating && !apap.isValid) invalidApplFields.add('apap');

    // If "clear program" field did not meet the condtional validation
    const apsu = jotaiStore.get(FieldValidation.apsuConditionalRequireAtom);
    if (!apsu.isValidating && !apsu.isValid) invalidApplFields.add('apsu');

    // If "global integers" field did not meet the condtional validation
    const apgsNui = jotaiStore.get(FieldValidation.apgsNuiConditionalRequireAtom);
    if (!apgsNui.isValidating && !apgsNui.isValid) invalidApplFields.add('apgs_nui');

    // If "global byte slices" field did not meet the condtional validation
    const apgsNbs = jotaiStore.get(FieldValidation.apgsNbsConditionalRequireAtom);
    if (!apgsNbs.isValidating && !apgsNbs.isValid) invalidApplFields.add('apgs_nbs');

    // If "global integers" and "global byte slices" fields together did not meet the condtional
    // "max globals" validation
    const maxGlobalsCheck = jotaiStore.get(FieldValidation.maxAppGlobalsCheckAtom);
    if (!maxGlobalsCheck.isValidating && !maxGlobalsCheck.isValid) {
      invalidApplFields.add('apgs_nui');
      invalidApplFields.add('apgs_nbs');
    }
    // If "local integers" field did not meet the condtional validation
    const aplsNui = jotaiStore.get(FieldValidation.aplsNuiConditionalRequireAtom);
    if (!aplsNui.isValidating && !aplsNui.isValid) invalidApplFields.add('apls_nui');

    // If "local byte slices" field did not meet the condtional validation
    const aplsNbs = jotaiStore.get(FieldValidation.aplsNbsConditionalRequireAtom);
    if (!aplsNbs.isValidating && !aplsNbs.isValid) invalidApplFields.add('apls_nbs');

    // If "local integers" and "local byte slices" fields together did not meet the condtional
    // "max locals" validation
    const maxLocalsCheck = jotaiStore.get(FieldValidation.maxAppLocalsCheckAtom);
    if (!maxLocalsCheck.isValidating && !maxLocalsCheck.isValid) {
      invalidApplFields.add('apls_nui');
      invalidApplFields.add('apls_nbs');
    }
    // If "extra pages" field did not meet the condtional validation
    const apep = jotaiStore.get(FieldValidation.apepConditionalRequireAtom);
    if (!apep.isValidating && !apep.isValid) invalidApplFields.add('apep');

    const apatList = jotaiStore.get(apatListAtom);
    const apfaList = jotaiStore.get(apfaListAtom);
    const apasList = jotaiStore.get(apasListAtom);
    const apbxList = jotaiStore.get(apbxListAtom);

    // If there are too many application dependencies
    if ((apatList.length + apfaList.length + apasList.length + apbxList.length)
      > MAX_APP_TOTAL_DEPS
    ) {
      invalidApplFields.add('apdeps');
    }

    // If there are too many "application account reference" fields
    if (apatList.length > MAX_APP_ACCTS) invalidApplFields.add('apat');

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
      // If this "application box index" field is invalid (fails validation or the value is
      // greater than the number of foreign apps, which is an invalid box index)
      if (!apbxI.isValid || (apbxI.value ?? 0) > apaaList.length) {
        invalidApplFields.add(`apbx_i-${i}`);
      }
      // If this "application box name" field is invalid
      if (!apbxN.isValid) invalidApplFields.add(`apbx_n-${i}`);
    });

    if (!invalidGeneralFields.size) scrollToFirstInvalidField(invalidApplFields);

    areOtherFieldsInvalid = !!invalidApplFields.size;
  }

  return !invalidGeneralFields.size && !areOtherFieldsInvalid;
};

/** Focus and scroll to the first invalid field.
 * @param invalidFields Names of the fields that are invalid
 */
function scrollToFirstInvalidField(invalidFields: Set<string>) {
  // Focus and scroll to first invalid field
  if (invalidFields.size) {
    const firstInvalidField = invalidFields.values().next().value;
    // The classes assigned to the field container and the input is based on atom name for the field
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
function getInvalidFields(form: any) {
  return form.isValid
    ? new Set<string>()
    : new Set<string>(Object.keys(form.fieldErrors)
      .filter(field => form.fieldErrors[field]) as string[]
    );
};
