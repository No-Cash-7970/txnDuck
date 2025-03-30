import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import { FieldErrorMessage, NumberField } from '@/app/[lang]/components/form';
import {
  MAX_APP_GLOBALS,
  Preset,
  apgsNbsConditionalRequireAtom,
  applFormControlAtom,
  showFormErrorsAtom,
  maxAppGlobalsCheckAtom,
  presetAtom,
  tipBtnClass,
  tipContentClass
} from '@/app/lib/txn-data';

/** Number of Global Byte Slices field */
export default function GlobalByteSlices({ t }: { t: TFunction }) {
  const form = useAtomValue(applFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const apgsNbsCondReqGroup = useAtomValue(apgsNbsConditionalRequireAtom);
  const maxGlobalsCheckGroup = useAtomValue(maxAppGlobalsCheckAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <NumberField label={t('fields.apgs_nbs.label')}
      name='apgs_nbs'
      id='apgs_nbs-input'
      tip={{
        content: t('fields.apgs_nbs.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='apgs_nbs-field'
      containerClass='mt-6 max-w-xs'
      inputClass={(
          ((showFormErrors || form.touched.apgs_nbs) &&
            (form.fieldErrors.apgs_nbs
              || (!apgsNbsCondReqGroup.isValid && apgsNbsCondReqGroup.error))
          )
          || (!maxGlobalsCheckGroup.isValid && maxGlobalsCheckGroup.error)
        )
        ? 'input-error' : ''
      }
      min={0}
      max={MAX_APP_GLOBALS - (form.values.apgs_nui as number ?? 0)}
      step={1}
      value={form.values.apgs_nbs ?? ''}
      onChange={(e) =>
        form.handleOnChange('apgs_nbs')(
          e.target.value === '' ? undefined : parseInt(e.target.value)
        )
      }
      onFocus={form.handleOnFocus('apgs_nbs')}
      onBlur={form.handleOnBlur('apgs_nbs')}
    />
    {(showFormErrors || form.touched.apgs_nbs) && form.fieldErrors.apgs_nbs &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apgs_nbs.message.key}
        dict={form.fieldErrors.apgs_nbs.message.dict}
      />
    }
    {(showFormErrors || form.touched.apgs_nbs) &&
      !apgsNbsCondReqGroup.isValid && apgsNbsCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(apgsNbsCondReqGroup.error as any).message.key}
        dict={(apgsNbsCondReqGroup.error as any).message.dict}
      />
    }
    {!maxGlobalsCheckGroup.isValid && maxGlobalsCheckGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(maxGlobalsCheckGroup.error as any).message.key}
        dict={(maxGlobalsCheckGroup.error as any).message.dict}
      />
    }
  </>);
}
