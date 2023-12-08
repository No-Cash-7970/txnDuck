/** @file Collection of variables, atoms, etc. for validating individual fields */

import { OnApplicationComplete } from 'algosdk';
import { atom } from 'jotai';
import { atomWithFormControls, atomWithValidate, validateAtoms } from 'jotai-form';
import * as txnDataAtoms from './atoms';
import { ValidationMessage } from './types';
import { Preset, MAX_APP_GLOBALS, MAX_APP_KEY_LENGTH, MAX_APP_LOCALS } from './constants';
import { YupMixed, YupNumber, YupString, addressSchema, idSchema } from './validation-rules';

/** Atom containing flag for triggering the form errors to be shown */
export const showFormErrorsAtom = atom(false);

/** Validation atom that should contain the name of the current transaction preset, which is usually
 * determined by a URL query parameter. Used to pass in the current preset in to a form group to use
 * when validating fields.
 */
export const presetAtom = atomWithValidate<string|null>(null, {validate: v => v});

/** Application argument validation options */
export const apaaValidateOptions = { validate: (v: string) => v };
/** Application address reference validation options */
export const apatValidateOptions = {
  validate: (v: string) => {
    addressSchema.required().validateSync(v === '' ? undefined : v);
    return v;
  }
};
/** Application account reference validation options */
export const apfaValidateOptions = {
  validate: (v: number|null) => { idSchema.required().validateSync(v); return v; }
};
/** Application asset reference validation options */
export const apasValidateOptions = {
  validate: (v: number|null) => { idSchema.required().validateSync(v); return v; }
};
/** Application box index validation options */
export const apbxIValidateOptions = {
  validate: (v: number|null) => { YupNumber().min(0).required().validateSync(v); return v; }
};
/** Application box name validation options */
export const apbxNValidateOptions = {
  validate: (v: string) => {
    YupString().max(MAX_APP_KEY_LENGTH).validateSync(v);
    return v;
  }
};

/*
 * General validation form groups
 */
export const generalFormControlAtom = atomWithFormControls({
  txnType: txnDataAtoms.txnType,
  snd: txnDataAtoms.snd,
  fee: txnDataAtoms.fee,
  note: txnDataAtoms.note,
  fv: txnDataAtoms.fv,
  lv: txnDataAtoms.lv,
  lx: txnDataAtoms.lx,
  rekey: txnDataAtoms.rekey,
});
export const rekeyConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  rekey: txnDataAtoms.rekey,
}, (values) => {
  if (values.preset === Preset.RekeyAccount) {
    YupString().required().validateSync(values.rekey);
  }
});
export const fvLvFormControlAtom = validateAtoms({
  fv: txnDataAtoms.fv,
  lv: txnDataAtoms.lv,
}, (values) => {
    if (values.lv !== undefined) { // If a last round has been entered yet
      // First valid round must be less than the last valid round
      YupNumber()
        .max((values.lv as number),
          ({max}): ValidationMessage => ({key: 'fields.fv.max_error', dict: {max}})
        )
        .validateSync(values.fv);
    }
});

/*
 * Payment validation form groups
 */
export const paymentFormControlAtom = atomWithFormControls({
  rcv: txnDataAtoms.rcv,
  amt: txnDataAtoms.amt,
  close: txnDataAtoms.close,
});
export const closeConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  close: txnDataAtoms.close,
}, (values) => {
  if (values.preset === Preset.CloseAccount) {
    YupString().required().validateSync(values.close);
  }
});

/*
 * Asset transfer validation form groups
 */
export const assetTransferFormControlAtom = atomWithFormControls({
  xaid: txnDataAtoms.xaid,
  asnd: txnDataAtoms.asnd,
  arcv: txnDataAtoms.arcv,
  aamt: txnDataAtoms.aamt,
  aclose: txnDataAtoms.aclose,
});
export const asndConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  asnd: txnDataAtoms.asnd,
}, (values) => {
  if (values.preset === Preset.AssetClawback) {
    YupString().required().validateSync(values.asnd);
  }
});
export const acloseConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  aclose: txnDataAtoms.aclose,
}, (values) => {
  if (values.preset === Preset.AssetOptOut) {
    YupString().required().validateSync(values.aclose);
  }
});

/*
 * Asset configuration validation form groups
 */
export const assetConfigFormControlAtom = atomWithFormControls({
  caid: txnDataAtoms.caid,
  apar_un: txnDataAtoms.apar_un,
  apar_an: txnDataAtoms.apar_an,
  apar_t: txnDataAtoms.apar_t,
  apar_dc: txnDataAtoms.apar_dc,
  apar_df: txnDataAtoms.apar_df,
  apar_au: txnDataAtoms.apar_au,
  apar_m: txnDataAtoms.apar_m,
  apar_f: txnDataAtoms.apar_f,
  apar_c: txnDataAtoms.apar_c,
  apar_r: txnDataAtoms.apar_r,
  apar_am: txnDataAtoms.apar_am,
});
export const caidConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  caid: txnDataAtoms.caid,
}, (values) => {
  if (values.preset === Preset.AssetReconfig || values.preset === Preset.AssetDestroy) {
    YupNumber().required().validateSync(values.caid);
  }
});
export const aparTConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  caid: txnDataAtoms.caid,
  apar_t: txnDataAtoms.apar_t,
}, (values) => {
  if (values.preset === Preset.AssetCreate || !values.caid) {
    YupMixed().required().validateSync(values.apar_t === '' ? undefined : values.apar_t);
  }
});
export const aparDcConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  caid: txnDataAtoms.caid,
  apar_dc: txnDataAtoms.apar_dc,
}, (values) => {
  if (values.preset === Preset.AssetCreate || !values.caid) {
    YupNumber().required().validateSync(values.apar_dc);
  }
});

/*
 * Asset freeze validation form group
 */
export const assetFreezeFormControlAtom = atomWithFormControls({
  faid: txnDataAtoms.faid,
  fadd: txnDataAtoms.fadd,
  afrz: txnDataAtoms.afrz,
});

/*
 * Application validation form groups
 */
export const applFormControlAtom = atomWithFormControls({
  apid: txnDataAtoms.apid,
  apan: txnDataAtoms.apan,
  apap: txnDataAtoms.apap,
  apsu: txnDataAtoms.apsu,
  apgs_nui: txnDataAtoms.apgs_nui,
  apgs_nbs: txnDataAtoms.apgs_nbs,
  apls_nui: txnDataAtoms.apls_nui,
  apls_nbs: txnDataAtoms.apls_nbs,
  apep: txnDataAtoms.apep,
});
export const apidConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  apan: txnDataAtoms.apan,
  apid: txnDataAtoms.apid,
}, (values) => {
  if (values.apan !== OnApplicationComplete.NoOpOC
    || (values.preset && values.preset !== Preset.AppDeploy)
  ) {
    YupNumber().required().validateSync(values.apid);
  }
});
export const apapConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  apid: txnDataAtoms.apid,
  apan: txnDataAtoms.apan,
  apap: txnDataAtoms.apap,
}, (values) => {
  if (// Creating application
    ((!values.preset && values.apan === OnApplicationComplete.NoOpOC && !values.apid)
      || values.preset === Preset.AppDeploy)
    // Updating application
    || values.apan === OnApplicationComplete.UpdateApplicationOC
  ) {
    YupString().trim().required().validateSync(values.apap);
  }
});
export const apsuConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  apid: txnDataAtoms.apid,
  apan: txnDataAtoms.apan,
  apsu: txnDataAtoms.apsu,
}, (values) => {
  if (// Creating application
    ((!values.preset && values.apan === OnApplicationComplete.NoOpOC && !values.apid)
      || values.preset === Preset.AppDeploy)
    // Updating application
    || values.apan === OnApplicationComplete.UpdateApplicationOC
  ) {
    YupString().trim().required().validateSync(values.apsu);
  }
});
export const apgsNuiConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  apid: txnDataAtoms.apid,
  apan: txnDataAtoms.apan,
  apgs_nui: txnDataAtoms.apgs_nui,
}, (values) => {
  if (// Creating application
    ((!values.preset && values.apan === OnApplicationComplete.NoOpOC && !values.apid)
      || values.preset === Preset.AppDeploy)
  ) {
    YupNumber().required().validateSync(values.apgs_nui);
  }
});
export const apgsNbsConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  apid: txnDataAtoms.apid,
  apan: txnDataAtoms.apan,
  apgs_nbs: txnDataAtoms.apgs_nbs,
}, (values) => {
  if (// Creating application
    ((!values.preset && values.apan === OnApplicationComplete.NoOpOC && !values.apid)
      || values.preset === Preset.AppDeploy)
  ) {
    YupNumber().required().validateSync(values.apgs_nbs);
  }
});
export const maxAppGlobalsCheckAtom = validateAtoms({
  apgs_nui: txnDataAtoms.apgs_nui,
  apgs_nbs: txnDataAtoms.apgs_nbs,
}, (values) => {
  if (values.apgs_nui !== undefined && values.apgs_nbs !== undefined) {
    // The total number of globals must not exceed the max
    YupNumber()
      .max(MAX_APP_GLOBALS,
        ({max}): ValidationMessage => ({key: 'fields.app_global_state.max_error', dict: {max}})
      )
      .validateSync(values.apgs_nui + values.apgs_nbs);
  }
});
export const aplsNuiConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  apid: txnDataAtoms.apid,
  apan: txnDataAtoms.apan,
  apls_nui: txnDataAtoms.apls_nui,
}, (values) => {
  if (// Creating application
    ((!values.preset && values.apan === OnApplicationComplete.NoOpOC && !values.apid)
      || values.preset === Preset.AppDeploy)
  ) {
    YupNumber().required().validateSync(values.apls_nui);
  }
});
export const aplsNbsConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  apid: txnDataAtoms.apid,
  apan: txnDataAtoms.apan,
  apls_nbs: txnDataAtoms.apls_nbs,
}, (values) => {
  if (// Creating application
    ((!values.preset && values.apan === OnApplicationComplete.NoOpOC && !values.apid)
      || values.preset === Preset.AppDeploy)
  ) {
    YupNumber().required().validateSync(values.apls_nbs);
  }
});
export const maxAppLocalsCheckAtom = validateAtoms({
  apls_nui: txnDataAtoms.apls_nui,
  apls_nbs: txnDataAtoms.apls_nbs,
}, (values) => {
  if (values.apls_nui !== undefined && values.apls_nbs !== undefined) {
    // The total number of locals must not exceed the max
    YupNumber()
      .max(MAX_APP_LOCALS,
        ({max}): ValidationMessage => ({key: 'fields.app_local_state.max_error', dict: {max}})
      )
      .validateSync(values.apls_nui + values.apls_nbs);
  }
});
export const apepConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  apid: txnDataAtoms.apid,
  apan: txnDataAtoms.apan,
  apep: txnDataAtoms.apep,
}, (values) => {
  if (// Creating application
    ((!values.preset && values.apan === OnApplicationComplete.NoOpOC && !values.apid)
      || values.preset === Preset.AppDeploy)
  ) {
    YupNumber().required().validateSync(values.apep);
  }
});

/*
 * Key registration validation form groups
 */
export const keyRegFormControlAtom = atomWithFormControls({
  votekey: txnDataAtoms.votekey,
  selkey: txnDataAtoms.selkey,
  sprfkey: txnDataAtoms.sprfkey,
  votefst: txnDataAtoms.votefst,
  votelst: txnDataAtoms.votelst,
  votekd: txnDataAtoms.votekd,
  nonpart: txnDataAtoms.nonpart,
});
export const votekeyConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  votekey: txnDataAtoms.votekey,
}, (values) => {
  if (values.preset === Preset.RegOnline) {
    YupString().trim().required().validateSync(values.votekey);
  }
});
export const selkeyConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  selkey: txnDataAtoms.selkey,
}, (values) => {
  if (values.preset === Preset.RegOnline) {
    YupString().trim().required().validateSync(values.selkey);
  }
});
export const sprfkeyConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  sprfkey: txnDataAtoms.sprfkey,
}, (values) => {
  if (values.preset === Preset.RegOnline) {
    YupString().trim().required().validateSync(values.sprfkey);
  }
});
export const votefstConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  votefst: txnDataAtoms.votefst,
}, (values) => {
  if (values.preset === Preset.RegOnline) {
    YupNumber().required().validateSync(values.votefst);
  }
});
export const votelstConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  votelst: txnDataAtoms.votelst,
}, (values) => {
  if (values.preset === Preset.RegOnline) {
    YupNumber().required().validateSync(values.votelst);
  }
});
export const votekdConditionalRequireAtom = validateAtoms({
  preset: presetAtom,
  votekd: txnDataAtoms.votekd,
}, (values) => {
  if (values.preset === Preset.RegOnline) {
    YupNumber().required().validateSync(values.votekd);
  }
});
export const votefstVotelstFormControlAtom = validateAtoms({
  votefst: txnDataAtoms.votefst,
  votelst: txnDataAtoms.votelst,
}, (values) => {
  if (values.votelst !== undefined) { // If a last round has been entered yet
    // First voting round must be less than the last voting round
    YupNumber()
      .max((values.votelst as number), ({max}): ValidationMessage => (
        {key: 'fields.votefst.max_error', dict: {max}}
      ))
      .validateSync(values.votefst);
  }
});
