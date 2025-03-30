import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import { IconAlertTriangleFilled } from '@tabler/icons-react';
import {
  FieldErrorMessage,
  FieldGroup,
  TextField,
  ToggleField
} from '@/app/[lang]/components/form';
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
import { defaultApar_fUseSnd as defaultApar_fUseSndAtom } from '@/app/lib/app-settings';

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
  const storedTxnData = useAtomValue(storedTxnDataAtom);
  const defaultApar_fUseSnd = useAtomValue(defaultApar_fUseSndAtom);
  const setApar_fUseSnd = useSetAtom(txnDataAtoms.apar_fUseSnd);

  useEffect(() => {
    if (storedTxnData?.apar_fUseSnd === undefined && !form.touched.apar_fUseSnd) {
      setApar_fUseSnd(defaultApar_fUseSnd);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[defaultApar_fUseSnd, storedTxnData]);

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
      containerClass='mt-6 max-w-lg'
      inputClass='toggle-primary'
      labelClass='gap-3'
      value={!!form.values.apar_fUseSnd}
      onChange={(e) => {
        form.setTouched('apar_fUseSnd', true);
        form.handleOnChange('apar_fUseSnd')(e.target.checked);
      }}
    />
  );
}

export function FreezeAddrInput({ t }: { t: TFunction }) {
  const form = useAtomValue(assetConfigFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  const setApar_f = useSetAtom(txnDataAtoms.apar_f);
  const retrievedAssetInfo = useAtomValue(txnDataAtoms.retrievedAssetInfo);

  useEffect(() => {
    if (
      preset !== Preset.AssetDestroy && !form.touched.apar_f && retrievedAssetInfo?.value?.freeze
    ) {
      setApar_f(retrievedAssetInfo.value.freeze);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[retrievedAssetInfo]);

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
      containerClass='mt-6'
      inputClass={
        ((showFormErrors || form.touched.apar_f) && form.fieldErrors.apar_f) ? 'input-error' : ''
      }
      maxLength={ADDRESS_LENGTH}
      value={form.values.apar_f as string}
      onChange={(e) => form.handleOnChange('apar_f')(e.target.value)}
      onFocus={form.handleOnFocus('apar_f')}
      onBlur={form.handleOnBlur('apar_f')}
      helpMsg={form.values.apar_f === ''
        ? <>
          <IconAlertTriangleFilled aria-hidden size={18}
            className='align-middle inline ms-2 me-2'
          />
          {t('fields.apar_f.empty_warning')}
        </>
        : undefined
      }
    />
    {(showFormErrors || form.touched.apar_f) && form.fieldErrors.apar_f &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apar_f.message.key}
        dict={form.fieldErrors.apar_f.message.dict}
      />
    }
  </>);
}
