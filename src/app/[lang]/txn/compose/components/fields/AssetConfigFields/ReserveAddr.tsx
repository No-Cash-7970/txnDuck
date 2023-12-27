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
import { defaultApar_rUseSnd as defaultApar_rUseSndAtom } from '@/app/lib/app-settings';

export default function ReserveAddr({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  return (
    <FieldGroup>
      {((!form.values.caid && preset === null) || preset === Preset.AssetCreate) && <>
          <UseSenderAddr t={t} />
          {!form.values.apar_rUseSnd && <ReserveAddrInput t={t} />}
        </>
      }
      {(form.values.caid || preset !== null) && preset !== Preset.AssetCreate &&
        <ReserveAddrInput t={t} />
      }
    </FieldGroup>
  );
}

function UseSenderAddr({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const storedTxnData = useAtomValue(storedTxnDataAtom);
  const defaultApar_rUseSnd = useAtomValue(defaultApar_rUseSndAtom);
  const setApar_rUseSnd = useSetAtom(txnDataAtoms.apar_rUseSnd);

  useEffect(() => {
    if (storedTxnData?.apar_rUseSnd === undefined && !form.touched.apar_rUseSnd) {
      setApar_rUseSnd(defaultApar_rUseSnd);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[defaultApar_rUseSnd, storedTxnData]);

  return (
    <ToggleField label={t('fields.apar_r_use_snd.label')}
      name='apar_r_use_snd'
      id='apar_rUseSnd-input'
      tip={{
        content: t('fields.apar_r_use_snd.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={true}
      containerId='apar_rUseSnd-field'
      containerClass='mt-4 max-w-lg'
      inputClass='toggle-primary'
      labelClass='gap-3'
      value={!!form.values.apar_rUseSnd}
      onChange={(e) => {
        form.setTouched('apar_rUseSnd', true);
        form.handleOnChange('apar_rUseSnd')(e.target.checked);
      }}
    />
  );
}

export function ReserveAddrInput({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setApar_r = useSetAtom(txnDataAtoms.apar_r);
  const retrievedAssetInfo = useAtomValue(txnDataAtoms.retrievedAssetInfo);

  useEffect(() => {
    if (
      preset !== Preset.AssetDestroy && !form.touched.apar_r && retrievedAssetInfo?.value?.reserve
    ) {
      setApar_r(retrievedAssetInfo.value.reserve);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[retrievedAssetInfo]);

  return (<>
    <TextField label={t('fields.apar_r.label')}
      name='apar_r'
      id='apar_r-input'
      tip={{
        content: t('fields.apar_r.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      inputInsideLabel={false}
      placeholder={t('fields.apar_r.placeholder')}
      containerId='apar_r-field'
      containerClass='mt-4'
      inputClass={
        ((showFormErrors || form.touched.apar_r) && form.fieldErrors.apar_r) ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.apar_r as string}
      onChange={(e) => form.handleOnChange('apar_r')(e.target.value)}
      onFocus={form.handleOnFocus('apar_r')}
      onBlur={form.handleOnBlur('apar_r')}
    />
    {(showFormErrors || form.touched.apar_r) && form.fieldErrors.apar_r &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_r.message.key}
        dict={form.fieldErrors.apar_r.message.dict}
      />
    }
  </>);
}
