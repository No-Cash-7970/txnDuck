import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { TextField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  Preset,
  assetConfigFormControlAtom,
  caidConditionalRequireAtom,
  presetAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';
import FieldErrorMessage from '../FieldErrorMessage';

export default function AssetId({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const caidCondReqGroup = useAtomValue(caidConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <TextField label={t('fields.caid.label')}
      name='caid'
      id='caid-input'
      tip={{
        content: t('fields.caid.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={preset === Preset.AssetReconfig || preset === Preset.AssetDestroy}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='aclose-field'
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || form.touched.caid) &&
          (form.fieldErrors.caid || (!caidCondReqGroup.isValid && caidCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      value={form.values.caid as number ?? ''}
      onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/gm, '');
        form.handleOnChange('caid')(value === '' ? undefined : parseInt(value));
      }}
      onFocus={form.handleOnFocus('caid')}
      onBlur={form.handleOnBlur('caid')}
      inputMode='numeric'
    />
    {(showFormErrors || form.touched.caid) && form.fieldErrors.caid &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.caid.message.key}
        dict={form.fieldErrors.caid.message.dict}
      />
    }
    {(showFormErrors || form.touched.caid) && !caidCondReqGroup.isValid && caidCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(caidCondReqGroup.error as any).message.key}
        dict={(caidCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}
