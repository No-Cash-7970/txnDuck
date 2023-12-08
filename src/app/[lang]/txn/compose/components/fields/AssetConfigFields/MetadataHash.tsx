import { TextField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  METADATA_HASH_LENGTH,
  assetConfigFormControlAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';
import FieldErrorMessage from '../FieldErrorMessage';

export default function MetadataHash({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  // If creation transaction
  return (!form.values.caid && <>
    <TextField label={t('fields.apar_am.label')}
      name='apar_am'
      id='apar_am-input'
      tip={{
        content: t('fields.apar_am.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      containerId='apar_am-field'
      containerClass='mt-4 max-w-sm'
      inputClass={
        ((showFormErrors || form.touched.apar_am) && form.fieldErrors.apar_am) ? 'input-error' : ''
      }
      maxLength={METADATA_HASH_LENGTH}
      value={form.values.apar_am as string}
      onChange={(e) => form.handleOnChange('apar_am')(e.target.value)}
      onFocus={form.handleOnFocus('apar_am')}
      onBlur={form.handleOnBlur('apar_am')}
    />
    {(showFormErrors || form.touched.apar_am) && form.fieldErrors.apar_am &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_am.message.key}
        dict={form.fieldErrors.apar_am.message.dict}
      />
    }
  </>);
}
