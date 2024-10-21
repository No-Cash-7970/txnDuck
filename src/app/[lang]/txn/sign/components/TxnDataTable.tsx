'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { TransactionType } from 'algosdkv3';
import { useAtomValue } from 'jotai';
import { Trans } from 'react-i18next';
import { useTranslation } from '@/app/i18n/client';
import * as TxnData from '@/app/lib/txn-data';
import { nodeConfigAtom } from '@/app/lib/node-config';
import {
  fee as feeAtom,
  fv as fvAtom,
  lv as lvAtom,
  minFee as minFeeAtom
} from '@/app/lib/txn-data/atoms';
import { baseUnitsToDecimal, importParamName } from '@/app/lib/utils';
import PageLoadingPlaceholder from '@/app/[lang]/components/PageLoadingPlaceholder';

type Props = {
  /** Language */
  lng?: string
};

const appTypes = [
  'no_op',
  'opt_in',
  'close_out',
  'clear',
  'update',
  'delete'
];

/** Table that displays the stored transaction data */
export default function TxnDataTable({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['compose_txn', 'sign_txn', 'common', 'app']);
  const nodeConfig = useAtomValue(nodeConfigAtom);
  const storedTxnData = useAtomValue(TxnData.storedTxnDataAtom);
  const fee = useAtomValue(feeAtom);
  const minFee = useAtomValue(minFeeAtom);
  const fv = useAtomValue(fvAtom);
  const lv = useAtomValue(lvAtom);
  const currentURLParams = useSearchParams();
  const isImporting = currentURLParams.get(importParamName) !== null;

  /** Get the part of the i18n translation key for the given transaction type
   * @returns Part of the i18n translation key for the transaction type
   */
  const txnTypeKeyPart = useMemo((): string => {
    const type = storedTxnData?.txn?.type;

    if (type === TransactionType.acfg) {
      if (!((storedTxnData?.txn as TxnData.AssetConfigTxnData).caid)) return 'acfg_create';

      if (!((storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_m)
        && !((storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_f)
        && !((storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_c)
        && !((storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_r)
      ) {
        return 'acfg_destroy';
      }

      return 'acfg_reconfig';
    }

    if (type === TransactionType.keyreg) {
      if ((storedTxnData?.txn as TxnData.KeyRegTxnData)?.nonpart) return 'keyreg_nonpart';

      if ((storedTxnData?.txn as TxnData.KeyRegTxnData)?.votekey
        || (storedTxnData?.txn as TxnData.KeyRegTxnData)?.selkey
        || (storedTxnData?.txn as TxnData.KeyRegTxnData)?.sprfkey
        || (storedTxnData?.txn as TxnData.KeyRegTxnData)?.votefst
        || (storedTxnData?.txn as TxnData.KeyRegTxnData)?.votelst
        || (storedTxnData?.txn as TxnData.KeyRegTxnData)?.votekd
      ) {
        return 'keyreg_on';
      }

      return 'keyreg_off';
    }

    if (type === TransactionType.appl) {
      if (!((storedTxnData?.txn as TxnData.AppCallTxnData)?.apid)) return 'appl_create';

      return 'appl_' + appTypes[(storedTxnData?.txn as TxnData.AppCallTxnData)?.apan];
    }

    return `${type}`;
  }, [storedTxnData]);

  return (<>{!isImporting && !!storedTxnData &&
    <table className='table mb-4'>
      <tbody>
        {/* Node network */}
        <tr className='text-accent'>
          <th role='rowheader' className='align-top'>{t('app:node_selector.node_network')}</th>
          <td>{nodeConfig ? t(`app:node_selector.${nodeConfig.network}`) : t('loading')}</td>
        </tr>

        {/* Transaction type */}
        <tr>
          <th role='rowheader' className='align-top'>{t('fields.type.label')}</th>
          <td>{ txnTypeKeyPart !== 'undefined'
            ? t(`fields.type.options.${txnTypeKeyPart}`)
            : t('loading')
          }</td>
        </tr>
        {/* Sender */}
        <tr>
          <th role='rowheader' className='align-top'>{t('fields.snd.label')}</th>
          <td className='break-all'>{storedTxnData ? storedTxnData?.txn?.snd : t('loading')}</td>
        </tr>

        {/* If payment transaction */}
        {storedTxnData?.txn?.type === TransactionType.pay && <>
          {/* Receiver */}
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.rcv.label')}</th>
            <td className='break-all'>{(storedTxnData?.txn as TxnData.PaymentTxnData)?.rcv}</td>
          </tr>
          {/* Amount */}
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.amt.label')}</th>
            <td>
              {t('fields.amt.in_coin', {
                count: (storedTxnData?.txn as TxnData.PaymentTxnData)?.amt,
                coinName: nodeConfig.coinName || t('algo', {
                  count: (storedTxnData?.txn as TxnData.PaymentTxnData)?.amt
                }),
                formatParams: { count: { maximumFractionDigits: 6 } }
              })}
            </td>
          </tr>
          {/** Close remainder to */}
          <tr className={(storedTxnData?.txn as TxnData.PaymentTxnData)?.close
            ? 'bg-warning text-warning-content'
            : ''
          }>
            <th role='rowheader' className='align-top'>{t('fields.close.label')}</th>
            <td className='break-all'>
              {(storedTxnData?.txn as TxnData.PaymentTxnData)?.close
                || <i className='opacity-50'>{t('none')}</i>
              }
            </td>
          </tr>
        </>}

        {/* If asset transfer transaction */}
        {storedTxnData?.txn?.type === TransactionType.axfer && <>
          {/* Asset receiver */}
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.arcv.label')}</th>
            <td className='break-all'>
              {(storedTxnData?.txn as TxnData.AssetTransferTxnData)?.arcv}
            </td>
          </tr>
          {/* Asset ID */}
          <tr>
            <th role='rowheader' className='align-top'>
              {storedTxnData?.retrievedAssetInfo?.name
                ? t('fields.xaid.with_name_label') : t('fields.xaid.label')
              }
            </th>
            <td>
              {storedTxnData?.retrievedAssetInfo?.name
                ? t('fields.xaid.with_name', {
                  name: storedTxnData?.retrievedAssetInfo?.name,
                  id: (storedTxnData?.txn as TxnData.AssetTransferTxnData)?.xaid
                })
                : (storedTxnData?.txn as TxnData.AssetTransferTxnData)?.xaid
              }
            </td>
          </tr>
          {/* Asset amount */}
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.aamt.label')}</th>
            <td>
              {storedTxnData?.retrievedAssetInfo?.unitName
                ? t('asset_amount', {
                  amount: baseUnitsToDecimal(
                    (storedTxnData?.txn as TxnData.AssetTransferTxnData)?.aamt,
                    storedTxnData?.retrievedAssetInfo?.decimals
                  ),
                  asset: storedTxnData?.retrievedAssetInfo?.unitName,
                  formatParams: {
                    amount: {
                      maximumFractionDigits: storedTxnData?.retrievedAssetInfo?.decimals ?? 0
                    }
                  }
                })
                : t('number_value', {
                  value: (storedTxnData?.txn as TxnData.AssetTransferTxnData)?.aamt,
                  formatParams: {
                    value: {
                      maximumFractionDigits: storedTxnData?.retrievedAssetInfo?.decimals ?? 0
                    }
                  }
                })
              }
            </td>
          </tr>
          {/* Clawback target */}
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.asnd.label')}</th>
            <td className='break-all'>
              {(storedTxnData?.txn as TxnData.AssetTransferTxnData)?.asnd ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>
          {/* Close remainder of asset to */}
          <tr className={(storedTxnData?.txn as TxnData.AssetTransferTxnData)?.aclose
            ? 'bg-warning text-warning-content'
            : ''
          }>
            <th role='rowheader' className='align-top'>{t('fields.aclose.label')}</th>
            <td className='break-all'>
              {(storedTxnData?.txn as TxnData.AssetTransferTxnData)?.aclose ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>
        </>}

        {/* If asset configuration transaction */}
        {storedTxnData?.txn?.type === TransactionType.acfg && <>
          { // If NOT an asset creation transaction
          (storedTxnData?.txn as TxnData.AssetConfigTxnData).caid &&
          /** Asset ID */
          <tr>
            <th role='rowheader' className='align-top'>
              {storedTxnData?.retrievedAssetInfo?.name
                ? t('fields.caid.with_name_label') : t('fields.caid.label')
              }
            </th>
            <td>
              {storedTxnData?.retrievedAssetInfo?.name
                ? t('fields.caid.with_name', {
                  name: storedTxnData?.retrievedAssetInfo?.name,
                  id: (storedTxnData?.txn as TxnData.AssetConfigTxnData)?.caid
                })
                : (storedTxnData?.txn as TxnData.AssetConfigTxnData)?.caid
              }
            </td>
          </tr>}

          { // If an asset creation transaction
          !((storedTxnData?.txn as TxnData.AssetConfigTxnData).caid) && <>
            {/* Unit name */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_un.label')}</th>
              <td>
                {(storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_un ||
                  <i className='opacity-50'>{t('none')}</i>}
              </td>
            </tr>
            {/* Asset name */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_an.label')}</th>
              <td>
                {(storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_an ||
                  <i className='opacity-50'>{t('none')}</i>}
              </td>
            </tr>
            {/* Total */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_t.label')}</th>
              <td>
                {(storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_un
                  ? t('asset_amount', {
                    amount: baseUnitsToDecimal(
                      (storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_t,
                      (storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_dc ?? 0
                    ),
                    asset: (storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_un,
                    formatParams: {
                      amount: {
                        minimumFractionDigits:
                          (storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_dc ?? 0
                      }
                    }
                  })
                  : t('number_value', {
                    value: baseUnitsToDecimal(
                      (storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_t,
                      (storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_dc ?? 0
                    ),
                    formatParams: {
                      value: {
                        minimumFractionDigits:
                        (storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_dc ?? 0
                      }
                    }
                  })
                }
              </td>
            </tr>
            {/* Number of decimals places */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_dc.label')}</th>
              <td>{(storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_dc}</td>
            </tr>
            {/* Frozen by default? */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_df.label')}</th>
              <td>
                {(storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_df
                  ? <b>{t('fields.apar_df.is_frozen')}</b>
                  : t('fields.apar_df.is_not_frozen')
                }
              </td>
            </tr>
            {/* URL */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_au.label')}</th>
              <td>
                {(storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_au ||
                  <i className='opacity-50'>{t('none')}</i>}
              </td>
            </tr>
            {/* Metadata hash */}
            <tr>
              <th role='rowheader' className='align-top'>
                {storedTxnData?.b64Apar_am
                  ? t('fields.base64.with_label', { label: t('fields.apar_am.label') })
                  : t('fields.apar_am.label')
                }
              </th>
              <td>
                {((storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_am) ||
                  <i className='opacity-50'>{t('none')}</i>}
              </td>
            </tr>
          </>}

          {/* If not an asset destroy (an asset creation or reconfiguration) */}
          {txnTypeKeyPart !== 'acfg_destroy' && <>
            {/* Manager address */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_m.label')}</th>
              <td className='break-all'>
                {((storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_m) ||
                  <i className='opacity-50'>{t('none')}</i>}
              </td>
            </tr>
            {/* Freeze address */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_f.label')}</th>
              <td className='break-all'>
                {((storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_f) ||
                  <i className='opacity-50'>{t('none')}</i>}
              </td>
            </tr>
            {/* Clawback address */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_c.label')}</th>
              <td className='break-all'>
                {((storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_c) ||
                  <i className='opacity-50'>{t('none')}</i>}
              </td>
            </tr>
            {/* Reserve address */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_r.label')}</th>
              <td className='break-all'>
                {((storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_r) ||
                  <i className='opacity-50'>{t('none')}</i>}
              </td>
            </tr>
          </>}
        </>}

        {/* If asset freeze transaction */}
        {storedTxnData?.txn?.type === TransactionType.afrz && <>
          {/* Asset ID */}
          <tr>
            <th role='rowheader' className='align-top'>
              {storedTxnData?.retrievedAssetInfo?.name
                ? t('fields.faid.with_name_label') : t('fields.faid.label')
              }
            </th>
            <td>
              {storedTxnData?.retrievedAssetInfo?.name
                ? t('fields.faid.with_name', {
                  name: storedTxnData?.retrievedAssetInfo?.name,
                  id: (storedTxnData?.txn as TxnData.AssetFreezeTxnData)?.faid
                })
                : (storedTxnData?.txn as TxnData.AssetFreezeTxnData)?.faid
              }
            </td>
          </tr>
          {/* Freeze address */}
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.fadd.label')}</th>
            <td className='break-all'>{(storedTxnData?.txn as TxnData.AssetFreezeTxnData).fadd}</td>
          </tr>
          {/* Freeze asset? */}
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.afrz.label')}</th>
            <td>
              {(storedTxnData?.txn as TxnData.AssetFreezeTxnData).afrz
                ? <b>{t('fields.afrz.is_frozen')}</b>
                : t('fields.afrz.is_not_frozen')
              }
            </td>
          </tr>
        </>}

        {/* If key registration transaction */}
        {storedTxnData?.txn?.type === TransactionType.keyreg &&
        <>
          {/* If online key registration */}
          {txnTypeKeyPart === 'keyreg_on' && <>
            {/* Voting key */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.votekey.label')}</th>
              <td className='break-all'>{(storedTxnData?.txn as TxnData.KeyRegTxnData).votekey}</td>
            </tr>
            {/* Selection key */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.selkey.label')}</th>
              <td className='break-all'>{(storedTxnData?.txn as TxnData.KeyRegTxnData).selkey}</td>
            </tr>
            {/* State proof key */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.sprfkey.label')}</th>
              <td className='break-all'>{(storedTxnData?.txn as TxnData.KeyRegTxnData).sprfkey}</td>
            </tr>
            {/* First voting round */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.votefst.label')}</th>
              <td>
                {t('number_value', {value: (storedTxnData?.txn as TxnData.KeyRegTxnData).votefst})}
              </td>
            </tr>
            {/* Last voting round */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.votelst.label')}</th>
              <td>
                {t('number_value', {value: (storedTxnData?.txn as TxnData.KeyRegTxnData).votelst})}
              </td>
            </tr>
            {/* Voting key dilution */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.votekd.label')}</th>
              <td>
                {t('number_value', {value: (storedTxnData?.txn as TxnData.KeyRegTxnData).votekd})}
              </td>
            </tr>
          </>}
          {/* If nonparticipation key registration */}
          {txnTypeKeyPart === 'keyreg_nonpart' &&
            /* Nonparticipation */
            <tr className={(storedTxnData?.txn as TxnData.KeyRegTxnData)?.nonpart
              ? 'bg-warning text-warning-content'
              : ''
            }>
              <th role='rowheader' className='align-top'>{t('fields.nonpart.label')}</th>
              <td>
                {(storedTxnData?.txn as TxnData.KeyRegTxnData).nonpart
                  ? <b>{t('fields.nonpart.is_nonpart')}</b>
                  : t('fields.nonpart.is_not_nonpart')
                }
              </td>
            </tr>
          }
        </>}

        {/* If application type */}
        {storedTxnData?.txn?.type === TransactionType.appl && <>
          {/* OnComplete (Action type) */}
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apan.label')}</th>
            <td>
              {t('fields.apan.options.'
                + appTypes[(storedTxnData?.txn as TxnData.AppCallTxnData).apan]
              )}
            </td>
          </tr>
          { // If NOT an app creation transaction
          (storedTxnData?.txn as TxnData.AppCallTxnData).apid &&
          /* Application ID */
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apid.label')}</th>
            <td>{(storedTxnData?.txn as TxnData.AppCallTxnData).apid}</td>
          </tr>}
          {/* Application arguments */}
          <tr>
            <th role='rowheader' className='align-top'>
              {storedTxnData?.b64Apaa
                ? t('fields.base64.with_label', { label: t('fields.apaa.heading') })
                : t('fields.apaa.heading')
              }
            </th>
            <td>
              {!((storedTxnData?.txn as TxnData.AppCallTxnData).apaa.length)
                ? <i className='opacity-50'>{t('none')}</i>
                : <ol className='m-0'>
                  {(storedTxnData?.txn as TxnData.AppCallTxnData).apaa.map((arg, i) => (
                    <li key={`arg-${i}`}>
                      {arg || <i className='opacity-50'>{t('fields.apaa.empty')}</i>}
                    </li>
                  ))}
                </ol>
              }
            </td>
          </tr>

          {/* If application creation or update transaction */}
          {(txnTypeKeyPart === 'appl_create' || txnTypeKeyPart === 'appl_update') && <>
            {/* Approval program */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apap.label')}</th>
              <td className='break-all'>{(storedTxnData?.txn as TxnData.AppCallTxnData).apap}</td>
            </tr>
            {/* Clear-state program */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apsu.label')}</th>
              <td className='break-all'>{(storedTxnData?.txn as TxnData.AppCallTxnData).apsu}</td>
            </tr>
          </>}

          {/* If application creation transaction */}
          {txnTypeKeyPart === 'appl_create' && <>
            {/* Number of global integers */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apgs_nui.label')}</th>
              <td>{(storedTxnData?.txn as TxnData.AppCallTxnData).apgs_nui}</td>
            </tr>
            {/* Number of global byte slices */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apgs_nbs.label')}</th>
              <td>{(storedTxnData?.txn as TxnData.AppCallTxnData).apgs_nbs}</td>
            </tr>
            {/* Number of local integers */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apls_nui.label')}</th>
              <td>{(storedTxnData?.txn as TxnData.AppCallTxnData).apls_nui}</td>
            </tr>
            {/* Number of local byte slices */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apls_nbs.label')}</th>
              <td>{(storedTxnData?.txn as TxnData.AppCallTxnData).apls_nbs}</td>
            </tr>
            {/* Number of extra program pages */}
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apep.label')}</th>
              <td>{(storedTxnData?.txn as TxnData.AppCallTxnData).apep}</td>
            </tr>
          </>}
          {/* Foreign accounts */}
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apat.heading')}</th>
            <td>
              {!((storedTxnData?.txn as TxnData.AppCallTxnData).apat.length)
                ? <i className='opacity-50'>{t('none')}</i>
                : <ul className='m-0'>
                  {(storedTxnData?.txn as TxnData.AppCallTxnData).apat.map((acct, i) => (
                    <li className='break-all' key={`acct-${i}`}>{acct}</li>
                  ))}
                </ul>
              }
            </td>
          </tr>
          {/* Foreign applications */}
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apfa.heading')}</th>
            <td>
              {!((storedTxnData?.txn as TxnData.AppCallTxnData).apfa.length)
                ? <i className='opacity-50'>{t('none')}</i>
                : <ul className='m-0'>
                  {(storedTxnData?.txn as TxnData.AppCallTxnData).apfa.map((app, i) => (
                    <li key={`app-${i}`}>{app}</li>
                  ))}
                </ul>
              }
            </td>
          </tr>
          {/* Foreign assets */}
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apas.heading')}</th>
            <td>
              {!((storedTxnData?.txn as TxnData.AppCallTxnData).apas.length)
                ? <i className='opacity-50'>{t('none')}</i>
                : <ul className='m-0'>
                  {(storedTxnData?.txn as TxnData.AppCallTxnData).apas.map((asset, i) => (
                    <li key={`asset-${i}`}>{asset}</li>
                  ))}
                </ul>
              }
            </td>
          </tr>
          {/* Box references */}
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apbx.heading')}</th>
            <td>
              {!((storedTxnData?.txn as TxnData.AppCallTxnData).apbx.length)
                ? <i className='opacity-50'>{t('none')}</i>
                : <ol className='m-0'>
                  {(storedTxnData?.txn as TxnData.AppCallTxnData).apbx.map((box, i) => (
                    <li key={`box-${i}`}>
                      <ul className='m-0'>
                        {/* Box Index */}
                        <li className='m-0'>{t('fields.apbx_i.heading', {index: box.i})}</li>
                        {/* Box Name */}
                        <li className='m-0'>
                          <Trans t={t} i18nKey='fields.apbx_n.heading'
                            values={{ name: box.n || t('none') }}
                          >
                            name:
                            <span className={box.n ? '' : 'opacity-50 italic'}>
                              box_name
                            </span>
                          </Trans>
                        </li>
                      </ul>
                    </li>
                  ))}
                </ol>
              }
            </td>
          </tr>
        </>}

        {/* Note */}
        <tr>
          <th role='rowheader' className='align-top'>
            {storedTxnData?.b64Note
              ? t('fields.base64.with_label', { label: t('fields.note.label') })
              : t('fields.note.label')
            }
          </th>
          <td>
            {storedTxnData
            ? (storedTxnData?.txn?.note || <i className='opacity-50'>{t('none')}</i>)
            : t('loading')
          }</td>
        </tr>
        {/* Fee */}
        <tr className={(
          (storedTxnData?.txn?.fee ?? 0) > minFee.value || (fee.value ?? 0) > minFee.value
        ) ? 'bg-warning text-warning-content' : ''
        }>
          <th role='rowheader' className='align-top'>
            {t('fields.fee.label')}
            <span className='ms-2'>{
              storedTxnData?.useSugFee
                ? t('fields.use_sug_fee.using_sug') : t('fields.use_sug_fee.not_using_sug')
            }</span>
          </th>
          <td>
            {// Show fee when the store transaction data is loaded and the suggested fee is loaded
             // (if it is to be used)
            (storedTxnData && (!storedTxnData?.useSugFee || !!fee.value))
              ? t('fields.fee.in_coin', {
                  count: storedTxnData?.useSugFee
                    ? (fee.value ?? 0) : (storedTxnData?.txn as TxnData.BaseTxnData)?.fee,
                  coinName: nodeConfig.coinName || t('algo', {
                    count: storedTxnData?.useSugFee
                      ? (fee.value ?? 0) : (storedTxnData?.txn as TxnData.BaseTxnData)?.fee
                  }),
                  formatParams: { count: { maximumFractionDigits: 6 } }
                })
              : t('loading')
            }
          </td>
        </tr>
        {/* First valid round */}
        <tr>
          <th role='rowheader' className='align-top'>
            {t('fields.fv.label')}
            <span className='ms-2'>{
              storedTxnData?.useSugRounds
                ? t('fields.use_sug_rounds.using_sug') : t('fields.use_sug_rounds.not_using_sug')
            }</span>
          </th>
          <td>
            {// Show first round when the store transaction data is loaded and the suggested rounds
             // is loaded (if it is to be used)
            (storedTxnData && (!storedTxnData?.useSugRounds || !!fv.value))
              ? t('number_value', {
                value: storedTxnData?.useSugRounds
                    ? (fv.value ?? 0) : (storedTxnData?.txn as TxnData.BaseTxnData)?.fv
                })
              : t('loading')
            }
          </td>
        </tr>
        {/* Last valid round */}
        <tr>
          <th role='rowheader' className='align-top'>
            {t('fields.lv.label')}
            <span className='ms-2'>{
              storedTxnData?.useSugRounds
                ? t('fields.use_sug_rounds.using_sug') : t('fields.use_sug_rounds.not_using_sug')
            }</span>
          </th>
          <td>
            {// Show last round when the store transaction data is loaded and the suggested rounds
             // is loaded (if it is to be used)
            (storedTxnData && (!storedTxnData?.useSugRounds || !!lv.value))
              ? t('number_value', {
                value: storedTxnData?.useSugRounds
                    ? (lv.value ?? 0) : (storedTxnData?.txn as TxnData.BaseTxnData)?.lv
                })
              : t('loading')
            }
          </td>
        </tr>
        {/* Lease */}
        <tr>
          <th role='rowheader' className='align-top'>
            {storedTxnData?.b64Lx
              ? t('fields.base64.with_label', { label: t('fields.lx.label') })
              : t('fields.lx.label')
            }
          </th>
          <td className='break-all'>
            {storedTxnData
              ? (storedTxnData?.txn?.lx || <i className='opacity-50'>{t('none')}</i>)
              : t('loading')
            }
          </td>
        </tr>
        {/* Rekey */}
        <tr className={storedTxnData?.txn?.rekey ? 'bg-warning text-warning-content' : ''}>
          <th role='rowheader' className='align-top'>{t('fields.rekey.label')}</th>
          <td className='break-all'>{storedTxnData
            ? (storedTxnData?.txn?.rekey || <i className='opacity-50'>{t('none')}</i>)
            : t('loading')
          }
          </td>
        </tr>

      </tbody>
    </table>
    }
    {!isImporting && !storedTxnData && <div className='text-center'>
      <PageLoadingPlaceholder />
      <p className='my-0'>{t('sign_txn:loading.wait_msg')}</p>
      <Link className="link text-accent"
        replace={true}
        href={`/${lng}/txn/sign?${importParamName}`}
      >
        {t('sign_txn:loading.import_link')}
      </Link>
    </div>}
  </>);
}
