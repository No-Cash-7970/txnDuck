import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { useAtomValue, useStore } from 'jotai';
import { TransactionType } from 'algosdk';
import * as algokit from '@algorandfoundation/algokit-utils';
import {
  type PaymentTxnData,
  type TxnData,
  storedTxnDataAtom,
  txnDataAtoms
} from '@/app/lib/txn-data';
import { nodeConfigAtom } from '@/app/lib/node-config';

type Props = {
  /** Language */
  lng?: string
};

/** Submit button for the "Compose Transaction" form */
export default function ComposeSubmitButton({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['compose_txn', 'common']);
  /** A flag for indicating that the form is being submitted */
  const [submittingForm, setSubmittingForm] = useState(false);
  const jotaiStore = useStore();
  const storedTxnData = useAtomValue(storedTxnDataAtom);
  const nodeConfig = useAtomValue(nodeConfigAtom);
  const router = useRouter();

  useEffect(() => {
    // Check if there is any transaction data in storage.
    // Also check if the form is being submitted. The transaction data is put into storage when the
    // form is submitted. In this case, the transaction data does not need to be restored into the
    // atoms.
    if (!storedTxnData || submittingForm) {
      return;
    }

    const txnData = storedTxnData.txn;

    // Restore transaction data into atoms
    jotaiStore.set(txnDataAtoms.txnType, txnData.type);
    jotaiStore.set(txnDataAtoms.snd, txnData.snd || '');
    jotaiStore.set(txnDataAtoms.note, txnData.note || '');
    jotaiStore.set(txnDataAtoms.fee, txnData.fee);
    jotaiStore.set(txnDataAtoms.fv, txnData.fv);
    jotaiStore.set(txnDataAtoms.lv, txnData.lv);
    jotaiStore.set(txnDataAtoms.lx, txnData?.lx || '');
    jotaiStore.set(txnDataAtoms.rekey, txnData?.rekey || '');
    // Restore payment transaction data, if applicable
    if (txnData.type === TransactionType.pay) {
      jotaiStore.set(txnDataAtoms.rcv, (txnData as PaymentTxnData).rcv || '');
      jotaiStore.set(txnDataAtoms.amt, (txnData as PaymentTxnData).amt);
      jotaiStore.set(txnDataAtoms.close, (txnData as PaymentTxnData)?.close || '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedTxnData]);

  const submitData = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Get suggested parameters
    const algod = algokit.getAlgoClient({
      server: nodeConfig.nodeServer,
      port: nodeConfig.nodePort,
      token: (nodeConfig.nodeToken || '') as string,
    });
    const {genesisID, genesisHash} = await algokit.getTransactionParams(undefined, algod);

    // Gather base transaction data
    const txnType: TransactionType = jotaiStore.get(txnDataAtoms.txnType) as TransactionType;
    const txnData: TxnData = {
      gen: genesisID,
      gh: genesisHash,
      txn: {
        type: txnType,
        snd: jotaiStore.get(txnDataAtoms.snd),
        note: jotaiStore.get(txnDataAtoms.note),
        fee: jotaiStore.get(txnDataAtoms.fee) as number,
        fv: jotaiStore.get(txnDataAtoms.fv) as number,
        lv: jotaiStore.get(txnDataAtoms.lv) as number,
        lx: jotaiStore.get(txnDataAtoms.lx) || undefined,
        rekey: jotaiStore.get(txnDataAtoms.rekey) || undefined,
      }
    };

    // Gather payment transaction data
    if (txnType === TransactionType.pay) {
      (txnData.txn as PaymentTxnData).rcv = jotaiStore.get(txnDataAtoms.rcv);
      (txnData.txn as PaymentTxnData).amt = jotaiStore.get(txnDataAtoms.amt) as number;
      (txnData.txn as PaymentTxnData).close = jotaiStore.get(txnDataAtoms.close) || undefined;
    }

    setSubmittingForm(true);
    // Store transaction data into local/session storage
    jotaiStore.set(storedTxnDataAtom, txnData);
    // Go to sign-transaction page
    router.push(`/${lng}/txn/sign`);
  };

  return (
    <button type='submit' className='btn btn-primary w-full' onClick={submitData}>
      {t('sign_txn_btn')}
      <IconArrowRight aria-hidden className='rtl:hidden' />
      <IconArrowLeft aria-hidden className='hidden rtl:inline' />
    </button>
  );
}
