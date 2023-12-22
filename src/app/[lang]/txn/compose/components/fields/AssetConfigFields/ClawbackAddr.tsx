import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FieldGroup, TextField, ToggleField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  ADDRESS_LENGTH,
  Preset,
  assetConfigFormControlAtom,
  showFormErrorsAtom,
  storedTxnDataAtom,
  tipBtnClass,
  tipContentClass,
  txnDataAtoms,
} from '@/app/lib/txn-data';
import FieldErrorMessage from '../FieldErrorMessage';
import { defaultApar_cUseSnd as defaultApar_cUseSndAtom } from '@/app/lib/app-settings';

export default function ClawbackAddr({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  return (
    <FieldGroup>
      {((!form.values.caid && preset === null) || preset === Preset.AssetCreate) && <>
          <UseSenderAddr t={t} />
          {!form.values.apar_cUseSnd && <ClawbackAddrInput t={t} />}
        </>
      }
      {(form.values.caid || preset !== null) && preset !== Preset.AssetCreate &&
        <ClawbackAddrInput t={t} />
      }
    </FieldGroup>
  );
}

function UseSenderAddr({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const storedTxnData = useAtomValue(storedTxnDataAtom);
  const defaultApar_cUseSnd = useAtomValue(defaultApar_cUseSndAtom);
  const setApar_cUseSnd = useSetAtom(txnDataAtoms.apar_cUseSnd);

  useEffect(() => {
    if (storedTxnData?.apar_cUseSnd === undefined && !form.touched.apar_cUseSnd) {
      setApar_cUseSnd(defaultApar_cUseSnd);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[defaultApar_cUseSnd, storedTxnData]);

  return (
    <ToggleField label={t('fields.apar_c_use_snd.label')}
      name='apar_c_use_snd'
      id='apar_cUseSnd-input'
      tip={{
        content: t('fields.apar_c_use_snd.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={true}
      containerId='apar_cUseSnd-field'
      containerClass='mt-4 max-w-lg'
      inputClass='toggle-primary'
      labelClass='gap-3'
      value={!!form.values.apar_cUseSnd}
      onChange={(e) => {
        form.setTouched('apar_cUseSnd', true);
        form.handleOnChange('apar_cUseSnd')(e.target.checked);
      }}
    />
  );
}

export function ClawbackAddrInput({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('fields.apar_c.label')}
      name='apar_c'
      id='apar_c-input'
      tip={{
        content: t('fields.apar_c.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      placeholder={t('fields.apar_c.placeholder')}
      containerId='apar_c-field'
      containerClass='mt-4'
      inputClass={
        ((showFormErrors || form.touched.apar_c) && form.fieldErrors.apar_c) ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.apar_c as string}
      onChange={(e) => form.handleOnChange('apar_c')(e.target.value)}
      onFocus={form.handleOnFocus('apar_c')}
      onBlur={form.handleOnBlur('apar_c')}
    />
    {(showFormErrors || form.touched.apar_c) && form.fieldErrors.apar_c &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_c.message.key}
        dict={form.fieldErrors.apar_c.message.dict}
      />
    }
  </>);
}
