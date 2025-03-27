import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import { OnApplicationComplete } from 'algosdk';
import { FieldErrorMessage, TextField } from '@/app/[lang]/components/form';
import {
  Preset,
  apidConditionalRequireAtom,
  applFormControlAtom,
  showFormErrorsAtom,
  presetAtom,
  tipBtnClass,
  tipContentClass
} from '@/app/lib/txn-data';
import { removeNonNumericalChars } from '@/app/lib/utils';

export default function AppId({ t }: { t: TFunction }) {
  const form = useAtomValue(applFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setPresetAtom = useSetAtom(presetAtom);
  const apidCondReqGroup = useAtomValue(apidConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <TextField label={t('fields.apid.label')}
      name='apid'
      id='apid-input'
      tip={{
        content: t('fields.apid.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={form.values.apan !== OnApplicationComplete.NoOpOC
        || (!!preset && preset !== Preset.AppDeploy)
      }
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='apid-field'
      containerClass='mt-4 max-w-xs'
      inputClass={((showFormErrors || form.touched.apid) &&
          (form.fieldErrors.apid || (!apidCondReqGroup.isValid && apidCondReqGroup.error))
        )
        ? 'input-error' : ''
      }
      value={form.values.apid ?? ''}
      onChange={(e) => {
        const value = removeNonNumericalChars(e.target.value);
        form.handleOnChange('apid')(value === '' ? undefined : parseInt(value));
      }}
      onFocus={form.handleOnFocus('apid')}
      onBlur={form.handleOnBlur('apid')}
      inputMode='numeric'
    />
    {(showFormErrors || form.touched.apid) && form.fieldErrors.apid &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apid.message.key}
        dict={form.fieldErrors.apid.message.dict}
      />
    }
    {(showFormErrors || form.touched.apid) &&
      !apidCondReqGroup.isValid && apidCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(apidCondReqGroup.error as any).message.key}
        dict={(apidCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}
