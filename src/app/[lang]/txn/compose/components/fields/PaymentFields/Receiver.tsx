import { useSearchParams } from 'next/navigation';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import { FieldErrorMessage, TextField } from '@/app/[lang]/components/form';
import {
  ADDRESS_LENGTH,
  paymentFormControlAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass
} from '@/app/lib/txn-data';
import ConnectWalletFieldWidget from '../../wallet/WalletFieldWidget';

export default function Receiver({ t }: { t: TFunction }) {
  const form = useAtomValue(paymentFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  const searchParams = useSearchParams();
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
    {/* Show wallet widget when either
      * (1) the `rcv` query parameter is NOT set
      * (2) or the `rcv` query parameter is set AND the field has been touched
      */}
    {(!searchParams.get('rcv') || form.touched.rcv) &&
      <ConnectWalletFieldWidget t={t} setvalfn={form.handleOnChange('rcv')} />
    }
  </>);
}
