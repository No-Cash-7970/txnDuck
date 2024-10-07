import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import { FieldErrorMessage, TextField } from '@/app/[lang]/components/form';
import {
  ASSET_NAME_MAX_LENGTH,
  assetConfigFormControlAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';

export default function AssetName({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  // If creation transaction
  return (!form.values.caid && <>
    <TextField label={t('fields.apar_an.label')}
      name='apar_an'
      id='apar_an-input'
      tip={{
        content: t('fields.apar_an.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      placeholder={t('fields.apar_an.placeholder')}
      containerId='apar_an-field'
      containerClass='mt-4 max-w-xs'
      inputClass={
        ((showFormErrors || form.touched.apar_an) && form.fieldErrors.apar_an) ? 'input-error' : ''
      }
      maxLength={ASSET_NAME_MAX_LENGTH}
      value={form.values.apar_an as string}
      onChange={(e) => form.handleOnChange('apar_an')(e.target.value)}
      onFocus={form.handleOnFocus('apar_an')}
      onBlur={form.handleOnBlur('apar_an')}
    />
    {(showFormErrors || form.touched.apar_an) && form.fieldErrors.apar_an &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_an.message.key}
        dict={form.fieldErrors.apar_an.message.dict}
      />
    }
  </>);
}
