/** Fields for the compose-transaction form that are for payment transactions */

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { NumberField, TextField } from '@/app/[lang]/components/form';
import { IconAlertTriangle } from '@tabler/icons-react';
import { type TFunction } from 'i18next';
import { Trans } from 'react-i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  ADDRESS_LENGTH,
  Preset,
  closeConditionalRequireAtom,
  paymentFormControlAtom,
  presetAtom,
  showFormErrorsAtom
} from '@/app/lib/txn-data';
import FieldErrorMessage from './FieldErrorMessage';

export function Receiver({ t }: { t: TFunction }) {
  const form = useAtomValue(paymentFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.rcv.label')}
      name='rcv'
      id='rcv-input'
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

export function Amount({ t }: { t: TFunction }) {
  const form = useAtomValue(paymentFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <NumberField label={t('fields.amt.label')}
      name='amt'
      id='amt-input'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='amt-field'
      containerClass='mt-4 max-w-xs'
      inputClass={
        ((showFormErrors || form.touched.amt) && form.fieldErrors.amt) ? 'input-error' : ''
      }
      afterSideLabel={t('algo_other')}
      min={0}
      step={0.000001}
      value={form.values.amt as number ?? ''}
      onChange={(e) =>
        form.handleOnChange('amt')(e.target.value === '' ? undefined : parseFloat(e.target.value))
      }
      onFocus={form.handleOnFocus('amt')}
      onBlur={form.handleOnBlur('amt')}
    />
    {(showFormErrors || form.touched.amt) && form.fieldErrors.amt &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.amt.message.key}
        dict={form.fieldErrors.amt.message.dict}
      />
    }
  </>);
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
  const form = useAtomValue(paymentFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const closeCondReqGroup = useAtomValue(closeConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <TextField label={t('fields.close.label')}
      name='close'
      id='close-input'
      required={preset === Preset.CloseAccount}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.close.placeholder')}
      containerId='close-field'
      containerClass='mt-4'
      inputClass={((showFormErrors || form.touched.close) &&
          (form.fieldErrors.close || (!closeCondReqGroup.isValid && closeCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.close as string}
      onChange={(e) => form.handleOnChange('close')(e.target.value)}
      onFocus={form.handleOnFocus('close')}
      onBlur={form.handleOnBlur('close')}
    />
    {(showFormErrors || form.touched.close) && form.fieldErrors.close &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.close.message.key}
        dict={form.fieldErrors.close.message.dict}
      />
    }
    {(showFormErrors || form.touched.close) && !closeCondReqGroup.isValid
      && closeCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(closeCondReqGroup.error as any).message.key}
        dict={(closeCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}
