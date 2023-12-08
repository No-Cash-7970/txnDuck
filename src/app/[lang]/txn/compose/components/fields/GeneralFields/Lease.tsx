import { TextField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  LEASE_MAX_LENGTH,
  generalFormControlAtom,
  showFormErrorsAtom,
  tipContentClass,
  tipBtnClass,
} from '@/app/lib/txn-data';
import FieldErrorMessage from '../FieldErrorMessage';

export default function Lease({ t }: { t: TFunction }) {
  const form = useAtomValue(generalFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.lx.label')}
      name='lx'
      id='lx-input'
      tip={{
        content: t('fields.lx.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      containerId='lx-field'
      containerClass='mt-4 max-w-sm'
      inputClass={((showFormErrors || form.touched.lx) && form.fieldErrors.lx) ? 'input-error' : ''}
      maxLength={LEASE_MAX_LENGTH}
      value={form.values.lx as string}
      onChange={(e) => form.handleOnChange('lx')(e.target.value)}
      onFocus={form.handleOnFocus('lx')}
      onBlur={form.handleOnBlur('lx')}
    />
    {(showFormErrors || form.touched.lx) && form.fieldErrors.lx &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.lx.message.key}
        dict={form.fieldErrors.lx.message.dict}
      />
    }
  </>);
}
