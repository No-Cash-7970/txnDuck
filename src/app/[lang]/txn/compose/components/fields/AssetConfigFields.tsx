/** Fields for the compose-transaction form that are for asset-configuration transaction */

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { NumberField, TextField, ToggleField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  ADDRESS_LENGTH,
  ASSET_NAME_MAX_LENGTH,
  MAX_DECIMAL_PLACES,
  METADATA_HASH_LENGTH,
  Preset,
  UNIT_NAME_MAX_LENGTH,
  URL_MAX_LENGTH,
  aparDcConditionalRequireAtom,
  aparTConditionalRequireAtom,
  assetConfigFormControlAtom,
  caidConditionalRequireAtom,
  presetAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';
import FieldErrorMessage from './FieldErrorMessage';

export function AssetId({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const caidCondReqGroup = useAtomValue(caidConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <TextField label={t('fields.caid.label')}
      name='caid'
      id='caid-input'
      tip={{
        content: t('fields.caid.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={preset === Preset.AssetReconfig || preset === Preset.AssetDestroy}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='aclose-field'
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || form.touched.caid) &&
          (form.fieldErrors.caid || (!caidCondReqGroup.isValid && caidCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      value={form.values.caid as number ?? ''}
      onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/gm, '');
        form.handleOnChange('caid')(value === '' ? undefined : parseInt(value));
      }}
      onFocus={form.handleOnFocus('caid')}
      onBlur={form.handleOnBlur('caid')}
      inputMode='numeric'
    />
    {(showFormErrors || form.touched.caid) && form.fieldErrors.caid &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.caid.message.key}
        dict={form.fieldErrors.caid.message.dict}
      />
    }
    {(showFormErrors || form.touched.caid) && !caidCondReqGroup.isValid && caidCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(caidCondReqGroup.error as any).message.key}
        dict={(caidCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}

export function UnitName({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  // If creation transaction
  return (!form.values.caid && <>
    <TextField label={t('fields.apar_un.label')}
      name='apar_un'
      id='apar_un-input'
      tip={{
        content: t('fields.apar_un.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      placeholder={t('fields.apar_un.placeholder')}
      containerId='apar_un-field'
      containerClass='mt-4 max-w-xs'
      inputClass={
        ((showFormErrors || form.touched.apar_un) && form.fieldErrors.apar_un) ? 'input-error' : ''
      }
      maxLength={UNIT_NAME_MAX_LENGTH}
      value={form.values.apar_un as string}
      onChange={(e) => form.handleOnChange('apar_un')(e.target.value)}
      onFocus={form.handleOnFocus('apar_un')}
      onBlur={form.handleOnBlur('apar_un')}
    />
    {(showFormErrors || form.touched.apar_un) && form.fieldErrors.apar_un &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_un.message.key}
        dict={form.fieldErrors.apar_un.message.dict}
      />
    }
  </>);
}

export function AssetName({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  // If creation transaction
  return (!form.values.caid && <>
    <TextField label={t('fields.apar_an.label')}
      name='apar_an'
      id='apar_an-input'
      tip={{
        content: t('fields.apar_an.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      placeholder={t('fields.apar_an.placeholder')}
      containerId='apar_an-field'
      containerClass='mt-4 max-w-xs'
      inputClass={
        ((showFormErrors || form.touched.apar_an) && form.fieldErrors.apar_an) ? 'input-error' : ''
      }
      maxLength={ASSET_NAME_MAX_LENGTH}
      value={form.values.apar_an as string}
      onChange={(e) => form.handleOnChange('apar_an')(e.target.value)}
      onFocus={form.handleOnFocus('apar_an')}
      onBlur={form.handleOnBlur('apar_an')}
    />
    {(showFormErrors || form.touched.apar_an) && form.fieldErrors.apar_an &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_an.message.key}
        dict={form.fieldErrors.apar_an.message.dict}
      />
    }
  </>);
}

export function Total({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const aparTCondReqGroup = useAtomValue(aparTConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  // If creation transaction
  return (!form.values.caid && <>
    <NumberField label={t('fields.apar_t.label')}
      name='apar_t'
      id='apar_t-input'
      tip={{
        content: t('fields.apar_t.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='apar_t-field'
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || form.touched.apar_t) &&
          (form.fieldErrors.apar_t || (!aparTCondReqGroup.isValid && aparTCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      min={1}
      step={1}
      value={(form.values.apar_t as string) ?? ''}
      onChange={(e) => form.handleOnChange('apar_t')(e.target.value)}
      onFocus={form.handleOnFocus('apar_t')}
      onBlur={form.handleOnBlur('apar_t')}
    />
    {(showFormErrors || form.touched.apar_t) && form.fieldErrors.apar_t &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_t.message.key}
        dict={form.fieldErrors.apar_t.message.dict}
      />
    }
    {(showFormErrors || form.touched.apar_t) && !aparTCondReqGroup.isValid
      && aparTCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(aparTCondReqGroup.error as any).message.key}
        dict={(aparTCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}

export function DecimalPlaces({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const aparDcCondReqGroup = useAtomValue(aparDcConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  // If creation transaction
  return (!form.values.caid && <>
    <NumberField label={t('fields.apar_dc.label')}
      name='apar_dc'
      id='apar_dc-input'
      tip={{
        content: t('fields.apar_dc.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='apar_dc-field'
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || form.touched.apar_dc) &&
          (form.fieldErrors.apar_dc || (!aparDcCondReqGroup.isValid && aparDcCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      min={0}
      max={MAX_DECIMAL_PLACES}
      step={1}
      value={(form.values.apar_dc as string) ?? ''}
      onChange={(e) =>
        form.handleOnChange('apar_dc')(e.target.value === '' ? undefined : parseInt(e.target.value))
      }
      onFocus={form.handleOnFocus('apar_dc')}
      onBlur={form.handleOnBlur('apar_dc')}
    />
    {(showFormErrors || form.touched.apar_dc) && form.fieldErrors.apar_dc &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_dc.message.key}
        dict={form.fieldErrors.apar_dc.message.dict}
      />
    }
    {(showFormErrors || form.touched.apar_dc) && !aparDcCondReqGroup.isValid
      && aparDcCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(aparDcCondReqGroup.error as any).message.key}
        dict={(aparDcCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}

export function DefaultFrozen({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  // If creation transaction
  return (!form.values.caid &&
    <ToggleField label={t('fields.apar_df.label')}
      name='apar_df'
      id='apar_df-input'
      tip={{
        content: t('fields.apar_df.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={true}
      containerId='apar_df-field'
      containerClass='mt-4 max-w-xs'
      inputClass='toggle-primary'
      value={!!form.values.apar_df}
      onChange={(e) => form.handleOnChange('apar_df')(e.target.checked)}
    />
  );
}

export function Url({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  // If creation transaction
  return (!form.values.caid && <>
    <TextField label={t('fields.apar_au.label')}
      type='url'
      name='apar_au'
      id='apar_au-input'
      tip={{
        content: t('fields.apar_au.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      placeholder={t('fields.apar_au.placeholder')}
      containerId='apar_au-field'
      containerClass='mt-4'
      inputClass={
        ((showFormErrors || form.touched.apar_au) && form.fieldErrors.apar_au) ? 'input-error' : ''
      }
      maxLength={URL_MAX_LENGTH}
      value={form.values.apar_au as string}
      onChange={(e) => form.handleOnChange('apar_au')(e.target.value)}
      onFocus={form.handleOnFocus('apar_au')}
      onBlur={form.handleOnBlur('apar_au')}
    />
    {(showFormErrors || form.touched.apar_au) && form.fieldErrors.apar_au &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_au.message.key}
        dict={form.fieldErrors.apar_au.message.dict}
      />
    }
  </>);
}

export function ManagerAddr({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.apar_m.label')}
      name='apar_m'
      id='apar_m-input'
      tip={{
        content: t('fields.apar_m.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      placeholder={t('fields.apar_m.placeholder')}
      containerId='apar_m-field'
      containerClass='mt-4'
      inputClass={
        ((showFormErrors || form.touched.apar_m) && form.fieldErrors.apar_m) ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.apar_m as string}
      onChange={(e) => form.handleOnChange('apar_m')(e.target.value)}
      onFocus={form.handleOnFocus('apar_m')}
      onBlur={form.handleOnBlur('apar_m')}
    />
    {(showFormErrors || form.touched.apar_m) && form.fieldErrors.apar_m &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_m.message.key}
        dict={form.fieldErrors.apar_m.message.dict}
      />
    }
  </>);
}

export function FreezeAddr({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.apar_f.label')}
      name='apar_f'
      id='apar_f-input'
      tip={{
        content: t('fields.apar_f.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      placeholder={t('fields.apar_f.placeholder')}
      containerId='apar_f-field'
      containerClass='mt-4'
      inputClass={
        ((showFormErrors || form.touched.apar_f) && form.fieldErrors.apar_f) ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.apar_f as string}
      onChange={(e) => form.handleOnChange('apar_f')(e.target.value)}
      onFocus={form.handleOnFocus('apar_f')}
      onBlur={form.handleOnBlur('apar_f')}
    />
    {(showFormErrors || form.touched.apar_f) && form.fieldErrors.apar_f &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_f.message.key}
        dict={form.fieldErrors.apar_f.message.dict}
      />
    }
  </>);
}

export function ClawbackAddr({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.apar_c.label')}
      name='apar_c'
      id='apar_c-input'
      tip={{
        content: t('fields.apar_c.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      placeholder={t('fields.apar_c.placeholder')}
      containerId='apar_c-field'
      containerClass='mt-4'
      inputClass={
        ((showFormErrors || form.touched.apar_c) && form.fieldErrors.apar_c) ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.apar_c as string}
      onChange={(e) => form.handleOnChange('apar_c')(e.target.value)}
      onFocus={form.handleOnFocus('apar_c')}
      onBlur={form.handleOnBlur('apar_c')}
    />
    {(showFormErrors || form.touched.apar_c) && form.fieldErrors.apar_c &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_c.message.key}
        dict={form.fieldErrors.apar_c.message.dict}
      />
    }
  </>);
}

export function ReserveAddr({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.apar_r.label')}
      name='apar_r'
      id='apar_r-input'
      tip={{
        content: t('fields.apar_r.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      placeholder={t('fields.apar_r.placeholder')}
      containerId='apar_r-field'
      containerClass='mt-4'
      inputClass={
        ((showFormErrors || form.touched.apar_r) && form.fieldErrors.apar_r) ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.apar_r as string}
      onChange={(e) => form.handleOnChange('apar_r')(e.target.value)}
      onFocus={form.handleOnFocus('apar_r')}
      onBlur={form.handleOnBlur('apar_r')}
    />
    {(showFormErrors || form.touched.apar_r) && form.fieldErrors.apar_r &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_r.message.key}
        dict={form.fieldErrors.apar_r.message.dict}
      />
    }
  </>);
}

export function MetadataHash({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  // If creation transaction
  return (!form.values.caid && <>
    <TextField label={t('fields.apar_am.label')}
      name='apar_am'
      id='apar_am-input'
      tip={{
        content: t('fields.apar_am.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      containerId='apar_am-field'
      containerClass='mt-4 max-w-sm'
      inputClass={
        ((showFormErrors || form.touched.apar_am) && form.fieldErrors.apar_am) ? 'input-error' : ''
      }
      maxLength={METADATA_HASH_LENGTH}
      value={form.values.apar_am as string}
      onChange={(e) => form.handleOnChange('apar_am')(e.target.value)}
      onFocus={form.handleOnFocus('apar_am')}
      onBlur={form.handleOnBlur('apar_am')}
    />
    {(showFormErrors || form.touched.apar_am) && form.fieldErrors.apar_am &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_am.message.key}
        dict={form.fieldErrors.apar_am.message.dict}
      />
    }
  </>);
}
