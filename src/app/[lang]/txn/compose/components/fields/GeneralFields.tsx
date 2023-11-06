/** Fields for the compose-transaction form that every transaction has */

import { NumberField, SelectField, TextAreaField, TextField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { Trans } from 'react-i18next';
import { useAtom } from 'jotai';
import { txnDataAtoms } from '@/app/lib/txn-data';
import { IconAlertTriangle } from '@tabler/icons-react';
import { TransactionType } from 'algosdk';

export function TxnType({ t }: { t: TFunction }) {
  const [txnType, setTxnType] = useAtom(txnDataAtoms.txnType);
  return (
    <SelectField label={t('fields.type.label')}
      name='type'
      id='type-field'
      required={true}
      requiredText={t('form.required')}
      containerClass='max-w-xs'
      placeholder={t('fields.type.placeholder')}
      options={[
        { value: TransactionType.pay, text: t('fields.type.options.pay') },
        { value: TransactionType.axfer, text: t('fields.type.options.axfer') },
        { value: TransactionType.acfg, text: t('fields.type.options.acfg') },
        { value: TransactionType.afrz, text: t('fields.type.options.afrz') },
        { value: TransactionType.appl, text: t('fields.type.options.appl') },
        { value: TransactionType.keyreg, text: t('fields.type.options.keyreg') },
      ]}
      value={txnType as string}
      onChange={(e) => setTxnType(e.target.value as TransactionType)}
    />
  );
}

export function Sender({ t }: { t: TFunction }) {
  const [snd, setSnd] = useAtom(txnDataAtoms.snd);
  return (
    <TextField label={t('fields.snd.label')}
      name='snd'
      id='snd-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.snd.placeholder')}
      containerClass='mt-4'
      value={snd}
      onChange={(e) => setSnd(e.target.value)}
    />
  );
}

export function Fee({ t }: { t: TFunction }) {
  const [fee, setFee] = useAtom(txnDataAtoms.fee);
  return (
    <NumberField label={t('fields.fee.label')}
      name='fee'
      id='fee-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerClass='mt-4 max-w-xs'
      afterSideLabel={t('algo_other')}
      min={0.001}
      step={0.000001}
      helpMsg={t('fields.fee.help_msg', { count: 0.001 })}
      value={fee ?? ''}
      onChange={(e) => setFee(parseFloat(e.target.value))}
    />
  );
}

export function Note({ t }: { t: TFunction }) {
  const [note, setNote] = useAtom(txnDataAtoms.note);
  return (
    <TextAreaField label={t('fields.note.label')}
      name='note'
      id='note-field'
      inputInsideLabel={false}
      placeholder={t('fields.note.placeholder')}
      containerClass='mt-4 max-w-lg'
      value={note}
      onChange={(e) => setNote(e.target.value)}
    />
  );
}

export function FirstValid({ t }: { t: TFunction }) {
  const [fv, setFv] = useAtom(txnDataAtoms.fv);
  return (
    <NumberField label={t('fields.fv.label')}
      name='fv'
      id='fv-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerClass='mt-4 max-w-xs'
      min={1}
      step={1}
      value={fv ||''}
      onChange={(e) => setFv(e.target.value === '' ? undefined : parseInt(e.target.value))}
    />
  );
}

export function LastValid({ t }: { t: TFunction }) {
  const [lv, setLv] = useAtom(txnDataAtoms.lv);
  return (
    <NumberField label={t('fields.lv.label')}
      name='lv'
      id='lv-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerClass='mt-4 max-w-xs'
      min={1}
      step={1}
      value={lv ?? ''}
      onChange={(e) => setLv(e.target.value === '' ? undefined : parseInt(e.target.value))}
    />
  );
}

export function Lease({ t }: { t: TFunction }) {
  const [lx, setLx] = useAtom(txnDataAtoms.lx);
  return (
    <TextField label={t('fields.lx.label')}
      name='lx'
      id='lx-field'
      inputInsideLabel={false}
      containerClass='mt-4 max-w-sm'
      value={lx}
      onChange={(e) => setLx(e.target.value)}
    />
  );
}

/** Rekey field WITH the notice */
export function Rekey({ t }: { t: TFunction }) {
  return (
    <>
      <RekeyField t={t} />

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

function RekeyField({ t }: { t: TFunction }) {
  const [rekey, setRekey] = useAtom(txnDataAtoms.rekey);
  return (
    <TextField label={t('fields.rekey.label')}
      name='rekey'
      id='rekey-field'
      inputInsideLabel={false}
      placeholder={t('fields.rekey.placeholder')}
      containerClass='mt-4'
      value={rekey}
      onChange={(e) => setRekey(e.target.value)}
    />
  );
}
