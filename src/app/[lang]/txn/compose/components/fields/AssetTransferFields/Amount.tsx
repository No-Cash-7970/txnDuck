import { NumberField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  assetTransferFormControlAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';
import FieldErrorMessage from '../FieldErrorMessage';

export default function Amount({ t }: { t: TFunction }) {
  const form = useAtomValue(assetTransferFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <NumberField label={t('fields.aamt.label')}
      name='aamt'
      id='aamt-input'
      tip={{
        content: t('fields.aamt.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='aamt-field'
      containerClass='mt-4 max-w-xs'
      inputClass={
        ((showFormErrors || form.touched.aamt) && form.fieldErrors.aamt) ? 'input-error' : ''
      }
      afterSideLabel={t('unit_other')}
      min={0}
      step={0.000001}
      value={form.values.aamt ?? ''}
      onChange={(e) => form.handleOnChange('aamt')(e.target.value)}
      onFocus={form.handleOnFocus('aamt')}
      onBlur={form.handleOnBlur('aamt')}
    />
    {(showFormErrors || form.touched.aamt) && form.fieldErrors.aamt &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.aamt.message.key}
        dict={form.fieldErrors.aamt.message.dict}
      />
    }
  </>);
}
