'use client';

import { useState } from "react";
import { Trans } from "react-i18next";
import { useTranslation } from "@/app/i18n/client";
import { SelectField } from "@/app/[lang]/components/form";
import TxnPreset from "./TxnPreset";

type Props = {
  /** Language */
  lng?: string
};

export default function TxnPresetsList({ lng }: Props) {
  const { t } = useTranslation(lng || '', 'txn_presets');
  const [category, setCategory] = useState('all');
  return (<div>
    <SelectField label={t('category_label')}
      name='category'
      id='category-selection'
      containerClass='flex justify-center max-w-xs mx-auto mt-8 -mb-4'
      labelClass='grid-cols-1 sm:grid-cols-2'
      labelTextClass='text-lg'
      options={[
        { value: 'all', text: t('all_title') },
        { value: 'general', text: t('general_title') },
        { value: 'asset', text: t('asset_title') },
        { value: 'app', text: t('app_title') },
        { value: 'part_key', text: t('part_key_title') },
      ]}
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    />

    {(category === 'general' || category === 'all') && <>
      <h2 id='general'>{t('general_title')}</h2>
      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        <TxnPreset heading={t('transfer_algos.heading')}
          actionText={t('transfer_algos.action')}
          actionURL={`/${lng}/txn/compose?preset=transfer_algos`}
          actionDisabled={true}
          color='primary'
        >
          {t('transfer_algos.description')}
        </TxnPreset>
        <TxnPreset heading={t('rekey_account.heading')}
          actionText={t('rekey_account.action')}
          actionURL={`/${lng}/txn/compose?preset=rekey_account`}
          actionDisabled={true}
          color='primary'
        >
          {t('rekey_account.description')}
        </TxnPreset>
        <TxnPreset heading={t('close_account.heading')}
          actionText={t('close_account.action')}
          actionURL={`/${lng}/txn/compose?preset=close_account`}
          actionDisabled={true}
          color='primary'
        >
          {t('close_account.description')}
        </TxnPreset>
      </section>
    </>}
    {(category === 'asset' || category === 'all') && <>
      <h2 id='asset'>{t('asset_title')}</h2>
      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        <TxnPreset heading={t('asset_transfer.heading')}
          actionText={t('asset_transfer.action')}
          actionURL={`/${lng}/txn/compose?preset=asset_transfer`}
          actionDisabled={true}
          color='secondary'
        >
          {t('asset_transfer.description')}
        </TxnPreset>
        <TxnPreset heading={t('asset_opt_in.heading')}
          actionText={t('asset_opt_in.action')}
          actionURL={`/${lng}/txn/compose?preset=asset_opt_in`}
          actionDisabled={true}
          color='secondary'
        >
          {t('asset_opt_in.description')}
        </TxnPreset>
        <TxnPreset heading={t('asset_opt_out.heading')}
          actionText={t('asset_opt_out.action')}
          actionURL={`/${lng}/txn/compose?preset=asset_opt_out`}
          actionDisabled={true}
          color='secondary'
        >
          {t('asset_opt_out.description')}
        </TxnPreset>
        <TxnPreset heading={t('asset_create.heading')}
          actionText={t('asset_create.action')}
          actionURL={`/${lng}/txn/compose?preset=asset_create`}
          actionDisabled={true}
          color='secondary'
        >
          {t('asset_create.description')}
        </TxnPreset>
        <TxnPreset heading={t('asset_reconfigure.heading')}
          actionText={t('asset_reconfigure.action')}
          actionURL={`/${lng}/txn/compose?preset=asset_reconfigure`}
          actionDisabled={true}
          color='secondary'
        >
          {t('asset_reconfigure.description')}
        </TxnPreset>
        <TxnPreset heading={t('asset_clawback.heading')}
          actionText={t('asset_clawback.action')}
          actionURL={`/${lng}/txn/compose?preset=asset_clawback`}
          actionDisabled={true}
          color='secondary'
        >
          {t('asset_clawback.description')}
        </TxnPreset>
        <TxnPreset heading={t('asset_freeze.heading')}
          actionText={t('asset_freeze.action')}
          actionURL={`/${lng}/txn/compose?preset=asset_freeze`}
          actionDisabled={true}
          color='secondary'
        >
          {t('asset_freeze.description')}
        </TxnPreset>
        <TxnPreset heading={t('asset_unfreeze.heading')}
          actionText={t('asset_unfreeze.action')}
          actionURL={`/${lng}/txn/compose?preset=asset_unfreeze`}
          actionDisabled={true}
          color='secondary'
        >
          {t('asset_unfreeze.description')}
        </TxnPreset>
        <TxnPreset heading={t('asset_destroy.heading')}
          actionText={t('asset_destroy.action')}
          actionURL={`/${lng}/txn/compose?preset=asset_destroy`}
          actionDisabled={true}
          color='secondary'
        >
          {t('asset_destroy.description')}
        </TxnPreset>
      </section>
    </>}
    {(category === 'app' || category === 'all') && <>
      <h2 id='application'>{t('app_title')}</h2>
      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        <TxnPreset heading={t('app_run.heading')}
          actionText={t('app_run.action')}
          actionURL={`/${lng}/txn/compose?preset=app_run`}
          actionDisabled={true}
          color='primary'
        >
          <Trans t={t} i18nKey='app_run.description'
            components={{code: <code className='px-0' />}}
          />
        </TxnPreset>
        <TxnPreset heading={t('app_opt_in.heading')}
          actionText={t('app_opt_in.action')}
          actionURL={`/${lng}/txn/compose?preset=app_opt_in`}
          actionDisabled={true}
          color='primary'
        >
          {t('app_opt_in.description')}
        </TxnPreset>
        <TxnPreset heading={t('app_deploy.heading')}
          actionText={t('app_deploy.action')}
          actionURL={`/${lng}/txn/compose?preset=app_deploy`}
          actionDisabled={true}
          color='primary'
        >
          {t('app_deploy.description')}
        </TxnPreset>
        <TxnPreset heading={t('app_update.heading')}
          actionText={t('app_update.action')}
          actionURL={`/${lng}/txn/compose?preset=app_update`}
          actionDisabled={true}
          color='primary'
        >
          <Trans t={t} i18nKey='app_update.description'
            components={{code: <code className='px-0' />}}
          />
        </TxnPreset>
        <TxnPreset heading={t('app_close_out.heading')}
          actionText={t('app_close_out.action')}
          actionURL={`/${lng}/txn/compose?preset=app_close_out`}
          actionDisabled={true}
          color='primary'
        >
          {t('app_close_out.description')}
        </TxnPreset>
        <TxnPreset heading={t('app_clear.heading')}
          actionText={t('app_clear.action')}
          actionURL={`/${lng}/txn/compose?preset=app_clear`}
          actionDisabled={true}
          color='primary'
        >
          {t('app_clear.description')}
        </TxnPreset>
        <TxnPreset heading={t('app_delete.heading')}
          actionText={t('app_delete.action')}
          actionURL={`/${lng}/txn/compose?preset=app_delete`}
          actionDisabled={true}
          color='primary'
        >
          <Trans t={t} i18nKey='app_delete.description'
            components={{code: <code className='px-0' />}}
          />
        </TxnPreset>
      </section>
    </>}
    {(category === 'part_key' || category === 'all') && <>
      <h2 id='part-key'>{t('part_key_title')}</h2>
      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        <TxnPreset heading={t('reg_online.heading')}
          actionText={t('reg_online.action')}
          actionURL={`/${lng}/txn/compose?preset=reg_online`}
          actionDisabled={true}
          color='secondary'
        >
          {t('reg_online.description')}
        </TxnPreset>
        <TxnPreset heading={t('reg_offline.heading')}
          actionText={t('reg_offline.action')}
          actionURL={`/${lng}/txn/compose?preset=reg_offline`}
          actionDisabled={true}
          color='secondary'
        >
          {t('reg_offline.description')}
        </TxnPreset>
        <TxnPreset heading={t('reg_nonpart.heading')}
          actionText={t('reg_nonpart.action')}
          actionURL={`/${lng}/txn/compose?preset=reg_nonpart`}
          actionDisabled={true}
          color='secondary'
        >
          {t('reg_nonpart.description')}
        </TxnPreset>
      </section>
    </>}
  </div>);
}
