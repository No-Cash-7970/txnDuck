import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { TextAreaField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  Preset,
  apapConditionalRequireAtom,
  applFormControlAtom,
  showFormErrorsAtom,
  presetAtom,
  tipBtnClass,
  tipContentClass
} from '@/app/lib/txn-data';
import FieldErrorMessage from '../FieldErrorMessage';

export default function ApprovalProg({ t }: { t: TFunction }) {
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
      tip={{
        content: t('fields.apap.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
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
