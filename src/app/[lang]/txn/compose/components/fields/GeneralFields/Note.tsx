import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  CheckboxField,
  FieldErrorMessage,
  FieldGroup,
  TextAreaField
} from '@/app/[lang]/components/form';
import {
  B64_NOTE_MAX_LENGTH,
  NOTE_MAX_LENGTH,
  generalFormControlAtom,
  showFormErrorsAtom,
  tipContentClass,
  tipBtnClass,
  noteConditionalMaxAtom,
  noteConditionalBase64Atom,
} from '@/app/lib/txn-data';

export default function Note({ t }: { t: TFunction }) {
  return (
    <FieldGroup containerClass='mb-2'>
      <NoteInput t={t} />
      <Base64Input t={t} />
    </FieldGroup>
  );
}

export function NoteInput({ t }: { t: TFunction }) {
  const form = useAtomValue(generalFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  const noteCondMaxGroup = useAtomValue(noteConditionalMaxAtom);
  const noteCondB64Group = useAtomValue(noteConditionalBase64Atom);
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
      placeholder={
        t(form.values.b64Note ? 'fields.note.placeholder_b64' : 'fields.note.placeholder')
      }
      containerId='note-field'
      containerClass='mt-4 max-w-lg'
      inputClass={((showFormErrors || form.touched.note) &&
        (form.fieldErrors.note
          || (!noteCondMaxGroup.isValid && noteCondMaxGroup.error)
          || (!noteCondB64Group.isValid && noteCondB64Group.error)
        ))
        ? 'textarea-error' : ''
      }
      maxLength={form.values.b64Note ? B64_NOTE_MAX_LENGTH : NOTE_MAX_LENGTH}
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
    {(showFormErrors || form.touched.note) && !noteCondMaxGroup.isValid && noteCondMaxGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(noteCondMaxGroup.error as any).message.key}
        dict={(noteCondMaxGroup.error as any).message.dict}
      />
    }
    {(showFormErrors || form.touched.note) && !noteCondB64Group.isValid && noteCondB64Group.error &&
      <FieldErrorMessage t={t} i18nkey={(noteCondB64Group.error as any).message.key} />
    }
  </>);
}

export function Base64Input({ t }: { t: TFunction }) {
  const form = useAtomValue(generalFormControlAtom);
  return (
    <CheckboxField label={t('fields.base64.label')}
      name='b64_note'
      id='b64Note-input'
      tip={{
        content: t('fields.base64.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={true}
      containerId='b64Note-field'
      containerClass='mt-1 ms-1'
      inputClass='checkbox-primary checkbox-sm me-2 -mt-1'
      labelClass='justify-start w-fit max-w-full'
      value={!!form.values.b64Note}
      onChange={(e) => form.handleOnChange('b64Note')(e.target.checked)}
    />
  );
}
