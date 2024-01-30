import { FieldErrorMessage, TextField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  ADDRESS_LENGTH,
  paymentFormControlAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass
} from '@/app/lib/txn-data';

export default function Receiver({ t }: { t: TFunction }) {
  const form = useAtomValue(paymentFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.rcv.label')}
      name='rcv'
      id='rcv-input'
      tip={{
        content: t('fields.rcv.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.rcv.placeholder')}
      containerId='rcv-field'
      containerClass='mt-4'
      inputClass={
        ((showFormErrors || form.touched.rcv) && form.fieldErrors.rcv) ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.rcv as string}
      onChange={(e) => form.handleOnChange('rcv')(e.target.value)}
      onFocus={form.handleOnFocus('rcv')}
      onBlur={form.handleOnBlur('rcv')}
    />
    {(showFormErrors || form.touched.rcv) && form.fieldErrors.rcv &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.rcv.message.key}
        dict={form.fieldErrors.rcv.message.dict}
      />
    }
  </>);
}
