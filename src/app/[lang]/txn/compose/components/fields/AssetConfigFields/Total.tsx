import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { NumberField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  Preset,
  aparTConditionalRequireAtom,
  assetConfigFormControlAtom,
  presetAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';
import FieldErrorMessage from '../FieldErrorMessage';

export default function Total({ t }: { t: TFunction }) {
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
      min={0}
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
