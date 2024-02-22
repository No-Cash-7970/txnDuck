'use client';

import { useState } from "react";
import { Trans } from "react-i18next";
import { useAtomValue } from "jotai";
import { useTranslation } from "@/app/i18n/client";
import { SelectField } from "@/app/[lang]/components/form";
import TxnPreset from "./TxnPreset";
import { Preset } from "@/app/lib/txn-data";
import { nodeConfigAtom } from "@/app/lib/node-config";

type Props = {
  /** Language */
  lng?: string
};

/** List of all the transaction presets */
export default function TxnPresetsList({ lng }: Props) {
  const { t } = useTranslation(lng || '', 'txn_presets');
  const [category, setCategory] = useState('all');
  const nodeConfig = useAtomValue(nodeConfigAtom);
  return (<div>
    <SelectField label={t('category_label')}
      name='category'
      id='category-selection'
      containerClass='flex justify-center max-w-xs mx-auto mt-8 -mb-4'
      labelClass='grid-cols-1 sm:grid-cols-2'
      labelTextClass='text-lg'
      options={[
        { value: 'all', text: t('all_heading') },
        { value: 'general', text: t('general_heading') },
        { value: 'asset', text: t('asset_heading') },
        { value: 'app', text: t('app_heading') },
        { value: 'part_key', text: t('part_key_heading') },
      ]}
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    />

    {(category === 'general' || category === 'all') && <>
      <h2 className='ps-2' id='general'>{t('general_heading')}</h2>
      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        <TxnPreset heading={nodeConfig.coinName
            ? t(`${Preset.Transfer}.heading`, {coinName: nodeConfig.coinName})
            : t(`${Preset.TransferAlgos}.heading`)
          }
          actionText={nodeConfig.coinName
            ? t(`${Preset.Transfer}.action`, {coinName: nodeConfig.coinName})
            : t(`${Preset.TransferAlgos}.action`)
          }
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.Transfer}`}
          color='primary'
        >
          {nodeConfig.coinName
            ? t(`${Preset.Transfer}.description`, {coinName: nodeConfig.coinName})
            : t(`${Preset.TransferAlgos}.description`)
          }
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.RekeyAccount}.heading`)}
          actionText={t(`${Preset.RekeyAccount}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.RekeyAccount}`}
          color='primary'
        >
          {t(`${Preset.RekeyAccount}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.CloseAccount}.heading`)}
          actionText={t(`${Preset.CloseAccount}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.CloseAccount}`}
          color='primary'
        >
          {t(`${Preset.CloseAccount}.description`)}
        </TxnPreset>
      </section>
    </>}
    {(category === 'asset' || category === 'all') && <>
      <h2 className='ps-2' id='asset'>{t('asset_heading')}</h2>
      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        <TxnPreset heading={t(`${Preset.AssetTransfer}.heading`)}
          actionText={t(`${Preset.AssetTransfer}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.AssetTransfer}`}
          color='secondary'
        >
          {t(`${Preset.AssetTransfer}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AssetOptIn}.heading`)}
          actionText={t(`${Preset.AssetOptIn}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.AssetOptIn}`}
          color='secondary'
        >
          {t(`${Preset.AssetOptIn}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AssetOptOut}.heading`)}
          actionText={t(`${Preset.AssetOptOut}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.AssetOptOut}`}
          color='secondary'
        >
          {t(`${Preset.AssetOptOut}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AssetCreate}.heading`)}
          actionText={t(`${Preset.AssetCreate}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.AssetCreate}`}
          color='secondary'
        >
          {t(`${Preset.AssetCreate}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AssetReconfig}.heading`)}
          actionText={t(`${Preset.AssetReconfig}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.AssetReconfig}`}
          color='secondary'
        >
          {t(`${Preset.AssetReconfig}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AssetClawback}.heading`)}
          actionText={t(`${Preset.AssetClawback}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.AssetClawback}`}
          color='secondary'
        >
          {t(`${Preset.AssetClawback}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AssetFreeze}.heading`)}
          actionText={t(`${Preset.AssetFreeze}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.AssetFreeze}`}
          color='secondary'
        >
          {t(`${Preset.AssetFreeze}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AssetUnfreeze}.heading`)}
          actionText={t(`${Preset.AssetUnfreeze}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.AssetUnfreeze}`}
          color='secondary'
        >
          {t(`${Preset.AssetUnfreeze}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AssetDestroy}.heading`)}
          actionText={t(`${Preset.AssetDestroy}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.AssetDestroy}`}
          color='secondary'
        >
          {t(`${Preset.AssetDestroy}.description`)}
        </TxnPreset>
      </section>
    </>}
    {(category === 'app' || category === 'all') && <>
      <h2 className='ps-2' id='application'>{t('app_heading')}</h2>
      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        <TxnPreset heading={t(`${Preset.AppRun}.heading`)}
          actionText={t(`${Preset.AppRun}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.AppRun}`}
          color='primary'
        >
          <Trans t={t} i18nKey={`${Preset.AppRun}.description`}
            components={{code: <code />}}
          />
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AppOptIn}.heading`)}
          actionText={t(`${Preset.AppOptIn}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.AppOptIn}`}
          color='primary'
        >
          {t(`${Preset.AppOptIn}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AppDeploy}.heading`)}
          actionText={t(`${Preset.AppDeploy}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.AppDeploy}`}
          color='primary'
        >
          {t(`${Preset.AppDeploy}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AppUpdate}.heading`)}
          actionText={t(`${Preset.AppUpdate}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.AppUpdate}`}
          color='primary'
        >
          <Trans t={t} i18nKey={`${Preset.AppUpdate}.description`}
            components={{code: <code />}}
          />
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AppClose}.heading`)}
          actionText={t(`${Preset.AppClose}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.AppClose}`}
          color='primary'
        >
          {t(`${Preset.AppClose}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AppClear}.heading`)}
          actionText={t(`${Preset.AppClear}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.AppClear}`}
          color='primary'
        >
          {t(`${Preset.AppClear}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AppDelete}.heading`)}
          actionText={t(`${Preset.AppDelete}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.AppDelete}`}
          color='primary'
        >
          <Trans t={t} i18nKey={`${Preset.AppDelete}.description`}
            components={{code: <code />}}
          />
        </TxnPreset>
      </section>
    </>}
    {(category === 'part_key' || category === 'all') && <>
      <h2 className='ps-2' id='part-key'>{t('part_key_heading')}</h2>
      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        <TxnPreset heading={t(`${Preset.RegOnline}.heading`)}
          actionText={t(`${Preset.RegOnline}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.RegOnline}`}
          color='secondary'
        >
          {t(`${Preset.RegOnline}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.RegOffline}.heading`)}
          actionText={t(`${Preset.RegOffline}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.RegOffline}`}
          color='secondary'
        >
          {t(`${Preset.RegOffline}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.RegNonpart}.heading`)}
          actionText={t(`${Preset.RegNonpart}.action`)}
          actionURL={`/${lng}/txn/compose?${Preset.ParamName}=${Preset.RegNonpart}`}
          color='secondary'
        >
          <Trans t={t} i18nKey={`${Preset.RegNonpart}.description`}
            components={{em: <strong />}}
          />
        </TxnPreset>
      </section>
    </>}
  </div>);
}
