import { useSearchParams } from 'next/navigation';
import { FieldErrorMessage, SelectField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  Preset,
  generalFormControlAtom,
  showFormErrorsAtom,
  tipContentClass,
  tipBtnClass,
} from '@/app/lib/txn-data';
import { TransactionType } from 'algosdk';

export default function TxnType({ t }: { t: TFunction }) {
  const form = useAtomValue(generalFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  return (<>
    <SelectField label={t('fields.type.label')}
      name='type'
      id='txnType-input'
      tip={{
        content: t('fields.type.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      containerId='txnType-field'
      containerClass='max-w-xs'
      inputClass={
        ((showFormErrors || form.touched.txnType) && form.fieldErrors.txnType) ? 'select-error' : ''
      }
      placeholder={t('fields.type.placeholder')}
      disabled={!!preset}
      options={[
        { value: TransactionType.pay, text: t('fields.type.options.pay') },
        { value: TransactionType.axfer, text: t('fields.type.options.axfer') },
        { value: TransactionType.acfg, text: t('fields.type.options.acfg') },
        { value: TransactionType.afrz, text: t('fields.type.options.afrz') },
        { value: TransactionType.appl, text: t('fields.type.options.appl') },
        { value: TransactionType.keyreg, text: t('fields.type.options.keyreg') },
      ]}
      value={form.values.txnType as string}
      onChange={(e) => form.handleOnChange('txnType')(e.target.value)}
      onFocus={form.handleOnFocus('txnType')}
      onBlur={form.handleOnBlur('txnType')}
    />
    {(showFormErrors || form.touched.txnType) && form.fieldErrors.txnType &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.txnType.message.key}
        dict={form.fieldErrors.txnType.message.dict}
      />
    }
  </>);
}
