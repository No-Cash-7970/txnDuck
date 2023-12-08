import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { TextField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  Preset,
  assetFreezeFormControlAtom,
  presetAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';
import FieldErrorMessage from '../FieldErrorMessage';

export default function AssetId({ t }: { t: TFunction }) {
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
      tip={{
        content: t('fields.faid.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
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
