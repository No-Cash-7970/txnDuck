'use client';

import { useTranslation } from '@/app/i18n/client';
import * as TxnData from '@/app/lib/txn-data';
import { TransactionType } from 'algosdk';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { Trans } from 'react-i18next';

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
  const { t } = useTranslation(lng || '', ['compose_txn', 'common']);
  const storedTxnData = useAtomValue(TxnData.storedTxnDataAtom);

  /**
   * Get the part of the i18n translation key for the given transaction type
   *
   * @returns Part of the i18n translation key for the transaction type
   */
  const txnTypeKeyPart = useMemo((): string => {
    const type = storedTxnData?.type;

    if (type === TransactionType.acfg) {
      if (!((storedTxnData as TxnData.AssetConfigTxnData).caid)) return 'acfg_create';

      if (!((storedTxnData as TxnData.AssetConfigTxnData)?.apar_m)
        && !((storedTxnData as TxnData.AssetConfigTxnData)?.apar_f)
        && !((storedTxnData as TxnData.AssetConfigTxnData)?.apar_c)
        && !((storedTxnData as TxnData.AssetConfigTxnData)?.apar_r)
      ) {
        return 'acfg_destroy';
      }

      return 'acfg_reconfig';
    }

    if (type === TransactionType.keyreg) {
      if ((storedTxnData as TxnData.KeyRegTxnData)?.nonpart) return 'keyreg_nonpart';

      if ((storedTxnData as TxnData.KeyRegTxnData)?.votekey
        || (storedTxnData as TxnData.KeyRegTxnData)?.selkey
        || (storedTxnData as TxnData.KeyRegTxnData)?.sprfkey
        || (storedTxnData as TxnData.KeyRegTxnData)?.votefst
        || (storedTxnData as TxnData.KeyRegTxnData)?.votelst
        || (storedTxnData as TxnData.KeyRegTxnData)?.votekd
      ) {
        return 'keyreg_on';
      }

      return 'keyreg_off';
    }

    if (type === TransactionType.appl) {
      if (!((storedTxnData as TxnData.AppCallTxnData)?.apid)) return 'appl_create';

      return 'appl_' + appTypes[(storedTxnData as TxnData.AppCallTxnData)?.apan];
    }

    return `${type}` ?? '';
  }, [storedTxnData]);

  return (
    <table className='table'>
      <tbody>
        <tr>
          <th role='rowheader' className='align-top'>{t('fields.type.label')}</th>
          <td>{ txnTypeKeyPart !== 'undefined'
            ? t(`fields.type.options.${txnTypeKeyPart}`)
            : t('loading')
          }</td>
        </tr>
        <tr>
          <th role='rowheader' className='align-top'>{t('fields.snd.label')}</th>
          <td className='break-all'>{storedTxnData ? storedTxnData?.snd : t('loading')}</td>
        </tr>

        {storedTxnData?.type === TransactionType.pay && <>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.rcv.label')}</th>
            <td className='break-all'>{(storedTxnData as TxnData.PaymentTxnData)?.rcv}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.amt.label')}</th>
            <td>
              {t('fields.amt.in_algos', {
                count: (storedTxnData as TxnData.PaymentTxnData)?.amt,
                formatParams: { count: { maximumFractionDigits: 6 } }
              })}
            </td>
          </tr>
        </>}

        {storedTxnData?.type === TransactionType.axfer && <>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.arcv.label')}</th>
            <td className='break-all'>{(storedTxnData as TxnData.AssetTransferTxnData)?.arcv}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.xaid.label')}</th>
            <td>{(storedTxnData as TxnData.AssetTransferTxnData)?.xaid}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.aamt.label')}</th>
            <td>
              {t('number_value', {value: (storedTxnData as TxnData.AssetTransferTxnData)?.aamt})}
            </td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.asnd.label')}</th>
            <td className='break-all'>
              {(storedTxnData as TxnData.AssetTransferTxnData)?.asnd ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>
        </>}

        {storedTxnData?.type === TransactionType.acfg && <>
          { // If NOT an asset creation transaction
          (storedTxnData as TxnData.AssetConfigTxnData).caid &&
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.caid.label')}</th>
            <td>{(storedTxnData as TxnData.AssetConfigTxnData).caid}</td>
          </tr>}

          { // If an asset creation transaction
          !((storedTxnData as TxnData.AssetConfigTxnData).caid) && <>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_un.label')}</th>
              <td>
                {(storedTxnData as TxnData.AssetConfigTxnData)?.apar_un ||
                  <i className='opacity-50'>{t('none')}</i>}
              </td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_an.label')}</th>
              <td>
                {(storedTxnData as TxnData.AssetConfigTxnData)?.apar_an ||
                  <i className='opacity-50'>{t('none')}</i>}
              </td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_t.label')}</th>
              <td>
                {t('number_value', {value: (storedTxnData as TxnData.AssetConfigTxnData)?.apar_t})}
              </td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_dc.label')}</th>
              <td>{(storedTxnData as TxnData.AssetConfigTxnData)?.apar_dc}</td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_df.label')}</th>
              <td>
                {(storedTxnData as TxnData.AssetConfigTxnData)?.apar_df
                  ? <b>{t('fields.apar_df.is_frozen')}</b>
                  : t('fields.apar_df.is_not_frozen')
                }
              </td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_au.label')}</th>
              <td>
                {(storedTxnData as TxnData.AssetConfigTxnData)?.apar_au ||
                  <i className='opacity-50'>{t('none')}</i>}
              </td>
            </tr>
          </>}
        </>}

        {storedTxnData?.type === TransactionType.afrz && <>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.faid.label')}</th>
            <td>{(storedTxnData as TxnData.AssetFreezeTxnData).faid}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.fadd.label')}</th>
            <td className='break-all'>{(storedTxnData as TxnData.AssetFreezeTxnData).fadd}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.afrz.label')}</th>
            <td>
              {(storedTxnData as TxnData.AssetFreezeTxnData).afrz
                ? <b>{t('fields.afrz.is_frozen')}</b>
                : t('fields.afrz.is_not_frozen')
              }
            </td>
          </tr>
        </>}

        {storedTxnData?.type === TransactionType.keyreg && txnTypeKeyPart === 'keyreg_on' &&
        <>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.votekey.label')}</th>
            <td className='break-all'>{(storedTxnData as TxnData.KeyRegTxnData).votekey}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.selkey.label')}</th>
            <td className='break-all'>{(storedTxnData as TxnData.KeyRegTxnData).selkey}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.sprfkey.label')}</th>
            <td className='break-all'>{(storedTxnData as TxnData.KeyRegTxnData).sprfkey}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.votefst.label')}</th>
            <td>{t('number_value', {value: (storedTxnData as TxnData.KeyRegTxnData).votefst})}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.votelst.label')}</th>
            <td>{t('number_value', {value: (storedTxnData as TxnData.KeyRegTxnData).votelst})}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.votekd.label')}</th>
            <td>{t('number_value', {value: (storedTxnData as TxnData.KeyRegTxnData).votekd})}</td>
          </tr>
        </>}

        {storedTxnData?.type === TransactionType.appl && <>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apan.label')}</th>
            <td>{
              t('fields.apan.options.' + appTypes[(storedTxnData as TxnData.AppCallTxnData).apan])
            }</td>
          </tr>
          { // If NOT an app creation transaction
          (storedTxnData as TxnData.AppCallTxnData).apid &&
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apid.label')}</th>
            <td>{(storedTxnData as TxnData.AppCallTxnData).apid}</td>
          </tr>}
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apaa.title')}</th>
            <td>
              {!((storedTxnData as TxnData.AppCallTxnData).apaa.length)
                ? <i className='opacity-50'>{t('none')}</i>
                : <ol className='m-0'>
                  {(storedTxnData as TxnData.AppCallTxnData).apaa.map((arg, i) => (
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
              <td className='break-all'>{(storedTxnData as TxnData.AppCallTxnData).apap}</td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apsu.label')}</th>
              <td className='break-all'>{(storedTxnData as TxnData.AppCallTxnData).apsu}</td>
            </tr>
          </>}

          {txnTypeKeyPart === 'appl_create' && <>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apgs_nui.label')}</th>
              <td>{(storedTxnData as TxnData.AppCallTxnData).apgs_nui}</td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apgs_nbs.label')}</th>
              <td>{(storedTxnData as TxnData.AppCallTxnData).apgs_nbs}</td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apls_nui.label')}</th>
              <td>{(storedTxnData as TxnData.AppCallTxnData).apls_nui}</td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apls_nbs.label')}</th>
              <td>{(storedTxnData as TxnData.AppCallTxnData).apls_nbs}</td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apep.label')}</th>
              <td>{(storedTxnData as TxnData.AppCallTxnData).apep}</td>
            </tr>
          </>}
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apat.title')}</th>
            <td>
              {!((storedTxnData as TxnData.AppCallTxnData).apat.length)
                ? <i className='opacity-50'>{t('none')}</i>
                : <ul className='m-0'>
                  {(storedTxnData as TxnData.AppCallTxnData).apat.map((acct, i) => (
                    <li className='break-all' key={`acct-${i}`}>{acct}</li>
                  ))}
                </ul>
              }
            </td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apfa.title')}</th>
            <td>
              {!((storedTxnData as TxnData.AppCallTxnData).apfa.length)
                ? <i className='opacity-50'>{t('none')}</i>
                : <ul className='m-0'>
                  {(storedTxnData as TxnData.AppCallTxnData).apfa.map((app, i) => (
                    <li key={`app-${i}`}>{app}</li>
                  ))}
                </ul>
              }
            </td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apas.title')}</th>
            <td>
              {!((storedTxnData as TxnData.AppCallTxnData).apas.length)
                ? <i className='opacity-50'>{t('none')}</i>
                : <ul className='m-0'>
                  {(storedTxnData as TxnData.AppCallTxnData).apas.map((asset, i) => (
                    <li key={`asset-${i}`}>{asset}</li>
                  ))}
                </ul>
              }
            </td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apbx.title')}</th>
            <td>
              {!((storedTxnData as TxnData.AppCallTxnData).apbx.length)
                ? <i className='opacity-50'>{t('none')}</i>
                : <ol className='m-0'>
                  {(storedTxnData as TxnData.AppCallTxnData).apbx.map((box, i) => (
                    <li key={`box-${i}`}>
                      <ul className='m-0'>
                        <li className='m-0'>{t('fields.apbx_i.title', {id: box.i})}</li>
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

        <tr>
          <th role='rowheader' className='align-top'>{t('fields.fee.label')}</th>
          <td>
            {storedTxnData
              ? t('fields.fee.in_algos', {
                count: (storedTxnData as TxnData.PaymentTxnData)?.fee,
                formatParams: { count: { maximumFractionDigits: 6 } }
              })
              : t('loading')
            }
          </td>
        </tr>
        <tr>
          <th role='rowheader' className='align-top'>{t('fields.note.label')}</th>
          <td>{storedTxnData
            ? (storedTxnData?.note || <i className='opacity-50'>{t('none')}</i>)
            : t('loading')
          }</td>
        </tr>

        {storedTxnData?.type === TransactionType.acfg && txnTypeKeyPart !== 'acfg_destroy' && <>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apar_m.label')}</th>
            <td className='break-all'>
              {((storedTxnData as TxnData.AssetConfigTxnData)?.apar_m) ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apar_f.label')}</th>
            <td className='break-all'>
              {((storedTxnData as TxnData.AssetConfigTxnData)?.apar_f) ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apar_c.label')}</th>
            <td className='break-all'>
              {((storedTxnData as TxnData.AssetConfigTxnData)?.apar_c) ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apar_r.label')}</th>
            <td className='break-all'>
              {((storedTxnData as TxnData.AssetConfigTxnData)?.apar_r) ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>

          { // If an asset creation transaction
          !((storedTxnData as TxnData.AssetConfigTxnData)?.caid) && <>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_am.label')}</th>
              <td>
                {((storedTxnData as TxnData.AssetConfigTxnData)?.apar_am) ||
                  <i className='opacity-50'>{t('none')}</i>}
              </td>
            </tr>
          </>}

        </>}

        {storedTxnData?.type === TransactionType.keyreg && txnTypeKeyPart === 'keyreg_nonpart' &&
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.nonpart.label')}</th>
            <td>
              {(storedTxnData as TxnData.KeyRegTxnData).nonpart
                ? <b>{t('fields.nonpart.is_nonpart')}</b>
                : t('fields.nonpart.is_not_nonpart')
              }
            </td>
          </tr>
        }

        <tr>
          <th role='rowheader' className='align-top'>{t('fields.fv.label')}</th>
          <td>{storedTxnData ? t('number_value', {value: storedTxnData?.fv}) : t('loading')}</td>
        </tr>
        <tr>
          <th role='rowheader' className='align-top'>{t('fields.lv.label')}</th>
          <td>{storedTxnData ? t('number_value', {value: storedTxnData?.lv}) : t('loading')}</td>
        </tr>
        <tr>
          <th role='rowheader' className='align-top'>{t('fields.lx.label')}</th>
          <td className='break-all'>{storedTxnData
            ? (storedTxnData?.lx || <i className='opacity-50'>{t('none')}</i>)
            : t('loading')
          }</td>
        </tr>
        <tr className={storedTxnData?.rekey ? 'bg-warning text-warning-content' : ''}>
          <th role='rowheader' className='align-top'>{t('fields.rekey.label')}</th>
          <td className='break-all'>{storedTxnData
            ? (storedTxnData?.rekey || <i className='opacity-50'>{t('none')}</i>)
            : t('loading')
          }
          </td>
        </tr>

        {storedTxnData?.type === TransactionType.pay &&
          <tr className={(storedTxnData as TxnData.PaymentTxnData)?.close
            ? 'bg-warning text-warning-content'
            : ''
          }>
            <th role='rowheader' className='align-top'>{t('fields.close.label')}</th>
            <td className='break-all'>
              {(storedTxnData as TxnData.PaymentTxnData)?.close
                || <i className='opacity-50'>{t('none')}</i>
              }
            </td>
          </tr>
        }

        {storedTxnData?.type === TransactionType.axfer &&
          <tr className={(storedTxnData as TxnData.AssetTransferTxnData)?.aclose
            ? 'bg-warning text-warning-content'
            : ''
          }>
            <th role='rowheader' className='align-top'>{t('fields.aclose.label')}</th>
            <td className='break-all'>
              {(storedTxnData as TxnData.AssetTransferTxnData)?.aclose ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>
        }
      </tbody>
    </table>
  );
}
