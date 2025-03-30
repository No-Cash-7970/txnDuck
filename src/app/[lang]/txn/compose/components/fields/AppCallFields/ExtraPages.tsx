import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import { FieldErrorMessage, NumberField } from '@/app/[lang]/components/form';
import {
  MAX_APP_EXTRA_PAGES,
  Preset,
  apepConditionalRequireAtom,
  applFormControlAtom,
  showFormErrorsAtom,
  presetAtom,
  tipBtnClass,
  tipContentClass
} from '@/app/lib/txn-data';

/** Number of Application Extra Pages field */
export default function ExtraPages({ t }: { t: TFunction }) {
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
      tip={{
        content: t('fields.apep.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='apep-field'
      containerClass='mt-6 max-w-xs'
      inputClass={((showFormErrors || form.touched.apep) &&
          (form.fieldErrors.apep || (!apepCondReqGroup.isValid && apepCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      min={0}
      max={MAX_APP_EXTRA_PAGES}
      step={1}
      value={form.values.apep as number ?? ''}
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
