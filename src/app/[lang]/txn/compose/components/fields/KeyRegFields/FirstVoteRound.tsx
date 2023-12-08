import { useSearchParams } from 'next/navigation';
import { NumberField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  Preset,
  keyRegFormControlAtom,
  presetAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
  votefstConditionalRequireAtom,
} from '@/app/lib/txn-data';
import { useEffect } from 'react';
import FieldErrorMessage from '../FieldErrorMessage';

export default function FirstVoteRound({ t }: { t: TFunction }) {
  const form = useAtomValue(keyRegFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const votefstCondReqGroup = useAtomValue(votefstConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (!form.values.nonpart && <>
    <NumberField label={t('fields.votefst.label')}
      name='votefst'
      id='votefst-input'
      tip={{
        content: t('fields.votefst.tip'),
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
      containerId='votefst-field'
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || form.touched.votefst) &&
          (form.fieldErrors.votefst || (!votefstCondReqGroup.isValid && votefstCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      min={1}
      step={1}
      value={form.values.votefst as number ?? ''}
      onChange={(e) =>
        form.handleOnChange('votefst')(e.target.value === '' ? undefined : parseInt(e.target.value))
      }
      onFocus={form.handleOnFocus('votefst')}
      onBlur={form.handleOnBlur('votefst')}
    />
    {(showFormErrors || form.touched.votefst) && form.fieldErrors.votefst &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.votefst.message.key}
        dict={form.fieldErrors.votefst.message.dict}
      />
    }
    {(showFormErrors || form.touched.votefst) && !votefstCondReqGroup.isValid
      && votefstCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(votefstCondReqGroup.error as any).message.key}
        dict={(votefstCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}
