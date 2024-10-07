import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  CheckboxField,
  FieldErrorMessage,
  FieldGroup,
  TextField
} from '@/app/[lang]/components/form';
import {
  B64_LEASE_LENGTH,
  LEASE_LENGTH,
  generalFormControlAtom,
  showFormErrorsAtom,
  tipContentClass,
  tipBtnClass,
  lxConditionalLengthAtom,
  lxConditionalBase64Atom,
} from '@/app/lib/txn-data';

export default function Lease({ t }: { t: TFunction }) {
  return (
    <FieldGroup>
      <LeaseInput t={t} />
      <Base64Input t={t} />
    </FieldGroup>
  );
}

export function LeaseInput({ t }: { t: TFunction }) {
  const form = useAtomValue(generalFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  const lxCondLengthGroup = useAtomValue(lxConditionalLengthAtom);
  const lxCondB64Group = useAtomValue(lxConditionalBase64Atom);
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
      inputClass={((showFormErrors || form.touched.lx) &&
        (form.fieldErrors.lx
          || (!lxCondLengthGroup.isValid && lxCondLengthGroup.error)
          || (!lxCondB64Group.isValid && lxCondB64Group.error)
        ))
        ? 'input-error' : ''
      }
      maxLength={form.values.b64Lx ? B64_LEASE_LENGTH : LEASE_LENGTH}
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
    {(showFormErrors || form.touched.lx) && !lxCondLengthGroup.isValid && lxCondLengthGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(lxCondLengthGroup.error as any).message.key}
        dict={(lxCondLengthGroup.error as any).message.dict}
      />
    }
    {(showFormErrors || form.touched.lx) && !lxCondB64Group.isValid && lxCondB64Group.error &&
      <FieldErrorMessage t={t} i18nkey={(lxCondB64Group.error as any).message.key} />
    }
  </>);
}

export function Base64Input({ t }: { t: TFunction }) {
  const form = useAtomValue(generalFormControlAtom);
  return (
    <CheckboxField label={t('fields.base64.label')}
      name='b64_lx'
      id='b64Lx-input'
      tip={{
        content: t('fields.base64.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={true}
      containerId='b64Lx-field'
      containerClass='mt-1 ms-1'
      inputClass='checkbox-primary checkbox-sm me-2 -mt-1'
      labelClass='justify-start w-fit max-w-full'
      value={!!form.values.b64Lx}
      onChange={(e) => form.handleOnChange('b64Lx')(e.target.checked)}
    />
  );
}
