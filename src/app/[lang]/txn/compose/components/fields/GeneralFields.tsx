/** Fields for the compose-transaction form that every transaction has */

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { NumberField, SelectField, TextAreaField, TextField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { Trans } from 'react-i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  ADDRESS_LENGTH,
  LEASE_MAX_LENGTH,
  NOTE_MAX_LENGTH,
  MIN_TX_FEE,
  Preset,
  generalFormControlAtom,
  fvLvFormControlAtom,
  presetAtom,
  rekeyConditionalRequireAtom,
  showFormErrorsAtom,
  tipContentClass,
  tipBtnClass,
} from '@/app/lib/txn-data';
import { IconAlertTriangle } from '@tabler/icons-react';
import {TransactionType, microalgosToAlgos } from 'algosdk';
import FieldErrorMessage from './FieldErrorMessage';

export function TxnType({ t }: { t: TFunction }) {
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

export function Sender({ t }: { t: TFunction }) {
  const form = useAtomValue(generalFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  let tip = t('fields.snd.tip');

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
  </>);
}

export function Fee({ t }: { t: TFunction }) {
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

export function Note({ t }: { t: TFunction }) {
  const form = useAtomValue(generalFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextAreaField label={t('fields.note.label')}
      name='note'
      id='note-input'
      tip={{
        content: t('fields.note.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      placeholder={t('fields.note.placeholder')}
      containerId='note-field'
      containerClass='mt-4 max-w-lg'
      inputClass={
        ((showFormErrors || form.touched.note) && form.fieldErrors.note) ? 'textarea-error' : ''
      }
      maxLength={NOTE_MAX_LENGTH}
      value={form.values.note as string}
      onChange={(e) => form.handleOnChange('note')(e.target.value)}
      onFocus={form.handleOnFocus('note')}
      onBlur={form.handleOnBlur('note')}
    />
    {(showFormErrors || form.touched.note) && form.fieldErrors.note &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.note.message.key}
        dict={form.fieldErrors.note.message.dict}
      />
    }
  </>);
}

export function FirstValid({ t }: { t: TFunction }) {
  const form = useAtomValue(generalFormControlAtom);
  const fvLvGroup = useAtomValue(fvLvFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <NumberField label={t('fields.fv.label')}
      name='fv'
      id='fv-input'
      tip={{
        content: t('fields.fv.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='fv-field'
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || form.touched.fv) &&
          (form.fieldErrors.fv || (!fvLvGroup.isValid && fvLvGroup.error))
        )
        ? 'input-error' : ''
      }
      min={1}
      step={1}
      value={form.values.fv as number ?? ''}
      onChange={(e) =>
        form.handleOnChange('fv')(e.target.value === '' ? undefined : parseInt(e.target.value))
      }
      onFocus={form.handleOnFocus('fv')}
      onBlur={form.handleOnBlur('fv')}
    />
    {(showFormErrors || form.touched.fv) && form.fieldErrors.fv &&
      <FieldErrorMessage
        t={t} i18nkey={form.fieldErrors.fv.message.key}
        dict={form.fieldErrors.fv.message.dict}
      />
    }
    {!fvLvGroup.isValid && fvLvGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(fvLvGroup.error as any).message.key}
        dict={(fvLvGroup.error as any).message.dict}
      />
    }
  </>);
}

export function LastValid({ t }: { t: TFunction }) {
  const form = useAtomValue(generalFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <NumberField label={t('fields.lv.label')}
      name='lv'
      id='lv-input'
      tip={{
        content: t('fields.lv.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='lv-field'
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || form.touched.lv) && form.fieldErrors.lv) ? 'input-error' : ''}
      min={1}
      step={1}
      value={form.values.lv as number ?? ''}
      onChange={(e) =>
        form.handleOnChange('lv')(e.target.value === '' ? undefined : parseInt(e.target.value))
      }
      onFocus={form.handleOnFocus('lv')}
      onBlur={form.handleOnBlur('lv')}
    />
    {(showFormErrors || form.touched.lv) && form.fieldErrors.lv &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.lv.message.key}
        dict={form.fieldErrors.lv.message.dict}
      />
    }
  </>);
}

export function Lease({ t }: { t: TFunction }) {
  const form = useAtomValue(generalFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.lx.label')}
      name='lx'
      id='lx-input'
      tip={{
        content: t('fields.lx.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      containerId='lx-field'
      containerClass='mt-4 max-w-sm'
      inputClass={((showFormErrors || form.touched.lx) && form.fieldErrors.lx) ? 'input-error' : ''}
      maxLength={LEASE_MAX_LENGTH}
      value={form.values.lx as string}
      onChange={(e) => form.handleOnChange('lx')(e.target.value)}
      onFocus={form.handleOnFocus('lx')}
      onBlur={form.handleOnBlur('lx')}
    />
    {(showFormErrors || form.touched.lx) && form.fieldErrors.lx &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.lx.message.key}
        dict={form.fieldErrors.lx.message.dict}
      />
    }
  </>);
}

/** Rekey field WITH the notice */
export function Rekey({ t }: { t: TFunction }) {
  return (
    <>
      <RekeyInput t={t} />

      <div className='alert alert-warning not-prose my-1'>
        <IconAlertTriangle aria-hidden />
        <span className='text-start'>
          <Trans t={t} i18nKey='fields.rekey.warning'>
            <strong>rekeying_can_result_in_loss</strong> learn_more_at
            <a
              href='https://developer.algorand.org/docs/get-details/accounts/rekey'
              className='underline'
            >
              algo_docs
            </a>.
          </Trans>
        </span>
      </div>
    </>
  );
}

export function RekeyInput({ t }: { t: TFunction }) {
  const form = useAtomValue(generalFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const rekeyCondReqGroup = useAtomValue(rekeyConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <TextField label={t('fields.rekey.label')}
      name='rekey'
      id='rekey-input'
      tip={{
        content: t('fields.rekey.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={preset === Preset.RekeyAccount}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.rekey.placeholder')}
      containerId='rekey-field'
      containerClass='mt-4'
      inputClass={((showFormErrors || form.touched.rekey) &&
          (form.fieldErrors.rekey || (!rekeyCondReqGroup.isValid && rekeyCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.rekey as string}
      onChange={(e) => form.handleOnChange('rekey')(e.target.value)}
      onFocus={form.handleOnFocus('rekey')}
      onBlur={form.handleOnBlur('rekey')}
    />
    {(showFormErrors || form.touched.rekey) && form.fieldErrors.rekey &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.rekey.message.key}
        dict={form.fieldErrors.rekey.message.dict}
      />
    }
    {(showFormErrors || form.touched.rekey) && !rekeyCondReqGroup.isValid
      && rekeyCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(rekeyCondReqGroup.error as any).message.key}
        dict={(rekeyCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}
