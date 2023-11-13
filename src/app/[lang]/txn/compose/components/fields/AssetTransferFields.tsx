/** Fields for the compose-transaction form that are for asset-transfer transaction */

import { useSearchParams } from 'next/navigation';
import { NumberField, TextField } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { Trans } from 'react-i18next';
import { useAtom } from 'jotai';
import { txnDataAtoms } from '@/app/lib/txn-data';
import { IconAlertTriangle } from '@tabler/icons-react';

export function Sender({ t }: { t: TFunction }) {
  const [asnd, setAsnd] = useAtom(txnDataAtoms.asnd);
  const presetParams = useSearchParams().get('preset');
  return (
    <TextField label={t('fields.asnd.label')}
      name='asnd'
      id='asnd-field'
      required={presetParams === 'asset_clawback'}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.asnd.placeholder')}
      containerClass='mt-4'
      value={asnd}
      onChange={(e) => setAsnd(e.target.value)}
    />
  );
}

export function Receiver({ t }: { t: TFunction }) {
  const [arcv, setArcv] = useAtom(txnDataAtoms.arcv);
  return (
    <TextField label={t('fields.arcv.label')}
      name='arcv'
      id='arcv-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.arcv.placeholder')}
      containerClass='mt-4'
      value={arcv}
      onChange={(e) => setArcv(e.target.value)}
    />
  );
}

export function AssetId({ t }: { t: TFunction }) {
  const [xaid, setXaid] = useAtom(txnDataAtoms.xaid);
  return (
    <TextField label={t('fields.xaid.label')}
      name='xaid'
      id='xaid-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerClass='mt-4 max-w-xs'
      value={xaid ?? ''}
      onChange={(e) => setXaid(e.target.value === '' ? undefined : parseInt(e.target.value))}
      inputMode='numeric'
    />
  );
}

export function Amount({ t }: { t: TFunction }) {
  const [aamt, setAamt] = useAtom(txnDataAtoms.aamt);
  return (
    <NumberField label={t('fields.aamt.label')}
      name='aamt'
      id='aamt-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerClass='mt-4 max-w-xs'
      min={0}
      step={1}
      value={aamt ?? ''}
      onChange={(e) => setAamt(e.target.value === '' ? '' : parseInt(e.target.value))}
    />
  );
}

/** The "Close To" field WITH the notice */
export function CloseTo({ t }: { t: TFunction }) {
  return (
    <>
      <CloseToField t={t} />

      <div className='alert alert-warning not-prose my-1'>
        <IconAlertTriangle aria-hidden />
        <span className='text-start'>
          <Trans t={t} i18nKey='fields.aclose.warning'/>
        </span>
      </div>
    </>
  );
}

function CloseToField({ t }: { t: TFunction }) {
  const [aclose, setAclose] = useAtom(txnDataAtoms.aclose);
  const presetParams = useSearchParams().get('preset');
  return (
    <TextField label={t('fields.aclose.label')}
      name='aclose'
      id='aclose-field'
      required={presetParams === 'asset_opt_out'}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.aclose.placeholder')}
      containerClass='mt-4'
      value={aclose}
      onChange={(e) => setAclose(e.target.value)}
    />
  );
}
