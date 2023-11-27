/** Fields for the compose-transaction form that are for application call transaction */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  NumberField,
  TextField,
  SelectField,
  TextAreaField,
  FieldGroup,
} from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { Atom, PrimitiveAtom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithValidate } from 'jotai-form';
import { OnApplicationComplete } from 'algosdk';
import { IconExclamationCircle, IconMinus, IconPlus } from '@tabler/icons-react';
import {
  ADDRESS_LENGTH,
  MAX_APP_ACCTS,
  MAX_APP_ARGS,
  MAX_APP_EXTRA_PAGES,
  MAX_APP_GLOBALS,
  MAX_APP_LOCALS,
  MAX_APP_TOTAL_DEPS,
  Preset,
  ValidationMessage,
  apapConditionalRequireAtom,
  apepConditionalRequireAtom,
  apgsNbsConditionalRequireAtom,
  apgsNuiConditionalRequireAtom,
  apidConditionalRequireAtom,
  aplsNbsConditionalRequireAtom,
  aplsNuiConditionalRequireAtom,
  apaaValidateOptions,
  applFormControlAtom,
  apsuConditionalRequireAtom,
  showFormErrorsAtom,
  maxAppGlobalsCheckAtom,
  maxAppLocalsCheckAtom,
  presetAtom,
  txnDataAtoms,
  validationAtom,
  apatValidateOptions,
  apfaValidateOptions,
  apasValidateOptions,
  apbxIValidateOptions,
  apbxNValidateOptions,
  BoxRefAtomGroup,
  MAX_APP_KEY_LENGTH
} from '@/app/lib/txn-data';
import FieldErrorMessage from './FieldErrorMessage';

export function OnComplete({ t }: { t: TFunction }) {
  const form = useAtomValue(applFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <SelectField label={t('fields.apan.label')}
      name='apan'
      id='apan-input'
      required={true}
      requiredText={t('form.required')}
      containerId='apan-field'
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || form.touched.apan) && form.fieldErrors.apan)
        ? 'select-error' : ''
      }
      disabled={!!preset}
      options={[
        { value: OnApplicationComplete.NoOpOC, text: t('fields.apan.options.no_op') },
        { value: OnApplicationComplete.OptInOC, text: t('fields.apan.options.opt_in') },
        { value: OnApplicationComplete.UpdateApplicationOC, text: t('fields.apan.options.update') },
        { value: OnApplicationComplete.ClearStateOC, text: t('fields.apan.options.clear') },
        { value: OnApplicationComplete.CloseOutOC, text: t('fields.apan.options.close_out') },
        { value: OnApplicationComplete.DeleteApplicationOC, text: t('fields.apan.options.delete') },
      ]}
      value={form.values.apan}
      onChange={(e) => form.handleOnChange('apan')(e.target.value)}
      onFocus={form.handleOnFocus('apan')}
      onBlur={form.handleOnBlur('apan')}
    />
    {form.touched.apan && form.fieldErrors.apan &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apan.message.key}
        dict={form.fieldErrors.apan.message.dict}
      />
    }
  </>);
}

export function AppId({ t }: { t: TFunction }) {
  const form = useAtomValue(applFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const apidCondReqGroup = useAtomValue(apidConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <TextField label={t('fields.apid.label')}
      name='apid'
      id='apid-input'
      required={form.values.apan !== OnApplicationComplete.NoOpOC
        || (!!preset && preset !== Preset.AppDeploy)
      }
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='apid-field'
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || form.touched.apid) &&
          (form.fieldErrors.apid || (!apidCondReqGroup.isValid && apidCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      value={form.values.apid ?? ''}
      onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/gm, '');
        form.handleOnChange('apid')(value === '' ? undefined : parseInt(value));
      }}
      onFocus={form.handleOnFocus('apid')}
      onBlur={form.handleOnBlur('apid')}
      inputMode='numeric'
    />
    {(showFormErrors || form.touched.apid) && form.fieldErrors.apid &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apid.message.key}
        dict={form.fieldErrors.apid.message.dict}
      />
    }
    {(showFormErrors || form.touched.apid) &&
      !apidCondReqGroup.isValid && apidCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(apidCondReqGroup.error as any).message.key}
        dict={(apidCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}

/** List of application arguments */
export function AppArgs({ t }: { t: TFunction }) {
  const [appArgs, dispatch] = useAtom(txnDataAtoms.apaa);
  return (
    <FieldGroup headingLevel={2} heading={t('fields.apaa.title')}>
      {appArgs.length > MAX_APP_ARGS &&
        <div className='alert alert-error text-start' id='apaa-field'>
          <IconExclamationCircle aria-hidden />
          {t('fields.apaa.max_error', {count: MAX_APP_ARGS})}
        </div>
      }
      <div className='alert alert-info text-start mt-2'>{t('fields.apaa.no_abi_support')}</div>

      {!appArgs.length && <p className='italic'>{t('fields.apaa.none')}</p>}

      {appArgs.map(
        (argAtom, i) => <AppArgInput t={t} argAtom={argAtom} index={i} key={`${argAtom}`} />
      )}

      <div className='pt-4'>
        <button type='button'
          className='btn btn-sm btn-secondary w-full sm:w-auto sm:me-2 my-1'
          onClick={() => dispatch({
            type: 'insert',
            value: atomWithValidate('', apaaValidateOptions)
          })}
          disabled={appArgs.length >= MAX_APP_ARGS}
        >
          <IconPlus aria-hidden />
          {t('fields.apaa.add_btn')}
        </button>
        <button type='button'
          className='btn btn-sm btn-error w-full sm:w-auto sm:ms-2 my-1'
          onClick={() => dispatch({ type: 'remove', atom: appArgs[appArgs.length - 1] })}
          disabled={!appArgs.length}
        >
          <IconMinus aria-hidden />
          {t('fields.apaa.remove_btn')}
        </button>
      </div>
    </FieldGroup>
  );
}
function AppArgInput({ t, argAtom, index }:
  { t: TFunction, argAtom: Atom<validationAtom<string>>, index: number }
) {
  const [arg, setArg] = useAtom(useAtomValue(argAtom));
  const [touched, setTouched] = useState(false);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.apaa.label', { index: index + 1 })}
      name={`apaa-${index}`}
      id={`apaa-${index}-input`}
      inputInsideLabel={false}
      placeholder={t('fields.apaa.placeholder', { index: index + 1 })}
      containerId={`apaa-${index}-field`}
      containerClass='mt-4 max-w-md'
      inputClass={((showFormErrors || touched) && !arg.isValid) ? 'input-error': ''}
      value={arg.value}
      onChange={(e) => setArg(e.target.value)}
      onBlur={() => setTouched(true)}
    />
    {(showFormErrors || touched) && !arg.isValid &&
      <FieldErrorMessage t={t}
        i18nkey={((arg.error as any).message as ValidationMessage).key}
        dict={((arg.error as any).message as ValidationMessage).dict}
      />
    }
  </>);
}

function ApprovalProg({ t }: { t: TFunction }) {
  const form = useAtomValue(applFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const apapCondReqGroup = useAtomValue(apapConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <TextAreaField label={t('fields.apap.label')}
      name='apap'
      id='apap-input'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.apap.placeholder')}
      containerId='apap-field'
      containerClass='mt-4 max-w-lg'
      inputClass={((showFormErrors || form.touched.apap) &&
          (form.fieldErrors.apap || (!apapCondReqGroup.isValid && apapCondReqGroup.error))
        )
        ? 'textarea-error' : ''
      }
      value={form.values.apap}
      onChange={(e) => form.handleOnChange('apap')(e.target.value)}
      onFocus={form.handleOnFocus('apap')}
      onBlur={form.handleOnBlur('apap')}
      spellCheck={false}
    />
    {(showFormErrors || form.touched.apap) && form.fieldErrors.apap &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apap.message.key}
        dict={form.fieldErrors.apap.message.dict}
      />
    }
    {(showFormErrors || form.touched.apap) &&
      !apapCondReqGroup.isValid && apapCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(apapCondReqGroup.error as any).message.key}
        dict={(apapCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}

function ClearStateProg({ t }: { t: TFunction }) {
  const form = useAtomValue(applFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const apsuCondReqGroup = useAtomValue(apsuConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <TextAreaField label={t('fields.apsu.label')}
      name='apsu'
      id='apsu-input'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.apsu.placeholder')}
      containerId='apsu-field'
      containerClass='mt-4 max-w-lg'
      inputClass={((showFormErrors || form.touched.apsu) &&
          (form.fieldErrors.apsu || (!apsuCondReqGroup.isValid && apsuCondReqGroup.error))
        )
        ? 'textarea-error' : ''
      }
      value={form.values.apsu}
      onChange={(e) => form.handleOnChange('apsu')(e.target.value)}
      onFocus={form.handleOnFocus('apsu')}
      onBlur={form.handleOnBlur('apsu')}
      spellCheck={false}
    />
    {(showFormErrors || form.touched.apsu) && form.fieldErrors.apsu &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apsu.message.key}
        dict={form.fieldErrors.apsu.message.dict}
      />
    }
    {(showFormErrors || form.touched.apsu) &&
      !apsuCondReqGroup.isValid && apsuCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(apsuCondReqGroup.error as any).message.key}
        dict={(apsuCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}

function GlobalInts({ t }: { t: TFunction }) {
  const form = useAtomValue(applFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const apgsNuiCondReqGroup = useAtomValue(apgsNuiConditionalRequireAtom);
  const maxGlobalsCheckGroup = useAtomValue(maxAppGlobalsCheckAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <NumberField label={t('fields.apgs_nui.label')}
      name='apgs_nui'
      id='apgs_nui-input'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='apgs_nui-field'
      containerClass='mt-4 max-w-xs'
      inputClass={(
          ((showFormErrors || form.touched.apgs_nui) &&
            (form.fieldErrors.apgs_nui
              || (!apgsNuiCondReqGroup.isValid && apgsNuiCondReqGroup.error))
          )
          || (!maxGlobalsCheckGroup.isValid && maxGlobalsCheckGroup.error)
        )
        ? 'input-error' : ''
      }
      min={0}
      max={MAX_APP_GLOBALS - (form.values.apgs_nbs as number ?? 0)}
      step={1}
      value={form.values.apgs_nui ?? ''}
      onChange={(e) =>
        form.handleOnChange('apgs_nui')(
          e.target.value === '' ? undefined : parseInt(e.target.value)
        )
      }
      onFocus={form.handleOnFocus('apgs_nui')}
      onBlur={form.handleOnBlur('apgs_nui')}
    />
    {(showFormErrors || form.touched.apgs_nui) && form.fieldErrors.apgs_nui &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apgs_nui.message.key}
        dict={form.fieldErrors.apgs_nui.message.dict}
      />
    }
    {(showFormErrors || form.touched.apgs_nui) &&
      !apgsNuiCondReqGroup.isValid && apgsNuiCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(apgsNuiCondReqGroup.error as any).message.key}
        dict={(apgsNuiCondReqGroup.error as any).message.dict}
      />
    }
    {!maxGlobalsCheckGroup.isValid && maxGlobalsCheckGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(maxGlobalsCheckGroup.error as any).message.key}
        dict={(maxGlobalsCheckGroup.error as any).message.dict}
      />
    }
  </>);
}

function GlobalByteSlices({ t }: { t: TFunction }) {
  const form = useAtomValue(applFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const apgsNbsCondReqGroup = useAtomValue(apgsNbsConditionalRequireAtom);
  const maxGlobalsCheckGroup = useAtomValue(maxAppGlobalsCheckAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <NumberField label={t('fields.apgs_nbs.label')}
      name='apgs_nbs'
      id='apgs_nbs-input'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='apgs_nbs-field'
      containerClass='mt-4 max-w-xs'
      inputClass={(
          ((showFormErrors || form.touched.apgs_nbs) &&
            (form.fieldErrors.apgs_nbs
              || (!apgsNbsCondReqGroup.isValid && apgsNbsCondReqGroup.error))
          )
          || (!maxGlobalsCheckGroup.isValid && maxGlobalsCheckGroup.error)
        )
        ? 'input-error' : ''
      }
      min={0}
      max={MAX_APP_GLOBALS - (form.values.apgs_nui as number ?? 0)}
      step={1}
      value={form.values.apgs_nbs ?? ''}
      onChange={(e) =>
        form.handleOnChange('apgs_nbs')(
          e.target.value === '' ? undefined : parseInt(e.target.value)
        )
      }
      onFocus={form.handleOnFocus('apgs_nbs')}
      onBlur={form.handleOnBlur('apgs_nbs')}
    />
    {(showFormErrors || form.touched.apgs_nbs) && form.fieldErrors.apgs_nbs &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apgs_nbs.message.key}
        dict={form.fieldErrors.apgs_nbs.message.dict}
      />
    }
    {(showFormErrors || form.touched.apgs_nbs) &&
      !apgsNbsCondReqGroup.isValid && apgsNbsCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(apgsNbsCondReqGroup.error as any).message.key}
        dict={(apgsNbsCondReqGroup.error as any).message.dict}
      />
    }
    {!maxGlobalsCheckGroup.isValid && maxGlobalsCheckGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(maxGlobalsCheckGroup.error as any).message.key}
        dict={(maxGlobalsCheckGroup.error as any).message.dict}
      />
    }
  </>);
}

function LocalInts({ t }: { t: TFunction }) {
  const form = useAtomValue(applFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const aplsNuiCondReqGroup = useAtomValue(aplsNuiConditionalRequireAtom);
  const maxLocalsCheckGroup = useAtomValue(maxAppLocalsCheckAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <NumberField label={t('fields.apls_nui.label')}
      name='apls_nui'
      id='apls_nui-input'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='apls_nui-field'
      containerClass='mt-4 max-w-xs'
      inputClass={(
          ((showFormErrors || form.touched.apls_nui) &&
            (form.fieldErrors.apls_nui
              || (!aplsNuiCondReqGroup.isValid && aplsNuiCondReqGroup.error))
          )
          || (!maxLocalsCheckGroup.isValid && maxLocalsCheckGroup.error)
        )
        ? 'input-error' : ''
      }
      min={0}
      max={MAX_APP_LOCALS - (form.values.apls_nbs as number ?? 0)}
      step={1}
      value={form.values.apls_nui ?? ''}
      onChange={(e) =>
        form.handleOnChange('apls_nui')(
          e.target.value === '' ? undefined : parseInt(e.target.value)
        )
      }
      onFocus={form.handleOnFocus('apls_nui')}
      onBlur={form.handleOnBlur('apls_nui')}
    />
    {(showFormErrors || form.touched.apls_nui) && form.fieldErrors.apls_nui &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apls_nui.message.key}
        dict={form.fieldErrors.apls_nui.message.dict}
      />
    }
    {(showFormErrors || form.touched.apls_nui) &&
      !aplsNuiCondReqGroup.isValid && aplsNuiCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(aplsNuiCondReqGroup.error as any).message.key}
        dict={(aplsNuiCondReqGroup.error as any).message.dict}
      />
    }
    {!maxLocalsCheckGroup.isValid && maxLocalsCheckGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(maxLocalsCheckGroup.error as any).message.key}
        dict={(maxLocalsCheckGroup.error as any).message.dict}
      />
    }
  </>);
}

function LocalByteSlices({ t }: { t: TFunction }) {
  const form = useAtomValue(applFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const aplsNbsCondReqGroup = useAtomValue(aplsNbsConditionalRequireAtom);
  const maxLocalsCheckGroup = useAtomValue(maxAppLocalsCheckAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <NumberField label={t('fields.apls_nbs.label')}
      name='apls_nbs'
      id='apls_nbs-input'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='apls_nbs-field'
      containerClass='mt-4 max-w-xs'
      inputClass={(
          ((showFormErrors || form.touched.apls_nbs) &&
            (form.fieldErrors.apls_nbs
              || (!aplsNbsCondReqGroup.isValid && aplsNbsCondReqGroup.error))
          )
          || (!maxLocalsCheckGroup.isValid && maxLocalsCheckGroup.error)
        )
        ? 'input-error' : ''
      }
      min={0}
      max={MAX_APP_LOCALS - (form.values.apls_nui as number ?? 0)}
      step={1}
      value={form.values.apls_nbs ?? ''}
      onChange={(e) =>
        form.handleOnChange('apls_nbs')(
          e.target.value === '' ? undefined : parseInt(e.target.value)
        )
      }
      onFocus={form.handleOnFocus('apls_nbs')}
      onBlur={form.handleOnBlur('apls_nbs')}
    />
    {(showFormErrors || form.touched.apls_nbs) && form.fieldErrors.apls_nbs &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apls_nbs.message.key}
        dict={form.fieldErrors.apls_nbs.message.dict}
      />
    }
    {(showFormErrors || form.touched.apls_nbs) &&
      !aplsNbsCondReqGroup.isValid && aplsNbsCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(aplsNbsCondReqGroup.error as any).message.key}
        dict={(aplsNbsCondReqGroup.error as any).message.dict}
      />
    }
    {!maxLocalsCheckGroup.isValid && maxLocalsCheckGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(maxLocalsCheckGroup.error as any).message.key}
        dict={(maxLocalsCheckGroup.error as any).message.dict}
      />
    }
  </>);
}

function ExtraPages({ t }: { t: TFunction }) {
  const form = useAtomValue(applFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const apepCondReqGroup = useAtomValue(apepConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <NumberField label={t('fields.apep.label')}
      name='apep'
      id='apep-input'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='apep-field'
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || form.touched.apep) &&
          (form.fieldErrors.apep || (!apepCondReqGroup.isValid && apepCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      min={0}
      max={MAX_APP_EXTRA_PAGES}
      step={1}
      value={form.values.apep ?? ''}
      onChange={(e) =>
        form.handleOnChange('apep')(
          e.target.value === '' ? undefined : parseInt(e.target.value)
        )
      }
      onFocus={form.handleOnFocus('apep')}
      onBlur={form.handleOnBlur('apep')}
    />
    {(showFormErrors || form.touched.apep) && form.fieldErrors.apep &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apep.message.key}
        dict={form.fieldErrors.apep.message.dict}
      />
    }
    {(showFormErrors || form.touched.apep) &&
      !apepCondReqGroup.isValid && apepCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(apepCondReqGroup.error as any).message.key}
        dict={(apepCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}

/** Application properties section */
export function AppProperties({ t }: { t: TFunction }) {
  const form = useAtomValue(applFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  return (
    ( // Creating application
      ((!preset && form.values.apan === OnApplicationComplete.NoOpOC && !form.values.apid)
        || preset === Preset.AppDeploy)
      // updating application
      || form.values.apan === OnApplicationComplete.UpdateApplicationOC
    ) &&
    <FieldGroup headingLevel={2} heading={t('fields.app_props_title')}>
      <ApprovalProg t={t} />
      <ClearStateProg t={t} />
      {// Creating app
      form.values.apan === OnApplicationComplete.NoOpOC && <>
        <FieldGroup headingLevel={3} heading={t('fields.app_global_state.title')}>
          <GlobalInts t={t} />
          <GlobalByteSlices t={t} />
        </FieldGroup>
        <FieldGroup headingLevel={3} heading={t('fields.app_local_state.title')}>
          <LocalInts t={t} />
          <LocalByteSlices t={t} />
        </FieldGroup>
        <FieldGroup headingLevel={3} heading={t('fields.apep.section_title')}>
          <ExtraPages t={t} />
        </FieldGroup>
      </>}
    </FieldGroup>
  );
}

/** List of application accounts */
function AppAccts({ t }: { t: TFunction }) {
  const [appAccts, dispatch] = useAtom(txnDataAtoms.apat);
  const appForeignApps = useAtomValue(txnDataAtoms.apfa);
  const appForeignAssets = useAtomValue(txnDataAtoms.apas);
  const boxes = useAtomValue(txnDataAtoms.apbx);
  return (<>
    {appAccts.length > MAX_APP_ACCTS &&
      <div className='alert alert-error text-start' id='apaa-field'>
        <IconExclamationCircle aria-hidden />
        {t('fields.apat.max_error', {count: MAX_APP_ACCTS})}
      </div>
    }
    {!appAccts.length && <p className='italic'>{t('fields.apat.none')}</p>}

    {appAccts.map(
      (acctAtom, i) => <AppAcctInput t={t} acctAtom={acctAtom} index={i} key={`${acctAtom}`} />
    )}

    <div className='py-4'>
      <button type='button'
        className='btn btn-sm btn-secondary w-full sm:w-auto sm:me-2 my-1'
        onClick={() => dispatch({
          type: 'insert',
          value: atomWithValidate('', apatValidateOptions)
        })}
        disabled={
          (appAccts.length + appForeignApps.length + appForeignAssets.length + boxes.length)
            >= MAX_APP_TOTAL_DEPS
          || appAccts.length >= MAX_APP_ACCTS
        }
      >
        <IconPlus aria-hidden />
        {t('fields.apat.add_btn')}
      </button>
      <button type='button'
        className='btn btn-sm btn-error w-full sm:w-auto sm:ms-2 my-1'
        onClick={() => dispatch({ type: 'remove', atom: appAccts[appAccts.length - 1] })}
        disabled={!appAccts.length}
      >
        <IconMinus aria-hidden />
        {t('fields.apat.remove_btn')}
      </button>
    </div>
  </>);
}
function AppAcctInput({ t, acctAtom, index }:
  { t: TFunction, acctAtom: Atom<validationAtom<string>>, index: number }
) {
  const [acct, setAcct] = useAtom(useAtomValue(acctAtom));
  const [touched, setTouched] = useState(false);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.apat.label', { index: index + 1 })}
      name={`apat-${index}`}
      id={`apat-${index}-input`}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.apat.placeholder', { index: index + 1 })}
      containerId={`apat-${index}-field`}
      containerClass='mt-4'
      inputClass={((showFormErrors || touched) && !acct.isValid) ? 'input-error': ''}
      maxLength={ADDRESS_LENGTH}
      value={acct.value}
      onChange={(e) => setAcct(e.target.value)}
      onBlur={() => setTouched(true)}
    />
    {(showFormErrors || touched) && !acct.isValid &&
      <FieldErrorMessage t={t}
        i18nkey={((acct.error as any).message as ValidationMessage).key}
        dict={((acct.error as any).message as ValidationMessage).dict}
      />
    }
  </>);
}

/** List of application foreign apps */
function ForeignApps({ t }: { t: TFunction }) {
  const [appForeignApps, dispatch] = useAtom(txnDataAtoms.apfa);
  const appAccts = useAtomValue(txnDataAtoms.apat);
  const appForeignAssets = useAtomValue(txnDataAtoms.apas);
  const boxes = useAtomValue(txnDataAtoms.apbx);
  return (<>
    {!appForeignApps.length && <p className='italic'>{t('fields.apfa.none')}</p>}

    {appForeignApps.map(
      (appAtom, i) => <ForeignAppInput t={t} appAtom={appAtom} index={i} key={`${appAtom}`} />
    )}

    <div className='py-4'>
      <button type='button'
        className='btn btn-sm btn-secondary w-full sm:w-auto sm:me-2 my-1'
        onClick={() => dispatch({
          type: 'insert',
          value: atomWithValidate(null, apfaValidateOptions)
        })}
        disabled={
          (appAccts.length + appForeignApps.length + appForeignAssets.length + boxes.length)
            >= MAX_APP_TOTAL_DEPS
        }
      >
        <IconPlus aria-hidden />
        {t('fields.apfa.add_btn')}
      </button>
      <button type='button'
        className='btn btn-sm btn-error w-full sm:w-auto sm:ms-2 my-1'
        onClick={
          () => dispatch({ type: 'remove', atom: appForeignApps[appForeignApps.length - 1] })
        }
        disabled={!appForeignApps.length}
      >
        <IconMinus aria-hidden />
        {t('fields.apfa.remove_btn')}
      </button>
    </div>
  </>);
}
function ForeignAppInput({ t, appAtom, index }:
  { t: TFunction, appAtom: Atom<validationAtom<number|null>>, index: number }
) {
  const [app, setApp] = useAtom(useAtomValue(appAtom));
  const [touched, setTouched] = useState(false);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.apfa.label', { index: index + 1 })}
      name={`apfa-${index}`}
      id={`apfa-${index}-input`}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.apfa.placeholder', { index: index + 1 })}
      containerId={`apfa-${index}-field`}
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || touched) && !app.isValid) ? 'input-error': ''}
      value={app.value ?? ''}
      onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/gm, '');
        setApp(value === '' ? null : parseInt(value));
      }}
      onBlur={() => setTouched(true)}
      inputMode='numeric'
    />
    {(showFormErrors || touched) && !app.isValid &&
      <FieldErrorMessage t={t}
        i18nkey={((app.error as any).message as ValidationMessage).key}
        dict={((app.error as any).message as ValidationMessage).dict}
      />
    }
  </>);
}

/** List of application foreign assets */
function ForeignAssets({ t }: { t: TFunction }) {
  const [appForeignAssets, dispatch] = useAtom(txnDataAtoms.apas);
  const appAccts = useAtomValue(txnDataAtoms.apat);
  const appForeignApps = useAtomValue(txnDataAtoms.apfa);
  const boxes = useAtomValue(txnDataAtoms.apbx);
  return (<>
    {!appForeignAssets.length && <p className='italic'>{t('fields.apas.none')}</p>}

    {appForeignAssets.map(
      (assetAtom, i) => (
        <ForeignAssetInput t={t} assetAtom={assetAtom} index={i} key={`${assetAtom}`} />
      )
    )}

    <div className='py-4'>
      <button type='button'
        className='btn btn-sm btn-secondary w-full sm:w-auto sm:me-2 my-1'
        onClick={() => dispatch({
          type: 'insert',
          value: atomWithValidate(null, apasValidateOptions)
        })}
        disabled={
          (appAccts.length + appForeignApps.length + appForeignAssets.length + boxes.length)
            >= MAX_APP_TOTAL_DEPS
        }
      >
        <IconPlus aria-hidden />
        {t('fields.apas.add_btn')}
      </button>
      <button type='button'
        className='btn btn-sm btn-error w-full sm:w-auto sm:ms-2 my-1'
        onClick={
          () => dispatch({ type: 'remove', atom: appForeignAssets[appForeignAssets.length - 1] })
        }
        disabled={!appForeignAssets.length}
      >
        <IconMinus aria-hidden />
        {t('fields.apas.remove_btn')}
      </button>
    </div>
  </>);
}
function ForeignAssetInput({ t, assetAtom, index }:
  { t: TFunction, assetAtom: Atom<validationAtom<number|null>>, index: number }
) {
  const [asset, setAsset] = useAtom(useAtomValue(assetAtom));
  const [touched, setTouched] = useState(false);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.apas.label', { index: index + 1 })}
      name={`apas-${index}`}
      id={`apas-field-${index}`}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.apas.placeholder', { index: index + 1 })}
      containerId={`apas-${index}-field`}
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || touched) && !asset.isValid) ? 'input-error': ''}
      value={asset.value ?? ''}
      onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/gm, '');
        setAsset(value === '' ? null : parseInt(value));
      }}
      onBlur={() => setTouched(true)}
      inputMode='numeric'
    />
    {(showFormErrors || touched) && !asset.isValid &&
      <FieldErrorMessage t={t}
        i18nkey={((asset.error as any).message as ValidationMessage).key}
        dict={((asset.error as any).message as ValidationMessage).dict}
      />
    }
  </>);
}

/** List of application boxes */
function Boxes({ t }: { t: TFunction }) {
  const [boxes, dispatch] = useAtom(txnDataAtoms.apbx);
  const appAccts = useAtomValue(txnDataAtoms.apat);
  const appForeignApps = useAtomValue(txnDataAtoms.apfa);
  const appForeignAssets = useAtomValue(txnDataAtoms.apas);
  return (<>
    {!boxes.length && <p className='italic'>{t('fields.apbx.none')}</p>}

    {boxes.map(
      (boxAtom, i) =>
        <FieldGroup headingLevel={4}
          heading={t('fields.apbx.box_title', { index: i + 1 })}
          key={`${boxAtom}`}
        >
          <BoxIdInput t={t} boxAtom={boxAtom} index={i} />
          <BoxNameInput t={t} boxAtom={boxAtom} index={i} />
        </FieldGroup>
    )}

    <div className='py-4'>
      <button type='button'
        className='btn btn-sm btn-secondary w-full sm:w-auto sm:me-2 my-1'
        onClick={() => dispatch({
          type: 'insert',
          value: {
            i: atomWithValidate(null, apbxIValidateOptions),
            n: atomWithValidate('', apbxNValidateOptions)
          }
        })}
        disabled={
          (appAccts.length + appForeignApps.length + appForeignAssets.length + boxes.length)
            >= MAX_APP_TOTAL_DEPS
        }
      >
        <IconPlus aria-hidden />
        {t('fields.apbx.add_btn')}
      </button>
      <button type='button'
        className='btn btn-sm btn-error w-full sm:w-auto sm:ms-2 my-1'
        onClick={
          () => dispatch({ type: 'remove', atom: boxes[boxes.length - 1] })
        }
        disabled={!boxes.length}
      >
        <IconMinus aria-hidden />
        {t('fields.apbx.remove_btn')}
      </button>
    </div>
  </>);
}
function BoxIdInput({ t, boxAtom, index }:
  { t: TFunction, boxAtom: PrimitiveAtom<BoxRefAtomGroup>, index: number }
) {
  const [boxId, setBoxId] = useAtom(useAtomValue(boxAtom).i);
  const [touched, setTouched] = useState(false);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.apbx_i.label', { index: index + 1 })}
      name={`apbx_i-${index}`}
      id={`apbx_i-${index}-input`}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.apbx_i.placeholder', { index: index + 1 })}
      containerId={`apbx_i-${index}-field`}
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || touched) && !boxId.isValid) ? 'input-error': ''}
      value={boxId.value ?? ''}
      onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/gm, '');
        setBoxId(value === '' ? null : parseInt(value));
      }}
      onBlur={() => setTouched(true)}
      inputMode='numeric'
    />
    {(showFormErrors || touched) && !boxId.isValid &&
      <FieldErrorMessage t={t}
        i18nkey={((boxId.error as any).message as ValidationMessage).key}
        dict={((boxId.error as any).message as ValidationMessage).dict}
      />
    }
  </>);
}
function BoxNameInput({ t, boxAtom, index }:
  { t: TFunction, boxAtom: PrimitiveAtom<BoxRefAtomGroup>, index: number }
) {
  const [boxName, setBoxName] = useAtom(useAtomValue(boxAtom).n);
  const [touched, setTouched] = useState(false);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.apbx_n.label', { index: index + 1 })}
      name={`apbx_n-${index}`}
      id={`apbx_n-${index}-input`}
      inputInsideLabel={false}
      placeholder={t('fields.apbx_n.placeholder', { index: index + 1 })}
      containerId={`apbx_n-${index}-field`}
      containerClass='mt-4 max-w-sm'
      inputClass={((showFormErrors || touched) && !boxName.isValid) ? 'input-error': ''}
      maxLength={MAX_APP_KEY_LENGTH}
      value={boxName.value}
      onChange={(e) => setBoxName(e.target.value)}
      onBlur={() => setTouched(true)}
    />
    {(showFormErrors || touched) && !boxName.isValid &&
      <FieldErrorMessage t={t}
        i18nkey={((boxName.error as any).message as ValidationMessage).key}
        dict={((boxName.error as any).message as ValidationMessage).dict}
      />
    }
  </>);
}

/** Application dependencies section */
export function AppDependencies({ t }: { t: TFunction }) {
  const appAccts = useAtomValue(txnDataAtoms.apat);
  const appForeignApps = useAtomValue(txnDataAtoms.apfa);
  const appForeignAssets = useAtomValue(txnDataAtoms.apas);
  const boxes = useAtomValue(txnDataAtoms.apbx);
  return (
    <FieldGroup headingLevel={2} heading={t('fields.app_deps_title')}>
      {
        ((appAccts.length + appForeignApps.length + appForeignAssets.length + boxes.length)
          > MAX_APP_TOTAL_DEPS)
        &&
        <div className='alert alert-error text-start' id='apdeps-field'>
          <IconExclamationCircle aria-hidden />
          {t('form.error.app.max_deps', {count: MAX_APP_TOTAL_DEPS})}
        </div>
      }
      <FieldGroup headingLevel={3} heading={t('fields.apat.title')}>
        <AppAccts t={t} />
      </FieldGroup>
      <FieldGroup headingLevel={3} heading={t('fields.apfa.title')}>
        <ForeignApps t={t} />
      </FieldGroup>
      <FieldGroup headingLevel={3} heading={t('fields.apas.title')}>
        <ForeignAssets t={t} />
      </FieldGroup>
      <FieldGroup headingLevel={3} heading={t('fields.apbx.title')}>
        <Boxes t={t} />
      </FieldGroup>
    </FieldGroup>
  );
}
