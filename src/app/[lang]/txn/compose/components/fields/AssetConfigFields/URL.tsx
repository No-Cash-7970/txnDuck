import { FieldErrorMessage, TextField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  URL_MAX_LENGTH,
  assetConfigFormControlAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';

export default function URL({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  // If creation transaction
  return (!form.values.caid && <>
    <TextField label={t('fields.apar_au.label')}
      type='url'
      name='apar_au'
      id='apar_au-input'
      tip={{
        content: t('fields.apar_au.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      placeholder={t('fields.apar_au.placeholder')}
      containerId='apar_au-field'
      containerClass='mt-4'
      inputClass={
        ((showFormErrors || form.touched.apar_au) && form.fieldErrors.apar_au) ? 'input-error' : ''
      }
      maxLength={URL_MAX_LENGTH}
      value={form.values.apar_au as string}
      onChange={(e) => form.handleOnChange('apar_au')(e.target.value)}
      onFocus={form.handleOnFocus('apar_au')}
      onBlur={form.handleOnBlur('apar_au')}
      inputMode='url'
    />
    {(showFormErrors || form.touched.apar_au) && form.fieldErrors.apar_au &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_au.message.key}
        dict={form.fieldErrors.apar_au.message.dict}
      />
    }
  </>);
}
