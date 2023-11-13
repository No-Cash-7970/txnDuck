/** Fields for the compose-transaction form that are for asset-freeze transaction */

import { useSearchParams } from 'next/navigation';
import { TextField, ToggleField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtom } from 'jotai';
import { Preset, txnDataAtoms } from '@/app/lib/txn-data';

export function AssetId({ t }: { t: TFunction }) {
  const [assetId, setAssetId] = useAtom(txnDataAtoms.faid);
  return (
    <TextField label={t('fields.faid.label')}
      name='faid'
      id='faid-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerClass='mt-4 max-w-xs'
      value={assetId ?? ''}
      onChange={(e) => setAssetId(e.target.value === '' ? undefined : parseInt(e.target.value))}
      inputMode='numeric'
    />
  );
}

export function TargetAddr({ t }: { t: TFunction }) {
  const [addr, setAddr] = useAtom(txnDataAtoms.fadd);
  return (
    <TextField label={t('fields.fadd.label')}
      name='fadd'
      id='fadd-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.fadd.placeholder')}
      containerClass='mt-4'
      value={addr}
      onChange={(e) => setAddr(e.target.value)}
    />
  );
}

export function Freeze({ t }: { t: TFunction }) {
  const [freeze, setFreeze] = useAtom(txnDataAtoms.afrz);
  const preset = useSearchParams().get(Preset.ParamName);
  return (
    <ToggleField label={t('fields.afrz.label')}
      name='afrz'
      id='afrz-field'
      inputInsideLabel={true}
      containerClass='mt-4 max-w-xs'
      inputClass='toggle-primary'
      disabled={preset === Preset.AssetFreeze || preset === Preset.AssetUnfreeze}
      value={freeze}
      onChange={(e) => setFreeze(e.target.checked)}
    />
  );
}
