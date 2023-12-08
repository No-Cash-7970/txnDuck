import { useSearchParams } from 'next/navigation';
import { TextField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  Preset,
  keyRegFormControlAtom,
  presetAtom,
  selkeyConditionalRequireAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';
import { useEffect } from 'react';
import FieldErrorMessage from '../FieldErrorMessage';

export default function SelectionKey({ t }: { t: TFunction }) {
  const form = useAtomValue(keyRegFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const selkeyCondReqGroup = useAtomValue(selkeyConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (!form.values.nonpart && <>
    <TextField label={t('fields.selkey.label')}
      name='selkey'
      id='selkey-input'
      tip={{
        content: t('fields.selkey.tip'),
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
      placeholder={t('fields.selkey.placeholder')}
      containerId='selkey-field'
      containerClass='mt-4 max-w-lg'
      inputClass={((showFormErrors || form.touched.selkey) &&
          (form.fieldErrors.selkey || (!selkeyCondReqGroup.isValid && selkeyCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      value={form.values.selkey as string}
      onChange={(e) => form.handleOnChange('selkey')(e.target.value)}
      onFocus={form.handleOnFocus('selkey')}
      onBlur={form.handleOnBlur('selkey')}
    />
    {(showFormErrors || form.touched.selkey) && form.fieldErrors.selkey &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.selkey.message.key}
        dict={form.fieldErrors.selkey.message.dict}
      />
    }
    {(showFormErrors || form.touched.selkey) && !selkeyCondReqGroup.isValid
      && selkeyCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(selkeyCondReqGroup.error as any).message.key}
        dict={(selkeyCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}
