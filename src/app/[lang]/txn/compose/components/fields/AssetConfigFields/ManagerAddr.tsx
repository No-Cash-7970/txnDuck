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
import { defaultApar_mUseSnd as defaultApar_mUseSndAtom } from '@/app/lib/app-settings';

export default function ManagerAddr({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  return (
    <FieldGroup>
      {((!form.values.caid && preset === null) || preset === Preset.AssetCreate) && <>
          <UseSenderAddr t={t} />
          {!form.values.apar_mUseSnd && <ManagerAddrInput t={t} />}
        </>
      }
      {(form.values.caid || preset !== null) && preset !== Preset.AssetCreate &&
        <ManagerAddrInput t={t} />
      }
    </FieldGroup>
  );
}

function UseSenderAddr({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const storedTxnData = useAtomValue(storedTxnDataAtom);
  const defaultApar_mUseSnd = useAtomValue(defaultApar_mUseSndAtom);
  const setApar_mUseSnd = useSetAtom(txnDataAtoms.apar_mUseSnd);

  useEffect(() => {
    if (storedTxnData?.apar_mUseSnd === undefined && !form.touched.apar_mUseSnd) {
      setApar_mUseSnd(defaultApar_mUseSnd);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[defaultApar_mUseSnd, storedTxnData]);

  return (
    <ToggleField label={t('fields.apar_m_use_snd.label')}
      name='apar_m_use_snd'
      id='apar_mUseSnd-input'
      tip={{
        content: t('fields.apar_m_use_snd.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={true}
      containerId='apar_mUseSnd-field'
      containerClass='mt-4 max-w-lg'
      inputClass='toggle-primary'
      labelClass='gap-3'
      value={!!form.values.apar_mUseSnd}
      onChange={(e) => {
        form.setTouched('apar_mUseSnd', true);
        form.handleOnChange('apar_mUseSnd')(e.target.checked);
      }}
    />
  );
}

export function ManagerAddrInput({ t }: { t: TFunction }) {
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
