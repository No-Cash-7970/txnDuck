import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FieldErrorMessage, NumberField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  MAX_APP_LOCALS,
  Preset,
  aplsNbsConditionalRequireAtom,
  applFormControlAtom,
  showFormErrorsAtom,
  maxAppLocalsCheckAtom,
  presetAtom,
  tipBtnClass,
  tipContentClass
} from '@/app/lib/txn-data';

/** Number of Local Byte Slices field */
export default function LocalByteSlices({ t }: { t: TFunction }) {
  const form = useAtomValue(applFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const aplsNbsCondReqGroup = useAtomValue(aplsNbsConditionalRequireAtom);
  const maxLocalsCheckGroup = useAtomValue(maxAppLocalsCheckAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <NumberField label={t('fields.apls_nbs.label')}
      name='apls_nbs'
      id='apls_nbs-input'
      tip={{
        content: t('fields.apls_nbs.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='apls_nbs-field'
      containerClass='mt-4 max-w-xs'
      inputClass={(
          ((showFormErrors || form.touched.apls_nbs) &&
            (form.fieldErrors.apls_nbs
              || (!aplsNbsCondReqGroup.isValid && aplsNbsCondReqGroup.error))
          )
          || (!maxLocalsCheckGroup.isValid && maxLocalsCheckGroup.error)
        )
        ? 'input-error' : ''
      }
      min={0}
      max={MAX_APP_LOCALS - (form.values.apls_nui as number ?? 0)}
      step={1}
      value={form.values.apls_nbs ?? ''}
      onChange={(e) =>
        form.handleOnChange('apls_nbs')(
          e.target.value === '' ? undefined : parseInt(e.target.value)
        )
      }
      onFocus={form.handleOnFocus('apls_nbs')}
      onBlur={form.handleOnBlur('apls_nbs')}
    />
    {(showFormErrors || form.touched.apls_nbs) && form.fieldErrors.apls_nbs &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apls_nbs.message.key}
        dict={form.fieldErrors.apls_nbs.message.dict}
      />
    }
    {(showFormErrors || form.touched.apls_nbs) &&
      !aplsNbsCondReqGroup.isValid && aplsNbsCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(aplsNbsCondReqGroup.error as any).message.key}
        dict={(aplsNbsCondReqGroup.error as any).message.dict}
      />
    }
    {!maxLocalsCheckGroup.isValid && maxLocalsCheckGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(maxLocalsCheckGroup.error as any).message.key}
        dict={(maxLocalsCheckGroup.error as any).message.dict}
      />
    }
  </>);
}
