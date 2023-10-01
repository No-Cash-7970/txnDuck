'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import { Trans } from 'react-i18next';
import {
  IconAlertTriangleFilled,
  IconArrowLeft,
  IconArrowRight
} from '@tabler/icons-react';
import { useAtomValue, useStore } from 'jotai';
import { TransactionType } from 'algosdk';
import * as GeneralFields from './GeneralFields';
import * as PaymentFields from './PaymentFields';
import {
  type PaymentTxnData,
  type TxnData,
  txnDataAtoms,
  storedTxnDataAtom
} from '@/app/lib/txn-form-data';

type Props = {
  /** Language */
  lng?: string
};

/** Form for composing a transaction */
export default function ComposeForm({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['compose_txn', 'common']);
  /** A flag for indicating that the form is being submitted */
  const [submittingForm, setSubmittingForm] = useState(false);
  const jotaiStore = useStore();
  const storedTxnData = useAtomValue(storedTxnDataAtom);
  const router = useRouter();

  useEffect(() => {
    // Check if there is any transaction data in storage.
    // Also check if the form is being submitted. The transaction data is put into storage when the
    // form is submitted. In this case, the transaction data does not need to be restored into the
    // atoms.
    if (!storedTxnData || submittingForm) {
      return;
    }

    // Restore transaction data into atoms
    jotaiStore.set(txnDataAtoms.txnType, storedTxnData.type);
    jotaiStore.set(txnDataAtoms.snd, storedTxnData.snd || '');
    jotaiStore.set(txnDataAtoms.note, storedTxnData.note || '');
    jotaiStore.set(txnDataAtoms.fee, storedTxnData.fee);
    jotaiStore.set(txnDataAtoms.fv, storedTxnData.fv);
    jotaiStore.set(txnDataAtoms.lv, storedTxnData.lv);
    jotaiStore.set(txnDataAtoms.lx, storedTxnData?.lx || '');
    jotaiStore.set(txnDataAtoms.rekey, storedTxnData?.rekey || '');
    // Restore payment transaction data, if applicable
    if (storedTxnData.type === TransactionType.pay) {
      jotaiStore.set(txnDataAtoms.rcv, (storedTxnData as PaymentTxnData).rcv || '');
      jotaiStore.set(txnDataAtoms.amt, (storedTxnData as PaymentTxnData).amt);
      jotaiStore.set(txnDataAtoms.close, (storedTxnData as PaymentTxnData)?.close || '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedTxnData]);

  const submitData = (e: React.MouseEvent) => {
    e.preventDefault();

    const txnType: TransactionType = jotaiStore.get(txnDataAtoms.txnType) as TransactionType;
    const txnData: TxnData = {
      type: txnType,
      snd: jotaiStore.get(txnDataAtoms.snd),
      note: jotaiStore.get(txnDataAtoms.note),
      fee: jotaiStore.get(txnDataAtoms.fee) as number,
      fv: jotaiStore.get(txnDataAtoms.fv) as number,
      lv: jotaiStore.get(txnDataAtoms.lv) as number,
      lx: jotaiStore.get(txnDataAtoms.lx) || undefined,
      rekey: jotaiStore.get(txnDataAtoms.rekey) || undefined,
    };

    if (txnType === TransactionType.pay) {
      (txnData as PaymentTxnData).rcv = jotaiStore.get(txnDataAtoms.rcv);
      (txnData as PaymentTxnData).amt = jotaiStore.get(txnDataAtoms.amt) as number;
      (txnData as PaymentTxnData).close = jotaiStore.get(txnDataAtoms.close) || undefined;
    }

    setSubmittingForm(true);
    // Store transaction data into local/session storage
    jotaiStore.set(storedTxnDataAtom, txnData);
    // Go to sign-transaction page
    router.push(`/${lng}/txn/sign`);
  };

  return (
    <form
      id='compose-txn-form'
      className='max-w-2xl mx-auto mt-12'
      noValidate={true}
      aria-label={t('title')}
    >
      <p className='max-w-3xl text-sm mb-8'>
        <Trans t={t} i18nKey='instructions'>
          asterisk_fields (<span className='text-error'>*</span>) required
        </Trans>
      </p>

      <GeneralFields.TxnType t={t} />
      <GeneralFields.Sender t={t} />

      <PaymentFields.ReceiverAndAmount t={t} />

      <GeneralFields.Fee t={t} />
      <GeneralFields.Note t={t} />

      <div>
        <GeneralFields.FirstValid t={t} />
        <GeneralFields.LastValid t={t} />
        <GeneralFields.Lease t={t} />
        <GeneralFields.Rekey t={t} />

        {/* If payment type */}
        <PaymentFields.CloseTo t={t} />
      </div>

      {/* Buttons */}
      <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 grid-rows-1 mx-auto mt-12'>
        <div>
          <button type='submit' className='btn btn-primary w-full' onClick={(submitData)}>
            {t('sign_txn_btn')}
            <IconArrowRight aria-hidden className='rtl:hidden' />
            <IconArrowLeft aria-hidden className='hidden rtl:inline' />
          </button>
        </div>
        <div className='sm:order-first'>
          <Link type='button' href='' className='btn w-full btn-disabled' tabIndex={-1}>
            <IconArrowLeft aria-hidden className='rtl:hidden' />
            <IconArrowRight aria-hidden className='hidden rtl:inline' />
            {t('txn_template_btn')}
          </Link>
          {/* <div className='alert bg-base-100 gap-1 border-0 py-0 mt-2'>
            <IconAlertTriangleFilled
              aria-hidden
              className='text-warning align-middle my-auto me-2'
            />
            <small>{t('txn_template_btn_warning')}</small>
          </div> */}
        </div>
      </div>

    </form>
  );
}
