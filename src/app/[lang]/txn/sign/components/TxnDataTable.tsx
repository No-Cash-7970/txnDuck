'use client';

import { useTranslation } from '@/app/i18n/client';
import * as TxnData from '@/app/lib/txn-data';
import { TransactionType } from 'algosdk';
import { useAtomValue } from 'jotai';

type Props = {
  /** Language */
  lng?: string
};

export default function TxnDataTable({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['compose_txn', 'common']);
  const storedTxnData = useAtomValue(TxnData.storedTxnDataAtom);
  const txnData = storedTxnData?.txn;

  /**
   * Get the part of the i18n translation key for the given transaction type
   *
   * @returns Part of the i18n translation key for the transaction type
   */
  const getTxnTypeKeyPart = (type?: TxnData.BaseTxnData['type']): string => {
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

    return `${type}` ?? '';
  };

  return (
    <table className='table'>
      <tbody>
        <tr>
          <th role='rowheader' className='align-top'>{t('fields.type.label')}</th>
          <td>{t('fields.type.options.' + getTxnTypeKeyPart(txnData?.type))}</td>
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
