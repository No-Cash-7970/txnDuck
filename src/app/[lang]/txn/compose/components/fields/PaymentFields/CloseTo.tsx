import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { TextField } from '@/app/[lang]/components/form';
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
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass
} from '@/app/lib/txn-data';
import FieldErrorMessage from '../FieldErrorMessage';

export default function CloseTo({ t }: { t: TFunction }) {
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
      tip={{
        content: t('fields.close.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
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
    {(!!form.values.close || preset === Preset.CloseAccount) &&
      <div className='alert alert-warning not-prose my-1'>
        <IconAlertTriangle aria-hidden />
        <span className='text-start'><Trans t={t} i18nKey='fields.close.warning'/></span>
      </div>
    }
  </>);
}
