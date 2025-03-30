import { useSearchParams } from 'next/navigation';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import { OnApplicationComplete } from 'algosdk';
import { FieldErrorMessage, SelectField } from '@/app/[lang]/components/form';
import {
  Preset,
  applFormControlAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass
} from '@/app/lib/txn-data';

export default function OnComplete({ t }: { t: TFunction }) {
  const form = useAtomValue(applFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <SelectField label={t('fields.apan.label')}
      name='apan'
      id='apan-input'
      tip={{
        content: t('fields.apan.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      containerId='apan-field'
      containerClass='mt-6 max-w-xs'
      inputClass={((showFormErrors || form.touched.apan) && form.fieldErrors.apan)
        ? 'select-error' : ''
      }
      disabled={!!preset}
      options={[
        { value: OnApplicationComplete.NoOpOC, text: t('fields.apan.options.no_op') },
        { value: OnApplicationComplete.OptInOC, text: t('fields.apan.options.opt_in') },
        { value: OnApplicationComplete.UpdateApplicationOC, text: t('fields.apan.options.update') },
        { value: OnApplicationComplete.ClearStateOC, text: t('fields.apan.options.clear') },
        { value: OnApplicationComplete.CloseOutOC, text: t('fields.apan.options.close_out') },
        { value: OnApplicationComplete.DeleteApplicationOC, text: t('fields.apan.options.delete') },
      ]}
      value={form.values.apan as string}
      onChange={(e) => form.handleOnChange('apan')(e.target.value)}
      onFocus={form.handleOnFocus('apan')}
      onBlur={form.handleOnBlur('apan')}
    />
    {form.touched.apan && form.fieldErrors.apan &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apan.message.key}
        dict={form.fieldErrors.apan.message.dict}
      />
    }
  </>);
}
