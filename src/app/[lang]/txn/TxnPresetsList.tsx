'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Trans } from "react-i18next";
import { useAtomValue } from "jotai";
import { SelectField } from "@/app/[lang]/components/form";
import { useTranslation } from "@/app/i18n/client";
import { txnPresetFavsAtom } from "@/app/lib/app-settings";
import { nodeConfigAtom } from "@/app/lib/node-config";
import { Preset } from "@/app/lib/txn-data";
import TxnPreset from "./TxnPreset";

type Props = {
  /** Language */
  lng?: string
};

/** List of all the transaction presets */
export default function TxnPresetsList({ lng }: Props) {
  const { t } = useTranslation(lng || '', 'txn_presets');
  const [category, setCategory] = useState('all');
  const nodeConfig = useAtomValue(nodeConfigAtom);
  const currentURLParams = useSearchParams();
  const [urlParams, setUrlParams] = useState(currentURLParams.toString());
  const txnPresetFavs = useAtomValue(txnPresetFavsAtom);

  useEffect(() => {
    // Remove URL parameter for preset if it is specified to prevent it from appearing twice when a
    // link is clicked on
    const newURLParams = new URLSearchParams(urlParams);
    newURLParams.delete(Preset.ParamName);
    setUrlParams(newURLParams.toString());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentURLParams]);

  return (<div>
    <SelectField label={t('category_label')}
      name='category'
      id='category-selection'
      containerClass='max-w-xs mx-auto mt-8 -mb-4'
      labelClass='grid-cols-1 sm:grid-cols-2'
      labelTextClass='text-lg'
      options={[
        { value: 'all', text: t('all_heading') },
        { value: 'favorites', text: t('favorites.heading') },
        { value: 'general', text: t('general_heading') },
        { value: 'asset', text: t('asset_heading') },
        { value: 'app', text: t('app_heading') },
        { value: 'part_key', text: t('part_key_heading') },
      ]}
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    />

    {(category === 'favorites' || category === 'all') && <>
      <h2 className='ps-2' id='favorites'>{t('favorites.heading')}</h2>
      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {txnPresetFavs.length === 0 && <p className='m-0 ps-4 italic'>{t('favorites.none')}</p>}
        {txnPresetFavs.map(fav => {
          // The "Transfer [coin name]" preset is special
          if (fav === Preset.Transfer) {
            return (
              <TxnPreset key={fav} heading={nodeConfig.coinName
                  ? t(`${Preset.Transfer}.heading`, {coinName: nodeConfig.coinName})
                  : t(`${Preset.TransferAlgos}.heading`)
                }
                actionText={nodeConfig.coinName
                  ? t(`${Preset.Transfer}.action`, {coinName: nodeConfig.coinName})
                  : t(`${Preset.TransferAlgos}.action`)
                }
                // eslint-disable-next-line max-len
                actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${fav}`}
                color='accent'
                presetName={fav}
                t={t}
              >
                {nodeConfig.coinName
                  ? t(`${Preset.Transfer}.description`, {coinName: nodeConfig.coinName})
                  : t(`${Preset.TransferAlgos}.description`)
                }
              </TxnPreset>
            );
          }

          return (
            <TxnPreset key={fav} heading={t(`${fav}.heading`)}
              actionText={t(`${fav}.action`)}
              // eslint-disable-next-line max-len
              actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${fav}`}
              color='accent'
              presetName={fav}
              t={t}
            >
              {t(`${fav}.description`)}
            </TxnPreset>
          );
        })}
      </section>
    </>}

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
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.Transfer}`}
          color='primary'
          presetName={Preset.Transfer}
          t={t}
        >
          {nodeConfig.coinName
            ? t(`${Preset.Transfer}.description`, {coinName: nodeConfig.coinName})
            : t(`${Preset.TransferAlgos}.description`)
          }
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.RekeyAccount}.heading`)}
          actionText={t(`${Preset.RekeyAccount}.action`)}
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.RekeyAccount}`}
          color='primary'
          presetName={Preset.RekeyAccount}
          t={t}
        >
          {t(`${Preset.RekeyAccount}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.CloseAccount}.heading`)}
          actionText={t(`${Preset.CloseAccount}.action`)}
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.CloseAccount}`}
          color='primary'
          presetName={Preset.CloseAccount}
          t={t}
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
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.AssetTransfer}`}
          color='secondary'
          presetName={Preset.AssetTransfer}
          t={t}
        >
          {t(`${Preset.AssetTransfer}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AssetOptIn}.heading`)}
          actionText={t(`${Preset.AssetOptIn}.action`)}
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.AssetOptIn}`}
          color='secondary'
          presetName={Preset.AssetOptIn}
          t={t}
        >
          {t(`${Preset.AssetOptIn}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AssetOptOut}.heading`)}
          actionText={t(`${Preset.AssetOptOut}.action`)}
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.AssetOptOut}`}
          color='secondary'
          presetName={Preset.AssetOptOut}
          t={t}
        >
          {t(`${Preset.AssetOptOut}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AssetCreate}.heading`)}
          actionText={t(`${Preset.AssetCreate}.action`)}
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.AssetCreate}`}
          color='secondary'
          presetName={Preset.AssetCreate}
          t={t}
        >
          {t(`${Preset.AssetCreate}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AssetReconfig}.heading`)}
          actionText={t(`${Preset.AssetReconfig}.action`)}
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.AssetReconfig}`}
          color='secondary'
          presetName={Preset.AssetReconfig}
          t={t}
        >
          {t(`${Preset.AssetReconfig}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AssetClawback}.heading`)}
          actionText={t(`${Preset.AssetClawback}.action`)}
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.AssetClawback}`}
          color='secondary'
          presetName={Preset.AssetClawback}
          t={t}
        >
          {t(`${Preset.AssetClawback}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AssetFreeze}.heading`)}
          actionText={t(`${Preset.AssetFreeze}.action`)}
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.AssetFreeze}`}
          color='secondary'
          presetName={Preset.AssetFreeze}
          t={t}
        >
          {t(`${Preset.AssetFreeze}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AssetUnfreeze}.heading`)}
          actionText={t(`${Preset.AssetUnfreeze}.action`)}
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.AssetUnfreeze}`}
          color='secondary'
          presetName={Preset.AssetUnfreeze}
          t={t}
        >
          {t(`${Preset.AssetUnfreeze}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AssetDestroy}.heading`)}
          actionText={t(`${Preset.AssetDestroy}.action`)}
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.AssetDestroy}`}
          color='secondary'
          presetName={Preset.AssetDestroy}
          t={t}
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
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.AppRun}`}
          color='primary'
          presetName={Preset.AppRun}
          t={t}
        >
          <Trans t={t} i18nKey={`${Preset.AppRun}.description`}
            components={{code: <code />}}
          />
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AppOptIn}.heading`)}
          actionText={t(`${Preset.AppOptIn}.action`)}
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.AppOptIn}`}
          color='primary'
          presetName={Preset.AppOptIn}
          t={t}
        >
          {t(`${Preset.AppOptIn}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AppDeploy}.heading`)}
          actionText={t(`${Preset.AppDeploy}.action`)}
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.AppDeploy}`}
          color='primary'
          presetName={Preset.AppDeploy}
          t={t}
        >
          {t(`${Preset.AppDeploy}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AppUpdate}.heading`)}
          actionText={t(`${Preset.AppUpdate}.action`)}
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.AppUpdate}`}
          color='primary'
          presetName={Preset.AppUpdate}
          t={t}
        >
          <Trans t={t} i18nKey={`${Preset.AppUpdate}.description`}
            components={{code: <code />}}
          />
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AppClose}.heading`)}
          actionText={t(`${Preset.AppClose}.action`)}
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.AppClose}`}
          color='primary'
          presetName={Preset.AppClose}
          t={t}
        >
          {t(`${Preset.AppClose}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AppClear}.heading`)}
          actionText={t(`${Preset.AppClear}.action`)}
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.AppClear}`}
          color='primary'
          presetName={Preset.AppClear}
          t={t}
        >
          {t(`${Preset.AppClear}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.AppDelete}.heading`)}
          actionText={t(`${Preset.AppDelete}.action`)}
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.AppDelete}`}
          color='primary'
          presetName={Preset.AppDelete}
          t={t}
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
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.RegOnline}`}
          color='secondary'
          presetName={Preset.RegOnline}
          t={t}
        >
          {t(`${Preset.RegOnline}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.RegOffline}.heading`)}
          actionText={t(`${Preset.RegOffline}.action`)}
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.RegOffline}`}
          color='secondary'
          presetName={Preset.RegOffline}
          t={t}
        >
          {t(`${Preset.RegOffline}.description`)}
        </TxnPreset>
        <TxnPreset heading={t(`${Preset.RegNonpart}.heading`)}
          actionText={t(`${Preset.RegNonpart}.action`)}
          // eslint-disable-next-line max-len
          actionURL={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${Preset.ParamName}=${Preset.RegNonpart}`}
          color='secondary'
          presetName={Preset.RegNonpart}
          t={t}
        >
          <Trans t={t} i18nKey={`${Preset.RegNonpart}.description`}
            components={{em: <strong />}}
          />
        </TxnPreset>
      </section>
    </>}
  </div>);
}
