import { TextAreaField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  NOTE_MAX_LENGTH,
  generalFormControlAtom,
  showFormErrorsAtom,
  tipContentClass,
  tipBtnClass,
} from '@/app/lib/txn-data';
import FieldErrorMessage from '../FieldErrorMessage';

export default function Note({ t }: { t: TFunction }) {
  const form = useAtomValue(generalFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextAreaField label={t('fields.note.label')}
      name='note'
      id='note-input'
      tip={{
        content: t('fields.note.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      placeholder={t('fields.note.placeholder')}
      containerId='note-field'
      containerClass='mt-4 max-w-lg'
      inputClass={
        ((showFormErrors || form.touched.note) && form.fieldErrors.note) ? 'textarea-error' : ''
      }
      maxLength={NOTE_MAX_LENGTH}
      value={form.values.note as string}
      onChange={(e) => form.handleOnChange('note')(e.target.value)}
      onFocus={form.handleOnFocus('note')}
      onBlur={form.handleOnBlur('note')}
    />
    {(showFormErrors || form.touched.note) && form.fieldErrors.note &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.note.message.key}
        dict={form.fieldErrors.note.message.dict}
      />
    }
  </>);
}
