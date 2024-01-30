import { FieldErrorMessage, TextField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  UNIT_NAME_MAX_LENGTH,
  assetConfigFormControlAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';

export default function UnitName({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  // If creation transaction
  return (!form.values.caid && <>
    <TextField label={t('fields.apar_un.label')}
      name='apar_un'
      id='apar_un-input'
      tip={{
        content: t('fields.apar_un.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      placeholder={t('fields.apar_un.placeholder')}
      containerId='apar_un-field'
      containerClass='mt-4 max-w-xs'
      inputClass={
        ((showFormErrors || form.touched.apar_un) && form.fieldErrors.apar_un) ? 'input-error' : ''
      }
      maxLength={UNIT_NAME_MAX_LENGTH}
      value={form.values.apar_un as string}
      onChange={(e) => form.handleOnChange('apar_un')(e.target.value)}
      onFocus={form.handleOnFocus('apar_un')}
      onBlur={form.handleOnBlur('apar_un')}
    />
    {(showFormErrors || form.touched.apar_un) && form.fieldErrors.apar_un &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_un.message.key}
        dict={form.fieldErrors.apar_un.message.dict}
      />
    }
  </>);
}
