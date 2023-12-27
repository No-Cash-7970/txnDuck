'use client';

import { useTranslation } from '@/app/i18n/client';
import * as TxnData from '@/app/lib/txn-data';
import { ALGORAND_MIN_TX_FEE, TransactionType, microalgosToAlgos } from 'algosdk';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { Trans } from 'react-i18next';
import { nodeConfigAtom } from '@/app/lib/node-config';
import { fee as feeAtom } from '@/app/lib/txn-data/atoms';
import { baseUnitsToDecimal } from '@/app/lib/utils';

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
  const { t } = useTranslation(lng || '', ['compose_txn', 'common', 'app']);
  const nodeConfig = useAtomValue(nodeConfigAtom);
  const storedTxnData = useAtomValue(TxnData.storedTxnDataAtom);
  const fee = useAtomValue(feeAtom);

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

    return `${type}` ?? '';
  }, [storedTxnData]);

  return (
    <table className='table'>
      <tbody>
        <tr>
          <th role='rowheader' className='align-top'>{t('app:node_selector.node_network')}</th>
          <td className='break-all'>{nodeConfig
            ? ((nodeConfig.network === 'mainnet'
              || nodeConfig.network === 'testnet'
              || nodeConfig.network === 'betanet')
              ? t(`app:node_selector.${nodeConfig.network}`)
              : nodeConfig.network)
            : t('loading')
          }</td>
        </tr>
        <tr>
          <th role='rowheader' className='align-top'>{t('fields.type.label')}</th>
          <td>{ txnTypeKeyPart !== 'undefined'
            ? t(`fields.type.options.${txnTypeKeyPart}`)
            : t('loading')
          }</td>
        </tr>
        <tr>
          <th role='rowheader' className='align-top'>{t('fields.snd.label')}</th>
          <td className='break-all'>{storedTxnData ? storedTxnData?.txn?.snd : t('loading')}</td>
        </tr>

        {storedTxnData?.txn?.type === TransactionType.pay && <>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.rcv.label')}</th>
            <td className='break-all'>{(storedTxnData?.txn as TxnData.PaymentTxnData)?.rcv}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.amt.label')}</th>
            <td>
              {t('fields.amt.in_algos', {
                count: (storedTxnData?.txn as TxnData.PaymentTxnData)?.amt,
                formatParams: { count: { maximumFractionDigits: 6 } }
              })}
            </td>
          </tr>
        </>}

        {storedTxnData?.txn?.type === TransactionType.axfer && <>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.arcv.label')}</th>
            <td className='break-all'>
              {(storedTxnData?.txn as TxnData.AssetTransferTxnData)?.arcv}
            </td>
          </tr>
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
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.asnd.label')}</th>
            <td className='break-all'>
              {(storedTxnData?.txn as TxnData.AssetTransferTxnData)?.asnd ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>
        </>}

        {storedTxnData?.txn?.type === TransactionType.acfg && <>
          { // If NOT an asset creation transaction
          (storedTxnData?.txn as TxnData.AssetConfigTxnData).caid &&
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
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_un.label')}</th>
              <td>
                {(storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_un ||
                  <i className='opacity-50'>{t('none')}</i>}
              </td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_an.label')}</th>
              <td>
                {(storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_an ||
                  <i className='opacity-50'>{t('none')}</i>}
              </td>
            </tr>
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
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_dc.label')}</th>
              <td>{(storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_dc}</td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_df.label')}</th>
              <td>
                {(storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_df
                  ? <b>{t('fields.apar_df.is_frozen')}</b>
                  : t('fields.apar_df.is_not_frozen')
                }
              </td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_au.label')}</th>
              <td>
                {(storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_au ||
                  <i className='opacity-50'>{t('none')}</i>}
              </td>
            </tr>
          </>}
        </>}

        {storedTxnData?.txn?.type === TransactionType.afrz && <>
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
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.fadd.label')}</th>
            <td className='break-all'>{(storedTxnData?.txn as TxnData.AssetFreezeTxnData).fadd}</td>
          </tr>
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

        {storedTxnData?.txn?.type === TransactionType.keyreg && txnTypeKeyPart === 'keyreg_on' &&
        <>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.votekey.label')}</th>
            <td className='break-all'>{(storedTxnData?.txn as TxnData.KeyRegTxnData).votekey}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.selkey.label')}</th>
            <td className='break-all'>{(storedTxnData?.txn as TxnData.KeyRegTxnData).selkey}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.sprfkey.label')}</th>
            <td className='break-all'>{(storedTxnData?.txn as TxnData.KeyRegTxnData).sprfkey}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.votefst.label')}</th>
            <td>
              {t('number_value', {value: (storedTxnData?.txn as TxnData.KeyRegTxnData).votefst})}
            </td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.votelst.label')}</th>
            <td>
              {t('number_value', {value: (storedTxnData?.txn as TxnData.KeyRegTxnData).votelst})}
            </td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.votekd.label')}</th>
            <td>
              {t('number_value', {value: (storedTxnData?.txn as TxnData.KeyRegTxnData).votekd})}
            </td>
          </tr>
        </>}

        {storedTxnData?.txn?.type === TransactionType.appl && <>
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
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apid.label')}</th>
            <td>{(storedTxnData?.txn as TxnData.AppCallTxnData).apid}</td>
          </tr>}
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apaa.title')}</th>
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

          {(txnTypeKeyPart === 'appl_create' || txnTypeKeyPart === 'appl_update') && <>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apap.label')}</th>
              <td className='break-all'>{(storedTxnData?.txn as TxnData.AppCallTxnData).apap}</td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apsu.label')}</th>
              <td className='break-all'>{(storedTxnData?.txn as TxnData.AppCallTxnData).apsu}</td>
            </tr>
          </>}

          {txnTypeKeyPart === 'appl_create' && <>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apgs_nui.label')}</th>
              <td>{(storedTxnData?.txn as TxnData.AppCallTxnData).apgs_nui}</td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apgs_nbs.label')}</th>
              <td>{(storedTxnData?.txn as TxnData.AppCallTxnData).apgs_nbs}</td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apls_nui.label')}</th>
              <td>{(storedTxnData?.txn as TxnData.AppCallTxnData).apls_nui}</td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apls_nbs.label')}</th>
              <td>{(storedTxnData?.txn as TxnData.AppCallTxnData).apls_nbs}</td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apep.label')}</th>
              <td>{(storedTxnData?.txn as TxnData.AppCallTxnData).apep}</td>
            </tr>
          </>}
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apat.title')}</th>
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
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apfa.title')}</th>
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
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apas.title')}</th>
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
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apbx.title')}</th>
            <td>
              {!((storedTxnData?.txn as TxnData.AppCallTxnData).apbx.length)
                ? <i className='opacity-50'>{t('none')}</i>
                : <ol className='m-0'>
                  {(storedTxnData?.txn as TxnData.AppCallTxnData).apbx.map((box, i) => (
                    <li key={`box-${i}`}>
                      <ul className='m-0'>
                        <li className='m-0'>{t('fields.apbx_i.title', {index: box.i})}</li>
                        <li className='m-0'>
                          <Trans t={t} i18nKey='fields.apbx_n.title'
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

        <tr className={(
          (storedTxnData?.txn?.fee ?? 0) > microalgosToAlgos(ALGORAND_MIN_TX_FEE)
          || (fee.value ?? 0) > microalgosToAlgos(ALGORAND_MIN_TX_FEE)
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
            {storedTxnData
              ? <>
                {t('fields.fee.in_algos', {
                  count: storedTxnData?.useSugFee
                    ? (fee.value ?? 0) : (storedTxnData?.txn as TxnData.BaseTxnData)?.fee,
                  formatParams: { count: { maximumFractionDigits: 6 } }
                })}
              </>
              : t('loading')
            }
          </td>
        </tr>
        <tr>
          <th role='rowheader' className='align-top'>{t('fields.note.label')}</th>
          <td>{storedTxnData
            ? (storedTxnData?.txn?.note || <i className='opacity-50'>{t('none')}</i>)
            : t('loading')
          }</td>
        </tr>

        {storedTxnData?.txn?.type === TransactionType.acfg && txnTypeKeyPart !== 'acfg_destroy' &&
        <>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apar_m.label')}</th>
            <td className='break-all'>
              {((storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_m) ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apar_f.label')}</th>
            <td className='break-all'>
              {((storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_f) ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apar_c.label')}</th>
            <td className='break-all'>
              {((storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_c) ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apar_r.label')}</th>
            <td className='break-all'>
              {((storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_r) ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>

          { // If an asset creation transaction
          !((storedTxnData?.txn as TxnData.AssetConfigTxnData)?.caid) && <>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_am.label')}</th>
              <td>
                {((storedTxnData?.txn as TxnData.AssetConfigTxnData)?.apar_am) ||
                  <i className='opacity-50'>{t('none')}</i>}
              </td>
            </tr>
          </>}

        </>}

        {storedTxnData?.txn?.type === TransactionType.keyreg &&
        txnTypeKeyPart === 'keyreg_nonpart' &&
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.nonpart.label')}</th>
            <td>
              {(storedTxnData?.txn as TxnData.KeyRegTxnData).nonpart
                ? <b>{t('fields.nonpart.is_nonpart')}</b>
                : t('fields.nonpart.is_not_nonpart')
              }
            </td>
          </tr>
        }

        <tr>
          <th role='rowheader' className='align-top'>
            {t('fields.fv.label')}
            <span className='ms-2'>{
              storedTxnData?.useSugRounds
                ? t('fields.use_sug_rounds.using_sug') : t('fields.use_sug_rounds.not_using_sug')
            }</span>
          </th>
          <td>
            {storedTxnData ? t('number_value', {value: storedTxnData?.txn?.fv}) : t('loading')}
          </td>
        </tr>
        <tr>
          <th role='rowheader' className='align-top'>
            {t('fields.lv.label')}
            <span className='ms-2'>{
              storedTxnData?.useSugRounds
                ? t('fields.use_sug_rounds.using_sug') : t('fields.use_sug_rounds.not_using_sug')
            }</span>
          </th>
          <td>
            {storedTxnData ? t('number_value', {value: storedTxnData?.txn?.lv}) : t('loading')}
          </td>
        </tr>
        <tr>
          <th role='rowheader' className='align-top'>{t('fields.lx.label')}</th>
          <td className='break-all'>{storedTxnData
            ? (storedTxnData?.txn?.lx || <i className='opacity-50'>{t('none')}</i>)
            : t('loading')
          }</td>
        </tr>
        <tr className={storedTxnData?.txn?.rekey ? 'bg-warning text-warning-content' : ''}>
          <th role='rowheader' className='align-top'>{t('fields.rekey.label')}</th>
          <td className='break-all'>{storedTxnData
            ? (storedTxnData?.txn?.rekey || <i className='opacity-50'>{t('none')}</i>)
            : t('loading')
          }
          </td>
        </tr>

        {storedTxnData?.txn?.type === TransactionType.pay &&
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
        }

        {storedTxnData?.txn?.type === TransactionType.axfer &&
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
        }
      </tbody>
    </table>
  );
}
