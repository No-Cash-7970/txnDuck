/** Fields for the compose-transaction form that every transaction has */

import { NumberField, SelectField, TextAreaField, TextField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { Trans } from 'react-i18next';
import { IconAlertTriangle } from '@tabler/icons-react';

export function TxnType({ t }: { t: TFunction }) {
  return (
    <SelectField label={t('fields.type.label')}
      name='type'
      id='type-field'
      required={true}
      requiredText={t('form.required')}
      containerClass='max-w-xs'
      placeholder={t('fields.type.placeholder')}
      options={[
        { value: 'pay', text: t('fields.type.options.pay') },
        { value: 'axfer', text: t('fields.type.options.axfer') },
        { value: 'acfg', text: t('fields.type.options.acfg') },
        { value: 'afrz', text: t('fields.type.options.afrz') },
        { value: 'appl', text: t('fields.type.options.appl') },
        { value: 'keyreg', text: t('fields.type.options.keyreg') },
      ]}
    />
  );
}

export function Sender({ t }: { t: TFunction }) {
  return (
    <TextField label={t('fields.snd.label')}
      name='snd'
      id='snd-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.snd.placeholder')}
      containerClass='mt-4'
    />
  );
}

export function Fee({ t }: { t: TFunction }) {
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
    />
  );
}

export function Note({ t }: { t: TFunction }) {
  return (
    <TextAreaField label={t('fields.note.label')}
      name='note'
      id='note-field'
      inputInsideLabel={false}
      placeholder={t('fields.note.placeholder')}
      containerClass='mt-4 max-w-lg'
    />
  );
}

export function FirstValid({ t }: { t: TFunction }) {
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
    />
  );
}

export function LastValid({ t }: { t: TFunction }) {
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
    />
  );
}

export function Lease({ t }: { t: TFunction }) {
  return (
    <TextField label={t('fields.lx.label')}
      name='lx'
      id='lx-field'
      inputInsideLabel={false}
      containerClass='mt-4 max-w-sm'
    />
  );
}

export function Rekey({ t }: { t: TFunction }) {
  return (
    <>
      <TextField label={t('fields.rekey.label')}
        name='rekey'
        id='rekey-field'
        inputInsideLabel={false}
        placeholder={t('fields.rekey.placeholder')}
        containerClass='mt-4'
      />
      <div className='alert alert-warning not-prose my-1'>
        <IconAlertTriangle aria-hidden />
        <span className='text-start'>
          <Trans t={t} i18nKey='fields.rekey.warning'>
            <strong>rekeying_can_result_in_loss</strong> learn_more_at
            <a
              href="https://developer.algorand.org/docs/get-details/accounts/rekey"
              className="underline"
            >
              algo_docs
            </a>.
          </Trans>
        </span>
      </div>
    </>
  );
}
