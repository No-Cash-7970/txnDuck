import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { type TFunction } from 'i18next';
import { Trans } from 'react-i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import { FieldErrorMessage, TextField } from '@/app/[lang]/components/form';
import {
  ADDRESS_LENGTH,
  Preset,
  acloseConditionalRequireAtom,
  assetTransferFormControlAtom,
  presetAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';
import { IconAlertTriangle } from '@tabler/icons-react';

export default function CloseTo({ t }: { t: TFunction }) {
  const form = useAtomValue(assetTransferFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const acloseCondReqGroup = useAtomValue(acloseConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <TextField label={t('fields.aclose.label')}
      name='aclose'
      id='aclose-input'
      tip={{
        content: t('fields.aclose.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={preset === Preset.AssetOptOut}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.aclose.placeholder')}
      containerId='aclose-field'
      containerClass='mt-4'
      inputClass={((showFormErrors || form.touched.aclose) &&
          (form.fieldErrors.aclose || (!acloseCondReqGroup.isValid && acloseCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.aclose as string}
      onChange={(e) => form.handleOnChange('aclose')(e.target.value)}
      onFocus={form.handleOnFocus('aclose')}
      onBlur={form.handleOnBlur('aclose')}
    />
    {(showFormErrors || form.touched.aclose) && form.fieldErrors.aclose &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.aclose.message.key}
        dict={form.fieldErrors.aclose.message.dict}
      />
    }
    {(showFormErrors || form.touched.aclose) && !acloseCondReqGroup.isValid
      && acloseCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(acloseCondReqGroup.error as any).message.key}
        dict={(acloseCondReqGroup.error as any).message.dict}
      />
    }
    {(!!form.values.aclose || preset === Preset.AssetOptOut) &&
      <div className='alert alert-warning not-prose my-1'>
        <IconAlertTriangle aria-hidden />
        <span className='text-start'><Trans t={t} i18nKey='fields.aclose.warning'/></span>
      </div>
    }
  </>);
}
