import { NumberField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  MIN_TX_FEE,
  generalFormControlAtom,
  showFormErrorsAtom,
  tipContentClass,
  tipBtnClass,
} from '@/app/lib/txn-data';
import { microalgosToAlgos } from 'algosdk';
import FieldErrorMessage from '../FieldErrorMessage';

export default function Fee({ t }: { t: TFunction }) {
  const form = useAtomValue(generalFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <NumberField label={t('fields.fee.label')}
      name='fee'
      id='fee-input'
      tip={{
        content: t('fields.fee.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='fee-field'
      containerClass='mt-4 max-w-xs'
      inputClass={
        ((showFormErrors || form.touched.fee) && form.fieldErrors.fee) ? 'input-error' : ''
      }
      afterSideLabel={t('algo_other')}
      min={microalgosToAlgos(MIN_TX_FEE)}
      step={0.000001}
      helpMsg={t('fields.fee.help_msg', { count: microalgosToAlgos(MIN_TX_FEE) })}
      value={form.values.fee as number ?? ''}
      onChange={(e) =>
        form.handleOnChange('fee')(e.target.value === '' ? undefined : parseFloat(e.target.value))
      }
      onFocus={form.handleOnFocus('fee')}
      onBlur={form.handleOnBlur('fee')}
    />
    {(showFormErrors || form.touched.fee) && form.fieldErrors.fee &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.fee.message.key}
        dict={form.fieldErrors.fee.message.dict}
      />
    }
  </>);
}
