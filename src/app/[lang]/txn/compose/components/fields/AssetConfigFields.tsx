/** Fields for the compose-transaction form that are for asset-configuration transaction */

import { NumberField, TextField, ToggleField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtom, useAtomValue } from 'jotai';
import { txnDataAtoms } from '@/app/lib/txn-data';

export function AssetId({ t }: { t: TFunction }) {
  const [caid, setCaid] = useAtom(txnDataAtoms.caid);
  return (
    <TextField label={t('fields.caid.label')}
      name='caid'
      id='caid-field'
      required={false}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerClass='mt-4 max-w-xs'
      value={caid ||''}
      onChange={(e) => setCaid(parseInt(e.target.value))}
      inputMode='numeric'
    />
  );
}

export function UnitName({ t }: { t: TFunction }) {
  const [unitName, setUnitName] = useAtom(txnDataAtoms.apar_un);
  const caid = useAtomValue(txnDataAtoms.caid);
  return (!caid &&
    <TextField label={t('fields.apar_un.label')}
      name='apar_un'
      id='apar_un-field'
      inputInsideLabel={false}
      placeholder={t('fields.apar_un.placeholder')}
      containerClass='mt-4 max-w-xs'
      value={unitName ||''}
      onChange={(e) => setUnitName(e.target.value)}
    />
  );
}

export function AssetName({ t }: { t: TFunction }) {
  const [aparAn, setAparAn] = useAtom(txnDataAtoms.apar_an);
  const caid = useAtomValue(txnDataAtoms.caid);
  return (!caid &&
    <TextField label={t('fields.apar_an.label')}
      name='apar_an'
      id='apar_an-field'
      inputInsideLabel={false}
      placeholder={t('fields.apar_an.placeholder')}
      containerClass='mt-4 max-w-sm'
      value={aparAn ||''}
      onChange={(e) => setAparAn(e.target.value)}
    />
  );
}

export function Total({ t }: { t: TFunction }) {
  const [total, setTotal] = useAtom(txnDataAtoms.apar_t);
  const caid = useAtomValue(txnDataAtoms.caid);
  return (!caid &&
    <NumberField label={t('fields.apar_t.label')}
      name='apar_t'
      id='apar_t-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerClass='mt-4 max-w-xs'
      min={1}
      step={1}
      value={`${total || ''}`}
      onChange={(e) => setTotal(e.target.value || '')}
    />
  );
}

export function DecimalPlaces({ t }: { t: TFunction }) {
  const [decimalPlaces, setDecimalPlaces] = useAtom(txnDataAtoms.apar_dc);
  const caid = useAtomValue(txnDataAtoms.caid);
  return (!caid &&
    <NumberField label={t('fields.apar_dc.label')}
      name='apar_dc'
      id='apar_dc-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerClass='mt-4 max-w-xs'
      min={0}
      step={1}
      value={`${decimalPlaces ?? ''}`}
      onChange={(e) => setDecimalPlaces(parseInt(e.target.value))}
    />
  );
}

export function DefaultFrozen({ t }: { t: TFunction }) {
  const [defaultFrozen, setDefaultFrozen] = useAtom(txnDataAtoms.apar_df);
  const caid = useAtomValue(txnDataAtoms.caid);
  return (!caid &&
    <ToggleField label={t('fields.apar_df.label')}
      name='apar_df'
      id='apar_df-field'
      inputInsideLabel={true}
      containerClass='mt-4 max-w-xs'
      inputClass='toggle-primary'
      value={defaultFrozen}
      onChange={(e) => setDefaultFrozen(e.target.checked)}
    />
  );
}

export function Url({ t }: { t: TFunction }) {
  const [url, setUrl] = useAtom(txnDataAtoms.apar_au);
  const caid = useAtomValue(txnDataAtoms.caid);
  return (!caid &&
    <TextField label={t('fields.apar_au.label')}
      name='apar_au'
      id='apar_au-field'
      inputInsideLabel={false}
      placeholder={t('fields.apar_au.placeholder')}
      containerClass='mt-4'
      value={url}
      onChange={(e) => setUrl(e.target.value)}
    />
  );
}

export function ManagerAddr({ t }: { t: TFunction }) {
  const [managerAddr, setManagerAddr] = useAtom(txnDataAtoms.apar_m);
  return (
    <TextField label={t('fields.apar_m.label')}
      name='apar_m'
      id='apar_m-field'
      inputInsideLabel={false}
      placeholder={t('fields.apar_m.placeholder')}
      containerClass='mt-4'
      value={managerAddr}
      onChange={(e) => setManagerAddr(e.target.value)}
    />
  );
}

export function FreezeAddr({ t }: { t: TFunction }) {
  const [freezeAddr, setFreezeAddr] = useAtom(txnDataAtoms.apar_f);
  return (
    <TextField label={t('fields.apar_f.label')}
      name='apar_f'
      id='apar_f-field'
      inputInsideLabel={false}
      placeholder={t('fields.apar_f.placeholder')}
      containerClass='mt-4'
      value={freezeAddr}
      onChange={(e) => setFreezeAddr(e.target.value)}
    />
  );
}

export function ClawbackAddr({ t }: { t: TFunction }) {
  const [clawbackAddr, setClawbackAddr] = useAtom(txnDataAtoms.apar_c);
  return (
    <TextField label={t('fields.apar_c.label')}
      name='apar_c'
      id='apar_c-field'
      inputInsideLabel={false}
      placeholder={t('fields.apar_c.placeholder')}
      containerClass='mt-4'
      value={clawbackAddr}
      onChange={(e) => setClawbackAddr(e.target.value)}
    />
  );
}

export function ReserveAddr({ t }: { t: TFunction }) {
  const [reserveAddr, setReserveAddr] = useAtom(txnDataAtoms.apar_r);
  return (
    <TextField label={t('fields.apar_r.label')}
      name='apar_r'
      id='apar_r-field'
      inputInsideLabel={false}
      placeholder={t('fields.apar_r.placeholder')}
      containerClass='mt-4'
      value={reserveAddr}
      onChange={(e) => setReserveAddr(e.target.value)}
    />
  );
}

export function MetadataHash({ t }: { t: TFunction }) {
  const [metadataHash, setMetadataHash] = useAtom(txnDataAtoms.apar_am);
  const caid = useAtomValue(txnDataAtoms.caid);
  return (!caid && // If creation transaction
    <TextField label={t('fields.apar_am.label')}
      name='apar_am'
      id='apar_am-field'
      inputInsideLabel={false}
      containerClass='mt-4 max-w-sm'
      value={metadataHash}
      onChange={(e) => setMetadataHash(e.target.value)}
    />
  );
}
