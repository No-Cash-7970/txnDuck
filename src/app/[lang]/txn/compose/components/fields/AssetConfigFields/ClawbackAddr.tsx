import { TextField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  ADDRESS_LENGTH,
  assetConfigFormControlAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';
import FieldErrorMessage from '../FieldErrorMessage';

export default function ClawbackAddr({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.apar_c.label')}
      name='apar_c'
      id='apar_c-input'
      tip={{
        content: t('fields.apar_c.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      placeholder={t('fields.apar_c.placeholder')}
      containerId='apar_c-field'
      containerClass='mt-4'
      inputClass={
        ((showFormErrors || form.touched.apar_c) && form.fieldErrors.apar_c) ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.apar_c as string}
      onChange={(e) => form.handleOnChange('apar_c')(e.target.value)}
      onFocus={form.handleOnFocus('apar_c')}
      onBlur={form.handleOnBlur('apar_c')}
    />
    {(showFormErrors || form.touched.apar_c) && form.fieldErrors.apar_c &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_c.message.key}
        dict={form.fieldErrors.apar_c.message.dict}
      />
    }
  </>);
}
