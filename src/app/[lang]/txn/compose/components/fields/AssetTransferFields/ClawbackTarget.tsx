import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import { FieldErrorMessage, TextField } from '@/app/[lang]/components/form';
import {
  ADDRESS_LENGTH,
  Preset,
  asndConditionalRequireAtom,
  assetTransferFormControlAtom,
  presetAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';

export default function ClawbackTarget({ t }: { t: TFunction }) {
  const form = useAtomValue(assetTransferFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const asndCondReqGroup = useAtomValue(asndConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <TextField label={t('fields.asnd.label')}
      name='asnd'
      id='asnd-input'
      tip={{
        content: t('fields.asnd.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={preset === Preset.AssetClawback}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.asnd.placeholder')}
      containerId='asnd-field'
      containerClass='mt-6'
      inputClass={((showFormErrors || form.touched.asnd) &&
          (form.fieldErrors.asnd || (!asndCondReqGroup.isValid && asndCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.asnd as string}
      onChange={(e) => form.handleOnChange('asnd')(e.target.value)}
      onFocus={form.handleOnFocus('asnd')}
      onBlur={form.handleOnBlur('asnd')}
    />
    {(showFormErrors || form.touched.asnd) && form.fieldErrors.asnd &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.asnd.message.key}
        dict={form.fieldErrors.asnd.message.dict}
      />
    }
    {(showFormErrors || form.touched.asnd) && !asndCondReqGroup.isValid && asndCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(asndCondReqGroup.error as any).message.key}
        dict={(asndCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}
