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
  votekdConditionalRequireAtom,
} from '@/app/lib/txn-data';
import { useEffect } from 'react';
import FieldErrorMessage from '../FieldErrorMessage';

export default function KeyDilution({ t }: { t: TFunction }) {
  const form = useAtomValue(keyRegFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const votekdCondReqGroup = useAtomValue(votekdConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (!form.values.nonpart && <>
    <NumberField label={t('fields.votekd.label')}
      name='votekd'
      id='votekd-input'
      tip={{
        content: t('fields.votekd.tip'),
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
      containerId='votekd-field'
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || form.touched.votekd) &&
          (form.fieldErrors.votekd || (!votekdCondReqGroup.isValid && votekdCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      min={0}
      step={1}
      value={form.values.votekd as number ?? ''}
      onChange={(e) =>
        form.handleOnChange('votekd')(e.target.value === '' ? undefined : parseInt(e.target.value))
      }
      onFocus={form.handleOnFocus('votekd')}
      onBlur={form.handleOnBlur('votekd')}
    />
    {(showFormErrors || form.touched.votekd) && form.fieldErrors.votekd &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.votekd.message.key}
        dict={form.fieldErrors.votekd.message.dict}
      />
    }
    {(showFormErrors || form.touched.votekd) && !votekdCondReqGroup.isValid
      && votekdCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(votekdCondReqGroup.error as any).message.key}
        dict={(votekdCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}
