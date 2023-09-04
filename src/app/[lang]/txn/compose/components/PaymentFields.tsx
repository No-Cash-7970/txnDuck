/** Fields for the compose-transaction form that are for payment transactions */

import { NumberField, TextField } from "@/app/[lang]/components/form";
import { ShowIf } from "@/app/[lang]/components";
import { IconAlertTriangle } from "@tabler/icons-react";
import { type TFunction } from "i18next";
import { Trans } from "react-i18next";

export function Receiver({ t }: { t: TFunction }) {
  return (
    <TextField label={t('fields.rcv.label')}
      name='rcv'
      id='rcv-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.rcv.placeholder')}
      containerClass='mt-4'
    />
  );
}

export function Amount({ t }: { t: TFunction }) {
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
    />
  );
}

export function CloseTo({ t }: { t: TFunction }) {
  return (
    <ShowIf cond={true}>
      <TextField label={t('fields.close.label')}
        name='close'
        id='close-field'
        inputInsideLabel={false}
        placeholder={t('fields.close.placeholder')}
        containerClass='mt-4'
      />
      <div className='alert alert-warning not-prose my-1'>
        <IconAlertTriangle aria-hidden />
        <span className='text-start'>
          <Trans t={t} i18nKey='fields.close.warning'>
            if_given <strong>all_funds_will_be_sent_to_given_address</strong>
            make_sure_you_know_what_you_are_doing
          </Trans>
        </span>
      </div>
    </ShowIf>
  );
}

export function ReceiverAndAmount({ t }: { t: TFunction }) {
  return (
    // If payment type
    <ShowIf cond={true}>
      <Receiver t={t} />
      <Amount t={t} />
    </ShowIf>
  );
}
