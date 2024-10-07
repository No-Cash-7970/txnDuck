import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import { FieldErrorMessage, TextField } from '@/app/[lang]/components/form';
import {
  Preset,
  keyRegFormControlAtom,
  presetAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
  votekeyConditionalRequireAtom,
} from '@/app/lib/txn-data';

export default function VoteKey({ t }: { t: TFunction }) {
  const form = useAtomValue(keyRegFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const votekeyCondReqGroup = useAtomValue(votekeyConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (!form.values.nonpart && <>
    <TextField label={t('fields.votekey.label')}
      name='votekey'
      id='votekey-input'
      tip={{
        content: t('fields.votekey.tip'),
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
      placeholder={t('fields.votekey.placeholder')}
      containerId='votekey-field'
      containerClass='mt-4 max-w-lg'
      inputClass={((showFormErrors || form.touched.votekey) &&
          (form.fieldErrors.votekey || (!votekeyCondReqGroup.isValid && votekeyCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      value={form.values.votekey as string}
      onChange={(e) => form.handleOnChange('votekey')(e.target.value)}
      onFocus={form.handleOnFocus('votekey')}
      onBlur={form.handleOnBlur('votekey')}
    />
    {(showFormErrors || form.touched.votekey) && form.fieldErrors.votekey &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.votekey.message.key}
        dict={form.fieldErrors.votekey.message.dict}
      />
    }
    {(showFormErrors || form.touched.votekey) && !votekeyCondReqGroup.isValid
      && votekeyCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(votekeyCondReqGroup.error as any).message.key}
        dict={(votekeyCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}
