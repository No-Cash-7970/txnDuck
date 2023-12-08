import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { TextField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { Trans } from 'react-i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  ADDRESS_LENGTH,
  Preset,
  generalFormControlAtom,
  presetAtom,
  rekeyConditionalRequireAtom,
  showFormErrorsAtom,
  tipContentClass,
  tipBtnClass,
} from '@/app/lib/txn-data';
import { IconAlertTriangle } from '@tabler/icons-react';
import FieldErrorMessage from '../FieldErrorMessage';

/** Rekey field WITH the notice */
export default function Rekey({ t }: { t: TFunction }) {
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

function RekeyInput({ t }: { t: TFunction }) {
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
