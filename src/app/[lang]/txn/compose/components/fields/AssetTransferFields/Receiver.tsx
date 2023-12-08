import { TextField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  ADDRESS_LENGTH,
  assetTransferFormControlAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';
import FieldErrorMessage from '../FieldErrorMessage';

export default function Receiver({ t }: { t: TFunction }) {
  const form = useAtomValue(assetTransferFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.arcv.label')}
      name='arcv'
      id='arcv-input'
      tip={{
        content: t('fields.arcv.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.arcv.placeholder')}
      containerId='arcv-field'
      containerClass='mt-4'
      inputClass={
        ((showFormErrors || form.touched.arcv) && form.fieldErrors.arcv) ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.arcv as string}
      onChange={(e) => form.handleOnChange('arcv')(e.target.value)}
      onFocus={form.handleOnFocus('arcv')}
      onBlur={form.handleOnBlur('arcv')}
    />
    {(showFormErrors || form.touched.arcv) && form.fieldErrors.arcv &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.arcv.message.key}
        dict={form.fieldErrors.arcv.message.dict}
      />
    }
  </>);
}
