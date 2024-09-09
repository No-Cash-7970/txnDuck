import { useSearchParams } from 'next/navigation';
import { FieldErrorMessage, TextField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {TransactionType } from 'algosdk';
import {
  ADDRESS_LENGTH,
  Preset,
  generalFormControlAtom,
  showFormErrorsAtom,
  tipContentClass,
  tipBtnClass,
} from '@/app/lib/txn-data';
import ConnectWalletFieldWidget from '../../wallet/WalletFieldWidget';

export default function Sender({ t }: { t: TFunction }) {
  const form = useAtomValue(generalFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  const searchParams = useSearchParams();
  const preset = searchParams.get(Preset.ParamName);
  let tip = t('fields.snd.tip');

  // Some presets have a different explanation of the sender in the tip message
  if (form.values.txnType === TransactionType.pay) {
    tip = t('fields.snd.tip_pay');
  } else if (preset === Preset.AssetClawback) {
    tip = t('fields.snd.tip_clawback');
  } else if (preset === Preset.AssetOptIn || preset === Preset.AppOptIn) {
    tip = t('fields.snd.tip_opt_in');
  } else if (preset === Preset.AssetOptOut) {
    tip = t('fields.snd.tip_opt_out');
  }

  return (<>
    <TextField label={t('fields.snd.label')}
      name='snd'
      id='snd-input'
      tip={{
        btnIcon: 'info',
        content: tip,
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.snd.placeholder')}
      containerId='snd-field'
      containerClass='mt-4'
      inputClass={
        ((showFormErrors || form.touched.snd) && form.fieldErrors.snd) ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.snd as string}
      onChange={(e) => form.handleOnChange('snd')(e.target.value)}
      onFocus={form.handleOnFocus('snd')}
      onBlur={form.handleOnBlur('snd')}
    />
    {(showFormErrors || form.touched.snd) && form.fieldErrors.snd &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.snd.message.key}
        dict={form.fieldErrors.snd.message.dict}
      />
    }
    {/* Show wallet widget when either
      * (1) the `snd` query parameter is NOT set
      * (2) or the `snd` query parameter is set AND the field has been touched
      */}
    {(!searchParams.get('snd') || form.touched.snd) &&
      <ConnectWalletFieldWidget t={t} setvalfn={form.handleOnChange('snd')} />
    }
  </>);
}
