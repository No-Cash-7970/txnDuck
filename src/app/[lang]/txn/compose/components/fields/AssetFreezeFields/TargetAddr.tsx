import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { TextField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  ADDRESS_LENGTH,
  Preset,
  assetFreezeFormControlAtom,
  presetAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';
import FieldErrorMessage from '../FieldErrorMessage';

export default function TargetAddr({ t }: { t: TFunction }) {
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
      tip={{
        content: t('fields.fadd.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
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
