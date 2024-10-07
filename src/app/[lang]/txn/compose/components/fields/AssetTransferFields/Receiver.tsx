import { useSearchParams } from 'next/navigation';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import { FieldErrorMessage, TextField } from '@/app/[lang]/components/form';
import {
  ADDRESS_LENGTH,
  assetTransferFormControlAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';
import ConnectWalletFieldWidget from '../../wallet/WalletFieldWidget';

export default function Receiver({ t }: { t: TFunction }) {
  const form = useAtomValue(assetTransferFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  const searchParams = useSearchParams();
  return (<>
    <TextField label={t('fields.arcv.label')}
      name='arcv'
      id='arcv-input'
      tip={{
        content: t('fields.arcv.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.arcv.placeholder')}
      containerId='arcv-field'
      containerClass='mt-4'
      inputClass={
        ((showFormErrors || form.touched.arcv) && form.fieldErrors.arcv) ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.arcv as string}
      onChange={(e) => form.handleOnChange('arcv')(e.target.value)}
      onFocus={form.handleOnFocus('arcv')}
      onBlur={form.handleOnBlur('arcv')}
    />
    {(showFormErrors || form.touched.arcv) && form.fieldErrors.arcv &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.arcv.message.key}
        dict={form.fieldErrors.arcv.message.dict}
      />
    }
    {/* Show wallet widget when either
      * (1) the `arcv` query parameter is NOT set,
      * (2) the `xaid` query parameter is NOT set,
      * (3) or the `arcv` query parameter is set AND the field has been touched
      */}
    {(!searchParams.get('arcv') || !searchParams.get('xaid') || form.touched.arcv) &&
      <ConnectWalletFieldWidget t={t} setvalfn={form.handleOnChange('arcv')} />
    }
  </>);
}
