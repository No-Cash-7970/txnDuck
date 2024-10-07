import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import { FieldErrorMessage, NumberField } from '@/app/[lang]/components/form';
import {
  MAX_APP_LOCALS,
  Preset,
  aplsNuiConditionalRequireAtom,
  applFormControlAtom,
  showFormErrorsAtom,
  maxAppLocalsCheckAtom,
  presetAtom,
  tipBtnClass,
  tipContentClass
} from '@/app/lib/txn-data';

/** Number of Local Integers field */
export default function LocalInts({ t }: { t: TFunction }) {
  const form = useAtomValue(applFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const aplsNuiCondReqGroup = useAtomValue(aplsNuiConditionalRequireAtom);
  const maxLocalsCheckGroup = useAtomValue(maxAppLocalsCheckAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <NumberField label={t('fields.apls_nui.label')}
      name='apls_nui'
      id='apls_nui-input'
      tip={{
        content: t('fields.apls_nui.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='apls_nui-field'
      containerClass='mt-4 max-w-xs'
      inputClass={(
          ((showFormErrors || form.touched.apls_nui) &&
            (form.fieldErrors.apls_nui
              || (!aplsNuiCondReqGroup.isValid && aplsNuiCondReqGroup.error))
          )
          || (!maxLocalsCheckGroup.isValid && maxLocalsCheckGroup.error)
        )
        ? 'input-error' : ''
      }
      min={0}
      max={MAX_APP_LOCALS - (form.values.apls_nbs as number ?? 0)}
      step={1}
      value={form.values.apls_nui ?? ''}
      onChange={(e) =>
        form.handleOnChange('apls_nui')(
          e.target.value === '' ? undefined : parseInt(e.target.value)
        )
      }
      onFocus={form.handleOnFocus('apls_nui')}
      onBlur={form.handleOnBlur('apls_nui')}
    />
    {(showFormErrors || form.touched.apls_nui) && form.fieldErrors.apls_nui &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apls_nui.message.key}
        dict={form.fieldErrors.apls_nui.message.dict}
      />
    }
    {(showFormErrors || form.touched.apls_nui) &&
      !aplsNuiCondReqGroup.isValid && aplsNuiCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(aplsNuiCondReqGroup.error as any).message.key}
        dict={(aplsNuiCondReqGroup.error as any).message.dict}
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
