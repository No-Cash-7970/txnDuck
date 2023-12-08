import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { TextAreaField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  Preset,
  applFormControlAtom,
  apsuConditionalRequireAtom,
  showFormErrorsAtom,
  presetAtom,
  tipBtnClass,
  tipContentClass
} from '@/app/lib/txn-data';
import FieldErrorMessage from '../FieldErrorMessage';

export default function ClearStateProg({ t }: { t: TFunction }) {
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
      tip={{
        content: t('fields.apsu.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
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
