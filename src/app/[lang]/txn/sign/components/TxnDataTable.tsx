'use client';

import { ShowIf } from "@/app/[lang]/components";
import { useTranslation } from "@/app/i18n/client";
import { PaymentTxnData, storedTxnDataAtom } from "@/app/lib/txn-form-data";
import { TransactionType } from "algosdk";
import { useAtomValue } from "jotai";

type Props = {
  /** Language */
  lng?: string
};

export default function TxnDataTable({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['compose_txn', 'common']);
  const txnData = useAtomValue(storedTxnDataAtom);
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

        <ShowIf cond={txnData?.type === TransactionType.pay}>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.rcv.label')}</th>
            <td className='break-all'>{(txnData as PaymentTxnData)?.rcv}</td>
          </tr>
          <tr>
            <th role='rowheader' className='align-top'>{t('fields.amt.label')}</th>
            <td>{t('fields.amt.in_algos', {count: (txnData as PaymentTxnData)?.amt})}</td>
          </tr>
        </ShowIf>

        <tr>
          <th role='rowheader' className='align-top'>{t('fields.fee.label')}</th>
          <td>{t('fields.fee.in_algos', {count: txnData?.fee})}</td>
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

        <ShowIf cond={txnData?.type === TransactionType.pay}>
          <tr
            className={(txnData as PaymentTxnData)?.close ? 'bg-warning text-warning-content' : ''}
          >
            <th role='rowheader' className='align-top'>{t('fields.close.label')}</th>
            <td className='break-all'>
              {(txnData as PaymentTxnData)?.close || <i className='opacity-50'>{t('none')}</i>}
            </td>
          </tr>
        </ShowIf>
      </tbody>
    </table>
  );
}