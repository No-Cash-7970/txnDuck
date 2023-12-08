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


export default function FreezeAddr({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.apar_f.label')}
      name='apar_f'
      id='apar_f-input'
      tip={{
        content: t('fields.apar_f.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      placeholder={t('fields.apar_f.placeholder')}
      containerId='apar_f-field'
      containerClass='mt-4'
      inputClass={
        ((showFormErrors || form.touched.apar_f) && form.fieldErrors.apar_f) ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.apar_f as string}
      onChange={(e) => form.handleOnChange('apar_f')(e.target.value)}
      onFocus={form.handleOnFocus('apar_f')}
      onBlur={form.handleOnBlur('apar_f')}
    />
    {(showFormErrors || form.touched.apar_f) && form.fieldErrors.apar_f &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_f.message.key}
        dict={form.fieldErrors.apar_f.message.dict}
      />
    }
  </>);
}
