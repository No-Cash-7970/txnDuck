import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import { FieldErrorMessage, NumberField } from '@/app/[lang]/components/form';
import {
  Preset,
  keyRegFormControlAtom,
  presetAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
  votelstConditionalRequireAtom
} from '@/app/lib/txn-data';

export default function LastVoteRound({ t }: { t: TFunction }) {
  const form = useAtomValue(keyRegFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const votelstCondReqGroup = useAtomValue(votelstConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (!form.values.nonpart && <>
    <NumberField label={t('fields.votelst.label')}
      name='votelst'
      id='votelst-input'
      tip={{
        content: t('fields.votelst.tip'),
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
      containerId='votelst-field'
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || form.touched.votelst) &&
          (form.fieldErrors.votelst || (!votelstCondReqGroup.isValid && votelstCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      min={1}
      step={1}
      value={form.values.votelst as number ?? ''}
      onChange={(e) =>
        form.handleOnChange('votelst')(e.target.value === '' ? undefined : parseInt(e.target.value))
      }
      onFocus={form.handleOnFocus('votelst')}
      onBlur={form.handleOnBlur('votelst')}
    />
    {(showFormErrors || form.touched.votelst) && form.fieldErrors.votelst &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.votelst.message.key}
        dict={form.fieldErrors.votelst.message.dict}
      />
    }
    {(showFormErrors || form.touched.votelst) && !votelstCondReqGroup.isValid
      && votelstCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(votelstCondReqGroup.error as any).message.key}
        dict={(votelstCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}
