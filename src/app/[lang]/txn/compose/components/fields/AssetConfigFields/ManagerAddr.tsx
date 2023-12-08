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

export default function ManagerAddr({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.apar_m.label')}
      name='apar_m'
      id='apar_m-input'
      tip={{
        content: t('fields.apar_m.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      placeholder={t('fields.apar_m.placeholder')}
      containerId='apar_m-field'
      containerClass='mt-4'
      inputClass={
        ((showFormErrors || form.touched.apar_m) && form.fieldErrors.apar_m) ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.apar_m as string}
      onChange={(e) => form.handleOnChange('apar_m')(e.target.value)}
      onFocus={form.handleOnFocus('apar_m')}
      onBlur={form.handleOnBlur('apar_m')}
    />
    {(showFormErrors || form.touched.apar_m) && form.fieldErrors.apar_m &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_m.message.key}
        dict={form.fieldErrors.apar_m.message.dict}
      />
    }
  </>);
}
