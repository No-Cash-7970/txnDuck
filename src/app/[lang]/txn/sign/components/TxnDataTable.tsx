'use client';

import { useTranslation } from '@/app/i18n/client';
import { AssetTransferTxnData, PaymentTxnData, storedTxnDataAtom } from '@/app/lib/txn-data';
import { TransactionType } from 'algosdk';
import { useAtomValue } from 'jotai';

type Props = {
  /** Language */
  lng?: string
};

export default function TxnDataTable({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['compose_txn', 'common']);
  const storedTxnData = useAtomValue(storedTxnDataAtom);
  const txnData = storedTxnData?.txn;
  return (
    <table className='table'>
      <tbody>
        <tr>
          <th role='rowheader' className='align-top'>{t('fields.type.label')}</th>
          <td>{t('fields.type.options.' + txnData?.type)}</td>
        </tr>
        <tr>
          <th role='rowheader' className='align-top'>{t('fields.snd.label')}</th>
          <td className='break-all'>{txnData?.snd}</td>
        </tr>

        {txnData?.type === TransactionType.pay && <>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.rcv.label')}</th>
            <td className='break-all'>{(txnData as PaymentTxnData)?.rcv}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.amt.label')}</th>
            <td>
              {t('fields.amt.in_algos', {
                count: (txnData as PaymentTxnData)?.amt,
                formatParams: { count: { maximumFractionDigits: 6 } }
              })}
            </td>
          </tr>
        </>}

        {txnData?.type === TransactionType.axfer && <>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.arcv.label')}</th>
            <td className='break-all'>{(txnData as AssetTransferTxnData)?.arcv}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.xaid.label')}</th>
            <td>{(txnData as AssetTransferTxnData)?.xaid}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.aamt.label')}</th>
            <td>{t('number_value', {value: (txnData as AssetTransferTxnData)?.aamt})}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.asnd.label')}</th>
            <td className='break-all'>
              {(txnData as AssetTransferTxnData)?.asnd ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>
        </>}

        <tr>
          <th role='rowheader' className='align-top'>{t('fields.fee.label')}</th>
            <td>
              {t('fields.fee.in_algos', {
                count: (txnData as PaymentTxnData)?.fee,
                formatParams: { count: { maximumFractionDigits: 6 } }
              })}
            </td>
        </tr>
        <tr>
          <th role='rowheader' className='align-top'>{t('fields.note.label')}</th>
          <td>{txnData?.note || <i className='opacity-50'>{t('none')}</i>}</td>
        </tr>
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
          <tr
            className={(txnData as PaymentTxnData)?.close ? 'bg-warning text-warning-content' : ''}
          >
            <th role='rowheader' className='align-top'>{t('fields.close.label')}</th>
            <td className='break-all'>
              {(txnData as PaymentTxnData)?.close || <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>
        }

        {txnData?.type === TransactionType.axfer &&
          <tr className={
            (txnData as AssetTransferTxnData)?.aclose ? 'bg-warning text-warning-content' : ''
          }>
            <th role='rowheader' className='align-top'>{t('fields.aclose.label')}</th>
            <td className='break-all'>
              {(txnData as AssetTransferTxnData)?.aclose ||
                <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>
        }
      </tbody>
    </table>
  );
}
