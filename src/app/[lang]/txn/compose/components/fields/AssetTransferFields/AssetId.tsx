import { TextField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  assetTransferFormControlAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';
import FieldErrorMessage from '../FieldErrorMessage';

export default function AssetId({ t }: { t: TFunction }) {
  const form = useAtomValue(assetTransferFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.xaid.label')}
      name='xaid'
      id='xaid-input'
      tip={{
        content: t('fields.xaid.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId='xaid-field'
      containerClass='mt-4 max-w-xs'
      inputClass={
        ((showFormErrors || form.touched.xaid) && form.fieldErrors.xaid) ? 'input-error' : ''
      }
      value={form.values.xaid as number ?? ''}
      onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/gm, '');
        form.handleOnChange('xaid')(value === '' ? undefined : parseInt(value));
      }}
      onFocus={form.handleOnFocus('xaid')}
      onBlur={form.handleOnBlur('xaid')}
      inputMode='numeric'
    />
    {(showFormErrors || form.touched.xaid) && form.fieldErrors.xaid &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.xaid.message.key}
        dict={form.fieldErrors.xaid.message.dict}
      />
    }
  </>);
}
