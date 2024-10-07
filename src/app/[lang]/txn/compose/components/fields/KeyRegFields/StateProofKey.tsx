import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import { FieldErrorMessage, TextAreaField } from '@/app/[lang]/components/form';
import {
  Preset,
  keyRegFormControlAtom,
  presetAtom,
  showFormErrorsAtom,
  sprfkeyConditionalRequireAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';

export default function StateProofKey({ t }: { t: TFunction }) {
  const form = useAtomValue(keyRegFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const sprfkeyCondReqGroup = useAtomValue(sprfkeyConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (!form.values.nonpart && <>
    <TextAreaField label={t('fields.sprfkey.label')}
      name='sprfkey'
      id='sprfkey-input'
      tip={{
        content: t('fields.sprfkey.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={!!(form.values.votekey || form.values.selkey || form.values.sprfkey
        || form.values.votefst || form.values.votelst || form.values.votekd
        || preset === Preset.RegOnline
      )}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.sprfkey.placeholder')}
      containerId='sprfkey-field'
      containerClass='mt-4 max-w-lg'
      inputClass={((showFormErrors || form.touched.sprfkey) &&
          (form.fieldErrors.sprfkey || (!sprfkeyCondReqGroup.isValid && sprfkeyCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      value={form.values.sprfkey as string}
      onChange={(e) => form.handleOnChange('sprfkey')(e.target.value)}
      onFocus={form.handleOnFocus('sprfkey')}
      onBlur={form.handleOnBlur('sprfkey')}
    />
    {(showFormErrors || form.touched.sprfkey) && form.fieldErrors.sprfkey &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.sprfkey.message.key}
        dict={form.fieldErrors.sprfkey.message.dict}
      />
    }
    {(showFormErrors || form.touched.sprfkey) && !sprfkeyCondReqGroup.isValid
      && sprfkeyCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(sprfkeyCondReqGroup.error as any).message.key}
        dict={(sprfkeyCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}
