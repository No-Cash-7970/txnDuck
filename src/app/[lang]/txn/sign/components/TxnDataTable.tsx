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

export default function TxnDataTable({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['compose_txn', 'common']);
  const storedTxnData = useAtomValue(TxnData.storedTxnDataAtom);
  const txnData = storedTxnData?.txn;

  /**
   * Get the part of the i18n translation key for the given transaction type
   *
   * @returns Part of the i18n translation key for the transaction type
   */
  const txnTypeKeyPart = useMemo((): string => {
    const type = txnData?.type;

    if (type === TransactionType.acfg) {
      if (!((txnData as TxnData.AssetConfigTxnData).caid)) return 'acfg_create';

      if (!((txnData as TxnData.AssetConfigTxnData).apar_m)
        && !((txnData as TxnData.AssetConfigTxnData).apar_f)
        && !((txnData as TxnData.AssetConfigTxnData).apar_c)
        && !((txnData as TxnData.AssetConfigTxnData).apar_r)
      ) {
        return 'acfg_destroy';
      }

      return 'acfg_reconfig';
    }

    if (type === TransactionType.keyreg) {
      if ((txnData as TxnData.KeyRegTxnData).nonpart) return 'keyreg_nonpart';

      if ((txnData as TxnData.KeyRegTxnData).votekey
        || (txnData as TxnData.KeyRegTxnData).selkey
        || (txnData as TxnData.KeyRegTxnData).sprfkey
        || (txnData as TxnData.KeyRegTxnData).votefst
        || (txnData as TxnData.KeyRegTxnData).votelst
        || (txnData as TxnData.KeyRegTxnData).votekd
      ) {
        return 'keyreg_on';
      }

      return 'keyreg_off';
    }

    if (type === TransactionType.appl) {
      if (!((txnData as TxnData.AppCallTxnData).apid)) return 'appl_create';

      return 'appl_' + appTypes[(txnData as TxnData.AppCallTxnData).apan];
    }

    return `${type}` ?? '';
  }, [txnData]);

  return (
    <table className='table'>
      <tbody>
        <tr>
          <th role='rowheader' className='align-top'>{t('fields.type.label')}</th>
          <td>{t(`fields.type.options.${txnTypeKeyPart}`)}</td>
        </tr>
        <tr>
          <th role='rowheader' className='align-top'>{t('fields.snd.label')}</th>
          <td className='break-all'>{txnData?.snd}</td>
        </tr>

        {txnData?.type === TransactionType.pay && <>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.rcv.label')}</th>
            <td className='break-all'>{(txnData as TxnData.PaymentTxnData)?.rcv}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.amt.label')}</th>
            <td>
              {t('fields.amt.in_algos', {
                count: (txnData as TxnData.PaymentTxnData)?.amt,
                formatParams: { count: { maximumFractionDigits: 6 } }
              })}
            </td>
          </tr>
        </>}

        {txnData?.type === TransactionType.axfer && <>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.arcv.label')}</th>
            <td className='break-all'>{(txnData as TxnData.AssetTransferTxnData)?.arcv}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.xaid.label')}</th>
            <td>{(txnData as TxnData.AssetTransferTxnData)?.xaid}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.aamt.label')}</th>
            <td>{t('number_value', {value: (txnData as TxnData.AssetTransferTxnData)?.aamt})}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.asnd.label')}</th>
            <td className='break-all'>
              {(txnData as TxnData.AssetTransferTxnData)?.asnd ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>
        </>}

        {txnData?.type === TransactionType.acfg && <>
          { // If NOT an asset creation transaction
          (txnData as TxnData.AssetConfigTxnData).caid &&
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.caid.label')}</th>
            <td>{(txnData as TxnData.AssetConfigTxnData).caid}</td>
          </tr>}

          { // If an asset creation transaction
          !((txnData as TxnData.AssetConfigTxnData).caid) && <>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_un.label')}</th>
              <td>
                {(txnData as TxnData.AssetConfigTxnData)?.apar_un ||
                  <i className='opacity-50'>{t('none')}</i>}
              </td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_an.label')}</th>
              <td>
                {(txnData as TxnData.AssetConfigTxnData)?.apar_an ||
                  <i className='opacity-50'>{t('none')}</i>}
              </td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_t.label')}</th>
              <td>{t('number_value', {value: (txnData as TxnData.AssetConfigTxnData)?.apar_t})}</td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_dc.label')}</th>
              <td>{(txnData as TxnData.AssetConfigTxnData)?.apar_dc}</td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_df.label')}</th>
              <td>
                {(txnData as TxnData.AssetConfigTxnData)?.apar_df
                  ? <b>{t('fields.apar_df.is_frozen')}</b>
                  : t('fields.apar_df.is_not_frozen')
                }
              </td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_au.label')}</th>
              <td>
                {(txnData as TxnData.AssetConfigTxnData)?.apar_au ||
                  <i className='opacity-50'>{t('none')}</i>}
              </td>
            </tr>
          </>}
        </>}

        {txnData?.type === TransactionType.afrz && <>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.faid.label')}</th>
            <td>{(txnData as TxnData.AssetFreezeTxnData).faid}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.fadd.label')}</th>
            <td className='break-all'>{(txnData as TxnData.AssetFreezeTxnData).fadd}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.afrz.label')}</th>
            <td>
              {(txnData as TxnData.AssetFreezeTxnData).afrz
                ? <b>{t('fields.afrz.is_frozen')}</b>
                : t('fields.afrz.is_not_frozen')
              }
            </td>
          </tr>
        </>}

        {txnData?.type === TransactionType.keyreg && txnTypeKeyPart === 'keyreg_on' &&
        <>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.votekey.label')}</th>
            <td className='break-all'>{(txnData as TxnData.KeyRegTxnData).votekey}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.selkey.label')}</th>
            <td className='break-all'>{(txnData as TxnData.KeyRegTxnData).selkey}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.sprfkey.label')}</th>
            <td className='break-all'>{(txnData as TxnData.KeyRegTxnData).sprfkey}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.votefst.label')}</th>
            <td>{t('number_value', {value: (txnData as TxnData.KeyRegTxnData).votefst})}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.votelst.label')}</th>
            <td>{t('number_value', {value: (txnData as TxnData.KeyRegTxnData).votelst})}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.votekd.label')}</th>
            <td>{t('number_value', {value: (txnData as TxnData.KeyRegTxnData).votekd})}</td>
          </tr>
        </>}

        {txnData?.type === TransactionType.appl && <>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apan.label')}</th>
            <td>{
              t('fields.apan.options.' + appTypes[(txnData as TxnData.AppCallTxnData).apan])
            }</td>
          </tr>
          { // If NOT an app creation transaction
          (txnData as TxnData.AppCallTxnData).apid &&
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apid.label')}</th>
            <td>{(txnData as TxnData.AppCallTxnData).apid}</td>
          </tr>}
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apaa.title')}</th>
            <td>
              {!((txnData as TxnData.AppCallTxnData).apaa.length)
                ? <i className='opacity-50'>{t('none')}</i>
                : <ol className='m-0'>
                  {(txnData as TxnData.AppCallTxnData).apaa.map((arg, i) => (
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
              <td className='break-all'>{(txnData as TxnData.AppCallTxnData).apap}</td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apsu.label')}</th>
              <td className='break-all'>{(txnData as TxnData.AppCallTxnData).apsu}</td>
            </tr>
          </>}

          {txnTypeKeyPart === 'appl_create' && <>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apgs_nui.label')}</th>
              <td>{(txnData as TxnData.AppCallTxnData).apgs_nui}</td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apgs_nbs.label')}</th>
              <td>{(txnData as TxnData.AppCallTxnData).apgs_nbs}</td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apls_nui.label')}</th>
              <td>{(txnData as TxnData.AppCallTxnData).apls_nui}</td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apls_nbs.label')}</th>
              <td>{(txnData as TxnData.AppCallTxnData).apls_nbs}</td>
            </tr>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apep.label')}</th>
              <td>{(txnData as TxnData.AppCallTxnData).apep}</td>
            </tr>
          </>}
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apat.title')}</th>
            <td>
              {!((txnData as TxnData.AppCallTxnData).apat.length)
                ? <i className='opacity-50'>{t('none')}</i>
                : <ul className='m-0'>
                  {(txnData as TxnData.AppCallTxnData).apat.map((acct, i) => (
                    <li className='break-all' key={`acct-${i}`}>{acct}</li>
                  ))}
                </ul>
              }
            </td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apfa.title')}</th>
            <td>
              {!((txnData as TxnData.AppCallTxnData).apfa.length)
                ? <i className='opacity-50'>{t('none')}</i>
                : <ul className='m-0'>
                  {(txnData as TxnData.AppCallTxnData).apfa.map((app, i) => (
                    <li key={`app-${i}`}>{app}</li>
                  ))}
                </ul>
              }
            </td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apas.title')}</th>
            <td>
              {!((txnData as TxnData.AppCallTxnData).apas.length)
                ? <i className='opacity-50'>{t('none')}</i>
                : <ul className='m-0'>
                  {(txnData as TxnData.AppCallTxnData).apas.map((asset, i) => (
                    <li key={`asset-${i}`}>{asset}</li>
                  ))}
                </ul>
              }
            </td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apbx.title')}</th>
            <td>
              {!((txnData as TxnData.AppCallTxnData).apbx.length)
                ? <i className='opacity-50'>{t('none')}</i>
                : <ol className='m-0'>
                  {(txnData as TxnData.AppCallTxnData).apbx.map((box, i) => (
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
            {t('fields.fee.in_algos', {
              count: (txnData as TxnData.PaymentTxnData)?.fee,
              formatParams: { count: { maximumFractionDigits: 6 } }
            })}
          </td>
        </tr>
        <tr>
          <th role='rowheader' className='align-top'>{t('fields.note.label')}</th>
          <td>{txnData?.note || <i className='opacity-50'>{t('none')}</i>}</td>
        </tr>

        {txnData?.type === TransactionType.acfg && <>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apar_m.label')}</th>
            <td className='break-all'>
              {((txnData as TxnData.AssetConfigTxnData)?.apar_m) ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apar_f.label')}</th>
            <td className='break-all'>
              {((txnData as TxnData.AssetConfigTxnData)?.apar_f) ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apar_c.label')}</th>
            <td className='break-all'>
              {((txnData as TxnData.AssetConfigTxnData)?.apar_c) ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.apar_r.label')}</th>
            <td className='break-all'>
              {((txnData as TxnData.AssetConfigTxnData)?.apar_r) ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>

          { // If an asset creation transaction
          !((txnData as TxnData.AssetConfigTxnData)?.caid) && <>
            <tr>
              <th role='rowheader' className='align-top'>{t('fields.apar_am.label')}</th>
              <td>
                {((txnData as TxnData.AssetConfigTxnData)?.apar_am) ||
                  <i className='opacity-50'>{t('none')}</i>}
              </td>
            </tr>
          </>}

        </>}

        {txnData?.type === TransactionType.keyreg && txnTypeKeyPart === 'keyreg_nonpart' &&
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.nonpart.label')}</th>
            <td>
              {(txnData as TxnData.KeyRegTxnData).nonpart
                ? <b>{t('fields.nonpart.is_nonpart')}</b>
                : t('fields.nonpart.is_not_nonpart')
              }
            </td>
          </tr>
        }

        <tr>
          <th role='rowheader' className='align-top'>{t('fields.fv.label')}</th>
          <td>{t('number_value', {value: txnData?.fv})}</td>
        </tr>
        <tr>
          <th role='rowheader' className='align-top'>{t('fields.lv.label')}</th>
          <td>{t('number_value', {value: txnData?.lv})}</td>
        </tr>
        <tr>
          <th role='rowheader' className='align-top'>{t('fields.lx.label')}</th>
          <td className='break-all'>{txnData?.lx || <i className='opacity-50'>{t('none')}</i>}</td>
        </tr>
        <tr className={txnData?.rekey ? 'bg-warning text-warning-content' : ''}>
          <th role='rowheader' className='align-top'>{t('fields.rekey.label')}</th>
          <td className='break-all'>
            {txnData?.rekey || <i className='opacity-50'>{t('none')}</i>}
          </td>
        </tr>

        {txnData?.type === TransactionType.pay &&
          <tr className={(txnData as TxnData.PaymentTxnData)?.close
            ? 'bg-warning text-warning-content'
            : ''
          }>
            <th role='rowheader' className='align-top'>{t('fields.close.label')}</th>
            <td className='break-all'>
              {(txnData as TxnData.PaymentTxnData)?.close
                || <i className='opacity-50'>{t('none')}</i>
              }
            </td>
          </tr>
        }

        {txnData?.type === TransactionType.axfer &&
          <tr className={(txnData as TxnData.AssetTransferTxnData)?.aclose
            ? 'bg-warning text-warning-content'
            : ''
          }>
            <th role='rowheader' className='align-top'>{t('fields.aclose.label')}</th>
            <td className='break-all'>
              {(txnData as TxnData.AssetTransferTxnData)?.aclose ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>
        }
      </tbody>
    </table>
  );
}
