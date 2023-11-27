/** Fields for the compose-transaction form that are for asset-freeze transaction */

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { TextField, ToggleField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  ADDRESS_LENGTH,
  Preset,
  assetFreezeFormControlAtom,
  presetAtom,
  showFormErrorsAtom,
} from '@/app/lib/txn-data';
import FieldErrorMessage from './FieldErrorMessage';

export function AssetId({ t }: { t: TFunction }) {
  const form = useAtomValue(assetFreezeFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <TextField label={t('fields.faid.label')}
      name='faid'
      id='faid-input'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='faid-field'
      containerClass='mt-4 max-w-xs'
      inputClass={
        ((showFormErrors || form.touched.faid) && form.fieldErrors.faid ) ? 'input-error' : ''
      }
      value={form.values.faid as number ?? ''}
      onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/gm, '');
        form.handleOnChange('faid')(value === '' ? undefined : parseInt(value));
      }}
      onFocus={form.handleOnFocus('faid')}
      onBlur={form.handleOnBlur('faid')}
      inputMode='numeric'
    />
    {(showFormErrors || form.touched.faid) && form.fieldErrors.faid &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.faid.message.key}
        dict={form.fieldErrors.faid.message.dict}
      />
    }
  </>);
}

export function TargetAddr({ t }: { t: TFunction }) {
  const form = useAtomValue(assetFreezeFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <TextField label={t('fields.fadd.label')}
      name='fadd'
      id='fadd-input'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.fadd.placeholder')}
      containerId='fadd-field'
      containerClass='mt-4'
      inputClass={
        ((showFormErrors || form.touched.fadd) && form.fieldErrors.fadd ) ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.fadd as string}
      onChange={(e) => form.handleOnChange('fadd')(e.target.value)}
      onFocus={form.handleOnFocus('fadd')}
      onBlur={form.handleOnBlur('fadd')}
    />
    {(showFormErrors || form.touched.fadd) && form.fieldErrors.fadd &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.fadd.message.key}
        dict={form.fieldErrors.fadd.message.dict}
      />
    }
  </>);
}

export function Freeze({ t }: { t: TFunction }) {
  const preset = useSearchParams().get(Preset.ParamName);
  const form = useAtomValue(assetFreezeFormControlAtom);
  // If creation transaction
  return (
    <ToggleField label={t('fields.afrz.label')}
      name='afrz'
      id='afrz-input'
      inputInsideLabel={true}
      containerId='afrz-field'
      containerClass='mt-4 max-w-xs'
      inputClass='toggle-primary'
      disabled={preset === Preset.AssetFreeze || preset === Preset.AssetUnfreeze}
      value={!!form.values.afrz}
      onChange={(e) => form.handleOnChange('afrz')(e.target.checked)}
    />
  );
}
