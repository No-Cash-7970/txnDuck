import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import { FieldErrorMessage, NumberField } from '@/app/[lang]/components/form';
import {
  MAX_DECIMAL_PLACES,
  Preset,
  aparDcConditionalRequireAtom,
  assetConfigFormControlAtom,
  presetAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';

/** Number of Decimal Places field */
export default function DecimalPlaces({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const aparDcCondReqGroup = useAtomValue(aparDcConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  // If creation transaction
  return (!form.values.caid && <>
    <NumberField label={t('fields.apar_dc.label')}
      name='apar_dc'
      id='apar_dc-input'
      tip={{
        content: t('fields.apar_dc.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='apar_dc-field'
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || form.touched.apar_dc) &&
          (form.fieldErrors.apar_dc || (!aparDcCondReqGroup.isValid && aparDcCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      min={0}
      max={MAX_DECIMAL_PLACES}
      step={1}
      value={(form.values.apar_dc as string) ?? ''}
      onChange={(e) =>
        form.handleOnChange('apar_dc')(e.target.value === '' ? undefined : parseInt(e.target.value))
      }
      onFocus={form.handleOnFocus('apar_dc')}
      onBlur={form.handleOnBlur('apar_dc')}
    />
    {(showFormErrors || form.touched.apar_dc) && form.fieldErrors.apar_dc &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_dc.message.key}
        dict={form.fieldErrors.apar_dc.message.dict}
      />
    }
    {(showFormErrors || form.touched.apar_dc) && !aparDcCondReqGroup.isValid
      && aparDcCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(aparDcCondReqGroup.error as any).message.key}
        dict={(aparDcCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}
