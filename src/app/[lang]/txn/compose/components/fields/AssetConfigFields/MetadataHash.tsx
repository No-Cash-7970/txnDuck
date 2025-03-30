import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  CheckboxField,
  FieldErrorMessage,
  FieldGroup,
  TextField
} from '@/app/[lang]/components/form';
import {
  B64_METADATA_HASH_LENGTH,
  METADATA_HASH_LENGTH,
  aparAmConditionalBase64Atom,
  aparAmConditionalLengthAtom,
  assetConfigFormControlAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';

export default function MetadataHash({ t }: { t: TFunction }) {
  return (
    <FieldGroup>
      <MetadataHashInput t={t} />
      <Base64Input t={t} />
    </FieldGroup>
  );
}

export function MetadataHashInput({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  const aparAmCondLengthGroup = useAtomValue(aparAmConditionalLengthAtom);
  const aparAmCondB64Group = useAtomValue(aparAmConditionalBase64Atom);
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
      containerClass='mt-6 max-w-sm'
      inputClass={((showFormErrors || form.touched.apar_am) &&
        (form.fieldErrors.lx
          || (!aparAmCondLengthGroup.isValid && aparAmCondLengthGroup.error)
          || (!aparAmCondB64Group.isValid && aparAmCondB64Group.error)
        ))
        ? 'input-error' : ''
      }
      maxLength={form.values.b64Apar_am ? B64_METADATA_HASH_LENGTH : METADATA_HASH_LENGTH}
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
    {(showFormErrors || form.touched.apar_am) && !aparAmCondLengthGroup.isValid
      && aparAmCondLengthGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(aparAmCondLengthGroup.error as any).message.key}
        dict={(aparAmCondLengthGroup.error as any).message.dict}
      />
    }
    {(showFormErrors || form.touched.apar_am) && !aparAmCondB64Group.isValid
      && aparAmCondB64Group.error &&
      <FieldErrorMessage t={t} i18nkey={(aparAmCondB64Group.error as any).message.key} />
    }
  </>);
}

export function Base64Input({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  return (
    <CheckboxField label={t('fields.base64.label')}
      name='b64_apar_am'
      id='b64Apar_am-input'
      tip={{
        content: t('fields.base64.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={true}
      containerId='b64Apar_am-field'
      containerClass='mt-1 ms-3'
      inputClass='checkbox-primary checkbox-sm me-2 -mt-1'
      labelClass='justify-start w-fit max-w-full text-sm align-middle'
      value={!!form.values.b64Apar_am}
      onChange={(e) => form.handleOnChange('b64Apar_am')(e.target.checked)}
    />
  );
}
