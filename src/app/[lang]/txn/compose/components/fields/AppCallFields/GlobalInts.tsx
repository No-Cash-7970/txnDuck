import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import { FieldErrorMessage, NumberField } from '@/app/[lang]/components/form';
import {
  MAX_APP_GLOBALS,
  Preset,
  apgsNuiConditionalRequireAtom,
  applFormControlAtom,
  showFormErrorsAtom,
  maxAppGlobalsCheckAtom,
  presetAtom,
  tipBtnClass,
  tipContentClass
} from '@/app/lib/txn-data';

/** Number of Global Integers field */
export default function GlobalInts({ t }: { t: TFunction }) {
  const form = useAtomValue(applFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const apgsNuiCondReqGroup = useAtomValue(apgsNuiConditionalRequireAtom);
  const maxGlobalsCheckGroup = useAtomValue(maxAppGlobalsCheckAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <NumberField label={t('fields.apgs_nui.label')}
      name='apgs_nui'
      id='apgs_nui-input'
      tip={{
        content: t('fields.apgs_nui.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='apgs_nui-field'
      containerClass='mt-4 max-w-xs'
      inputClass={(
          ((showFormErrors || form.touched.apgs_nui) &&
            (form.fieldErrors.apgs_nui
              || (!apgsNuiCondReqGroup.isValid && apgsNuiCondReqGroup.error))
          )
          || (!maxGlobalsCheckGroup.isValid && maxGlobalsCheckGroup.error)
        )
        ? 'input-error' : ''
      }
      min={0}
      max={MAX_APP_GLOBALS - (form.values.apgs_nbs as number ?? 0)}
      step={1}
      value={form.values.apgs_nui as number ?? ''}
      onChange={(e) =>
        form.handleOnChange('apgs_nui')(
          e.target.value === '' ? undefined : parseInt(e.target.value)
        )
      }
      onFocus={form.handleOnFocus('apgs_nui')}
      onBlur={form.handleOnBlur('apgs_nui')}
    />
    {(showFormErrors || form.touched.apgs_nui) && form.fieldErrors.apgs_nui &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apgs_nui.message.key}
        dict={form.fieldErrors.apgs_nui.message.dict}
      />
    }
    {(showFormErrors || form.touched.apgs_nui) &&
      !apgsNuiCondReqGroup.isValid && apgsNuiCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(apgsNuiCondReqGroup.error as any).message.key}
        dict={(apgsNuiCondReqGroup.error as any).message.dict}
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
