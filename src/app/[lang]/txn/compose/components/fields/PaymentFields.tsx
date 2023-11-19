/** Fields for the compose-transaction form that are for payment transactions */

import { useSearchParams } from 'next/navigation';
import { NumberField, TextField } from '@/app/[lang]/components/form';
import { IconAlertTriangle } from '@tabler/icons-react';
import { type TFunction } from 'i18next';
import { Trans } from 'react-i18next';
import { useAtom } from 'jotai';
import { ADDRESS_MAX_LENGTH, Preset, txnDataAtoms } from '@/app/lib/txn-data';

export function Receiver({ t }: { t: TFunction }) {
  const [rcv, setRcv] = useAtom(txnDataAtoms.rcv);
  return (
    <TextField label={t('fields.rcv.label')}
      name='rcv'
      id='rcv-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.rcv.placeholder')}
      containerClass='mt-4'
      maxLength={ADDRESS_MAX_LENGTH}
      value={rcv}
      onChange={(e) => setRcv(e.target.value)}
    />
  );
}

export function Amount({ t }: { t: TFunction }) {
  const [amt, setAmt] = useAtom(txnDataAtoms.amt);
  return (
    <NumberField label={t('fields.amt.label')}
      name='amt'
      id='amt-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerClass='mt-4 max-w-xs'
      afterSideLabel={t('algo_other')}
      min={0}
      step={0.000001}
      value={amt ?? ''}
      onChange={(e) => setAmt(e.target.value !== '' ? parseFloat(e.target.value) : undefined)}
    />
  );
}

/** The "Close To" field WITH the notice */
export function CloseTo({ t }: { t: TFunction }) {
  return (
    <>
      <CloseToField t={t} />

      <div className='alert alert-warning not-prose my-1'>
        <IconAlertTriangle aria-hidden />
        <span className='text-start'>
          <Trans t={t} i18nKey='fields.close.warning'>
            if_given <strong>all_funds_will_be_sent_to_given_address</strong>
            make_sure_you_know_what_you_are_doing
          </Trans>
        </span>
      </div>
    </>
  );
}

function CloseToField({ t }: { t: TFunction }) {
  const [close, setClose] = useAtom(txnDataAtoms.close);
  const preset = useSearchParams().get(Preset.ParamName);
  return (
    <TextField label={t('fields.close.label')}
      name='close'
      id='close-field'
      required={preset === Preset.CloseAccount}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.close.placeholder')}
      containerClass='mt-4'
      value={close}
      onChange={(e) => setClose(e.target.value)}
    />
  );
}
