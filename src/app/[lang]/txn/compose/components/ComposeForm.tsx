'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import { Trans } from 'react-i18next';
import * as Icons from '@tabler/icons-react';
import { TransactionType } from 'algosdkv3';
import { useAtomValue } from 'jotai';
import { Preset } from '@/app/lib/txn-data';
import * as txnDataAtoms from '@/app/lib/txn-data/atoms';
import ComposeSubmitButton from './ComposeSubmitButton';
import { Fee, Note, Sender, TxnType, ValidRounds } from './fields/GeneralFields';
import {
  ArrayFieldGroup,
  ExtraSmallField,
  FullWidthField,
  LargeAreaField,
  LargeField,
  SmallField,
  SwitchField
} from './fields/LoadingPlaceholders';

// General
const Lease = dynamic(() => import('./fields/GeneralFields/Lease'),
  { ssr: false, loading: () => <SmallField containerClass='mt-6' /> },
);
const Rekey = dynamic(() => import('./fields/GeneralFields/Rekey'),
  { ssr: false, loading: () => <FullWidthField containerClass='mt-6' /> },
);

// Payment
const PaymentFields = {
  Receiver: dynamic(() => import('./fields/PaymentFields/Receiver'),
    { ssr: false, loading: () => <FullWidthField containerClass='mt-6' /> },
  ),
  Amount: dynamic(() => import('./fields/PaymentFields/Amount'),
    { ssr: false, loading: () => <ExtraSmallField containerClass='mt-6' /> },
  ),
  CloseTo: dynamic(() => import('./fields/PaymentFields/CloseTo'),
    { ssr: false, loading: () => <FullWidthField containerClass='mt-6' /> },
  ),
};

// Asset transfer
const AssetTransferFields = {
  Receiver: dynamic(() => import('./fields/AssetTransferFields/Receiver'),
    { ssr: false, loading: () => <FullWidthField containerClass='mt-6' /> },
  ),
  AssetId: dynamic(() => import('./fields/AssetTransferFields/AssetId'),
    { ssr: false, loading: () => <ExtraSmallField containerClass='mt-6' /> },
  ),
  Amount: dynamic(() => import('./fields/AssetTransferFields/Amount'),
    { ssr: false, loading: () => <ExtraSmallField containerClass='mt-6' /> },
  ),
  ClawbackTarget: dynamic(() => import('./fields/AssetTransferFields/ClawbackTarget'),
    { ssr: false, loading: () => <FullWidthField containerClass='mt-6' /> },
  ),
  CloseTo: dynamic(() => import('./fields/AssetTransferFields/CloseTo'),
    { ssr: false, loading: () => <FullWidthField containerClass='mt-6' /> },
  ),
};

// Asset configuration
const AssetConfigFields = {
  AssetId: dynamic(() => import('./fields/AssetConfigFields/AssetId'),
    { ssr: false, loading: () => <ExtraSmallField containerClass='mt-6' /> },
  ),
  UnitName: dynamic(() => import('./fields/AssetConfigFields/UnitName'),
    { ssr: false, loading: () => <ExtraSmallField containerClass='mt-6' /> },
  ),
  AssetName: dynamic(() => import('./fields/AssetConfigFields/AssetName'),
    { ssr: false, loading: () => <ExtraSmallField containerClass='mt-6' /> },
  ),
  Total: dynamic(() => import('./fields/AssetConfigFields/Total'),
    { ssr: false, loading: () => <ExtraSmallField containerClass='mt-6' /> },
  ),
  DecimalPlaces: dynamic(() => import('./fields/AssetConfigFields/DecimalPlaces'),
    { ssr: false, loading: () => <ExtraSmallField containerClass='mt-6' /> },
  ),
  DefaultFrozen: dynamic(() => import('./fields/AssetConfigFields/DefaultFrozen'),
    { ssr: false, loading: () => <SwitchField containerClass='max-w-lg mt-6' /> },
  ),
  URL: dynamic(() => import('./fields/AssetConfigFields/URL'),
    { ssr: false, loading: () => <FullWidthField containerClass='mt-6' /> },
  ),
  ManagerAddr: dynamic(() => import('./fields/AssetConfigFields/ManagerAddr'),
    { ssr: false, loading: () => <FullWidthField containerClass='mt-6' /> },
  ),
  FreezeAddr: dynamic(() => import('./fields/AssetConfigFields/FreezeAddr'),
    { ssr: false, loading: () => <FullWidthField containerClass='mt-6' /> },
  ),
  ClawbackAddr: dynamic(() => import('./fields/AssetConfigFields/ClawbackAddr'),
    { ssr: false, loading: () => <FullWidthField containerClass='mt-6' /> },
  ),
  ReserveAddr: dynamic(() => import('./fields/AssetConfigFields/ReserveAddr'),
    { ssr: false, loading: () => <FullWidthField containerClass='mt-6' /> },
  ),
  MetadataHash: dynamic(() => import('./fields/AssetConfigFields/MetadataHash'),
    { ssr: false, loading: () => <SmallField containerClass='mt-6' /> },
  ),
};

// Asset Freeze
const AssetFreezeFields = {
  AssetId: dynamic(() => import('./fields/AssetFreezeFields/AssetId'),
    { ssr: false, loading: () => <ExtraSmallField containerClass='mt-8' /> },
  ),
  TargetAddr: dynamic(() => import('./fields/AssetFreezeFields/TargetAddr'),
    { ssr: false, loading: () => <FullWidthField containerClass='mt-6' /> },
  ),
  Freeze: dynamic(() => import('./fields/AssetFreezeFields/Freeze'),
    { ssr: false, loading: () => <SwitchField containerClass='max-w-xs mt-6' /> },
  ),
};

// Application
const AppCallFields = {
  OnComplete: dynamic(() => import('./fields/AppCallFields/OnComplete'),
    { ssr: false, loading: () => <ExtraSmallField containerClass='mt-6' /> },
  ),
  AppId: dynamic(() => import('./fields/AppCallFields/AppId'),
    { ssr: false, loading: () => <ExtraSmallField containerClass='mt-6' /> },
  ),
  AppArgs: dynamic(() => import('./fields/AppCallFields/AppArgs'),
    { ssr: false, loading: () => <ArrayFieldGroup containerClass='mt-6' /> },
  ),
  AppProperties: dynamic(() => import('./fields/AppCallFields/AppProperties'),
    { ssr: false, loading: () => <>
      <LargeAreaField containerClass='mt-6' />
      <LargeAreaField containerClass='mt-6' />
    </> },
  ),
  AppDependencies: dynamic(() => import('./fields/AppCallFields/AppDependencies'),
    { ssr: false, loading: () => <>
      <ArrayFieldGroup containerClass='mt-6' />
      <ArrayFieldGroup containerClass='mt-6' />
      <ArrayFieldGroup containerClass='mt-6' />
      <ArrayFieldGroup containerClass='mt-6' />
    </> },
  ),
};

// Key Registration
const KeyRegFields = {
  VoteKey: dynamic(() => import('./fields/KeyRegFields/VoteKey'),
    { ssr: false, loading: () => <LargeField containerClass='mt-6' /> },
  ),
  SelectionKey: dynamic(() => import('./fields/KeyRegFields/SelectionKey'),
    { ssr: false, loading: () => <LargeField containerClass='mt-6' /> },
  ),
  StateProofKey: dynamic(() => import('./fields/KeyRegFields/StateProofKey'),
    { ssr: false, loading: () => <LargeField containerClass='mt-6' /> },
  ),
  FirstVoteRound: dynamic(() => import('./fields/KeyRegFields/FirstVoteRound'),
    { ssr: false, loading: () => <ExtraSmallField containerClass='mt-6' /> },
  ),
  LastVoteRound: dynamic(() => import('./fields/KeyRegFields/LastVoteRound'),
    { ssr: false, loading: () => <ExtraSmallField containerClass='mt-6' /> },
  ),
  KeyDilution: dynamic(() => import('./fields/KeyRegFields/KeyDilution'),
    { ssr: false, loading: () => <ExtraSmallField containerClass='mt-6' /> },
  ),
  Nonparticipation: dynamic(() => import('./fields/KeyRegFields/Nonparticipation'),
    { ssr: false, loading: () => <SwitchField containerClass='max-w-lg mt-6' /> },
  ),
};

type Props = {
  /** Language */
  lng?: string
};

/** Form for composing a transaction */
export default function ComposeForm({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['compose_txn', 'app', 'common']);
  const txnType = useAtomValue(txnDataAtoms.txnType);
  const currentURLParams = useSearchParams();
  const preset = currentURLParams.get(Preset.ParamName);
  const [urlParams, setUrlParams] = useState(currentURLParams.toString());

  useEffect(() => {
    // Remove URL parameter for preset if it is specified.
    // This is for the link (back button) to the Presets page
    const newURLParams = new URLSearchParams(urlParams);
    newURLParams.delete(Preset.ParamName);
    setUrlParams(newURLParams.toString());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentURLParams]);

  return (
    <form
      id='compose-txn-form'
      className='max-w-2xl mx-auto mt-12'
      noValidate={true}
      aria-label={t('title')}
    >
      <p className='max-w-3xl text-sm mb-8'>
        <Trans t={t} i18nKey='instructions'>
          asterisk_fields (<span className='text-error'>*</span>) required
        </Trans>
      </p>

      <TxnType t={t} />
      <Sender t={t} />

      {txnType.value === TransactionType.pay
        && (!preset || preset === Preset.TransferAlgos || preset === Preset.Transfer)
        && <>
          <PaymentFields.Receiver t={t} />
          <PaymentFields.Amount t={t} />
        </>
      }

      {txnType.value === TransactionType.axfer && <>
        {preset !== Preset.AssetOptIn && preset !== Preset.AssetOptOut &&
          <AssetTransferFields.Receiver t={t} />
        }

        <AssetTransferFields.AssetId t={t} />

        {preset !== Preset.AssetOptIn && preset !== Preset.AssetOptOut &&
          <AssetTransferFields.Amount t={t} />
        }

        {(!preset || preset === Preset.AssetClawback) &&
          <AssetTransferFields.ClawbackTarget t={t} />
        }
      </>}

      {txnType.value === TransactionType.acfg && <>
        {preset !== Preset.AssetCreate && <AssetConfigFields.AssetId t={t} />}

        {(!preset || preset === Preset.AssetCreate) && <>
          <AssetConfigFields.UnitName t={t} />
          <AssetConfigFields.AssetName t={t} />
          <AssetConfigFields.Total t={t} />
          <AssetConfigFields.DecimalPlaces t={t} />
          <AssetConfigFields.URL t={t} />
          <AssetConfigFields.DefaultFrozen t={t} />
        </>}
      </>}

      {txnType.value === TransactionType.afrz && <>
        <AssetFreezeFields.AssetId t={t} />
        <AssetFreezeFields.Freeze t={t} />
        <AssetFreezeFields.TargetAddr t={t} />
      </>}

      {txnType.value === TransactionType.keyreg && (!preset || preset === Preset.RegOnline) && <>
        <KeyRegFields.VoteKey t={t} />
        <KeyRegFields.SelectionKey t={t} />
        <KeyRegFields.StateProofKey t={t} />
        <KeyRegFields.FirstVoteRound t={t} />
        <KeyRegFields.LastVoteRound t={t} />
        <KeyRegFields.KeyDilution t={t} />
      </>}

      {txnType.value === TransactionType.appl && <>
        <AppCallFields.OnComplete t={t} />

        {preset !== Preset.AppDeploy && <AppCallFields.AppId t={t} />}

        <AppCallFields.AppArgs t={t} />

        {(!preset || preset === Preset.AppDeploy || preset === Preset.AppUpdate) &&
          <AppCallFields.AppProperties t={t} />
        }

        <AppCallFields.AppDependencies t={t} />
      </>}

      {txnType.value === TransactionType.acfg && preset !== Preset.AssetDestroy && <>
        <AssetConfigFields.ManagerAddr t={t} />
        <AssetConfigFields.FreezeAddr t={t} />
        <AssetConfigFields.ClawbackAddr t={t} />
        <AssetConfigFields.ReserveAddr t={t} />

        {(!preset || preset === Preset.AssetCreate) && <AssetConfigFields.MetadataHash t={t} />}
      </>}

      {txnType.value === TransactionType.keyreg && (!preset || preset === Preset.RegNonpart) &&
        <KeyRegFields.Nonparticipation t={t} />
      }

      {(txnType.value === TransactionType.pay) && (!preset || preset === Preset.CloseAccount) &&
        <PaymentFields.CloseTo t={t} />
      }

      {txnType.value === TransactionType.axfer && (!preset || preset === Preset.AssetOptOut) &&
        <AssetTransferFields.CloseTo t={t} />
      }

      {preset === Preset.RekeyAccount && <Rekey t={t} />}

      <Note t={t} />
      <Fee t={t} />
      <ValidRounds t={t} />

      {(!preset || preset === Preset.AppRun) && <Lease t={t} />}
      {!preset && <Rekey t={t} />}

      <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 grid-rows-1 mx-auto mt-12'>
        <div>
          <ComposeSubmitButton lng={lng} />
        </div>
        <div className='sm:order-first'>
          <Link type='button' className='btn w-full'
            href={`/${lng}/txn${urlParams ? '?'+urlParams : ''}`}
          >
            <Icons.IconArrowLeft aria-hidden className='rtl:hidden' />
            <Icons.IconArrowRight aria-hidden className='hidden rtl:inline' />
            {t('txn_presets_btn')}
          </Link>
          <div className='alert bg-base-100 gap-1 border-0 py-0 mt-2'>
            <Icons.IconAlertTriangleFilled
              aria-hidden
              className='text-warning align-middle my-auto me-2'
            />
            <small>{t('txn_presets_btn_warning')}</small>
          </div>
        </div>
      </div>

    </form>
  );
}
