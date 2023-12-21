import { useSearchParams } from 'next/navigation';
import { FieldGroup, TextField, ToggleField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import {
  ADDRESS_LENGTH,
  Preset,
  assetConfigFormControlAtom,
  showFormErrorsAtom,
  tipBtnClass,
  tipContentClass,
} from '@/app/lib/txn-data';
import FieldErrorMessage from '../FieldErrorMessage';

export default function FreezeAddr({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  return (
    <FieldGroup>
      {((!form.values.caid && preset === null) || preset === Preset.AssetCreate) && <>
          <UseSenderAddr t={t} />
          {!form.values.apar_fUseSnd && <FreezeAddrInput t={t} />}
        </>
      }
      {(form.values.caid || preset !== null) && preset !== Preset.AssetCreate &&
        <FreezeAddrInput t={t} />
      }
    </FieldGroup>
  );
}

function UseSenderAddr({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  return (
    <ToggleField label={t('fields.apar_f_use_snd.label')}
      name='apar_f_use_snd'
      id='apar_fUseSnd-input'
      tip={{
        content: t('fields.apar_f_use_snd.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={true}
      containerId='apar_fUseSnd-field'
      containerClass='mt-4 max-w-lg'
      inputClass='toggle-primary'
      labelClass='gap-3'
      value={!!form.values.apar_fUseSnd}
      onChange={(e) => form.handleOnChange('apar_fUseSnd')(e.target.checked)}
    />
  );
}

export function FreezeAddrInput({ t }: { t: TFunction }) {
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
