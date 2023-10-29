import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { useAtomValue, useStore } from 'jotai';
import { TransactionType } from 'algosdk';
import * as algokit from '@algorandfoundation/algokit-utils';
import * as TxnData from '@/app/lib/txn-data';
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
  const storedTxnData = useAtomValue(TxnData.storedTxnDataAtom);
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
    jotaiStore.set(TxnData.txnDataAtoms.txnType, txnData.type);
    jotaiStore.set(TxnData.txnDataAtoms.snd, txnData.snd || '');
    jotaiStore.set(TxnData.txnDataAtoms.note, txnData.note || '');
    jotaiStore.set(TxnData.txnDataAtoms.fee, txnData.fee);
    jotaiStore.set(TxnData.txnDataAtoms.fv, txnData.fv);
    jotaiStore.set(TxnData.txnDataAtoms.lv, txnData.lv);
    jotaiStore.set(TxnData.txnDataAtoms.lx, txnData?.lx || '');
    jotaiStore.set(TxnData.txnDataAtoms.rekey, txnData?.rekey || '');
    // Restore payment transaction data, if applicable
    if (txnData.type === TransactionType.pay) {
      jotaiStore.set(TxnData.txnDataAtoms.rcv, (txnData as TxnData.PaymentTxnData).rcv || '');
      jotaiStore.set(TxnData.txnDataAtoms.amt, (txnData as TxnData.PaymentTxnData).amt);
      jotaiStore.set(TxnData.txnDataAtoms.close, (txnData as TxnData.PaymentTxnData).close || '');
    }
    // Restore asset transfer transaction data, if applicable
    if (txnData.type === TransactionType.axfer) {
      jotaiStore.set(TxnData.txnDataAtoms.arcv,
        (txnData as TxnData.AssetTransferTxnData).arcv || ''
      );
      jotaiStore.set(TxnData.txnDataAtoms.xaid, (txnData as TxnData.AssetTransferTxnData).xaid);
      jotaiStore.set(TxnData.txnDataAtoms.aamt,
        `${(txnData as TxnData.AssetTransferTxnData).aamt}`
      );
      jotaiStore.set(TxnData.txnDataAtoms.asnd,
        (txnData as TxnData.AssetTransferTxnData).asnd || ''
      );
      jotaiStore.set(TxnData.txnDataAtoms.aclose,
        (txnData as TxnData.AssetTransferTxnData).aclose || ''
      );
    }
    // Restore asset configuration transaction data, if applicable
    if (txnData.type === TransactionType.acfg) {
      jotaiStore.set(TxnData.txnDataAtoms.caid, (txnData as TxnData.AssetConfigTxnData).caid);
      jotaiStore.set(TxnData.txnDataAtoms.apar_un,
        (txnData as TxnData.AssetConfigTxnData).apar_un || ''
      );
      jotaiStore.set(TxnData.txnDataAtoms.apar_an,
        (txnData as TxnData.AssetConfigTxnData).apar_an || ''
      );
      // Convert total to string just in case it is a bigint
      jotaiStore.set(TxnData.txnDataAtoms.apar_t,
        `${(txnData as TxnData.AssetConfigTxnData).apar_t}`
      );
      jotaiStore.set(TxnData.txnDataAtoms.apar_dc, (txnData as TxnData.AssetConfigTxnData).apar_dc);
      jotaiStore.set(TxnData.txnDataAtoms.apar_df,
        !!((txnData as TxnData.AssetConfigTxnData).apar_df)
      );
      jotaiStore.set(TxnData.txnDataAtoms.apar_au,
        (txnData as TxnData.AssetConfigTxnData).apar_au || ''
      );
      jotaiStore.set(TxnData.txnDataAtoms.apar_m,
        (txnData as TxnData.AssetConfigTxnData).apar_m || ''
      );
      jotaiStore.set(TxnData.txnDataAtoms.apar_f,
        (txnData as TxnData.AssetConfigTxnData).apar_f || ''
      );
      jotaiStore.set(TxnData.txnDataAtoms.apar_c,
        (txnData as TxnData.AssetConfigTxnData).apar_c || ''
      );
      jotaiStore.set(TxnData.txnDataAtoms.apar_r,
        (txnData as TxnData.AssetConfigTxnData).apar_r || ''
      );
      jotaiStore.set(TxnData.txnDataAtoms.apar_am,
        (txnData as TxnData.AssetConfigTxnData).apar_am || ''
      );
    }
    // Restore asset freeze transaction data, if applicable
    if (txnData.type === TransactionType.afrz) {
      jotaiStore.set(TxnData.txnDataAtoms.faid, (txnData as TxnData.AssetFreezeTxnData).faid);
      jotaiStore.set(TxnData.txnDataAtoms.fadd,
        (txnData as TxnData.AssetFreezeTxnData).fadd || ''
      );
      jotaiStore.set(TxnData.txnDataAtoms.afrz, (txnData as TxnData.AssetFreezeTxnData).afrz);
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

    const txnType: TransactionType =
      jotaiStore.get(TxnData.txnDataAtoms.txnType) as TransactionType;
    let specificTxnData = {};

    // Gather payment transaction data
    if (txnType === TransactionType.pay) {
      specificTxnData = {
        rcv: jotaiStore.get(TxnData.txnDataAtoms.rcv),
        amt: jotaiStore.get(TxnData.txnDataAtoms.amt),
        close: jotaiStore.get(TxnData.txnDataAtoms.close) || undefined,
      };
    }

    // Gather asset transfer transaction data
    if (txnType === TransactionType.axfer) {
      specificTxnData = {
        arcv: jotaiStore.get(TxnData.txnDataAtoms.arcv),
        xaid: jotaiStore.get(TxnData.txnDataAtoms.xaid),
        // Convert amount to string just in case it is a bigint
        aamt: `${jotaiStore.get(TxnData.txnDataAtoms.aamt)}`,
        asnd: jotaiStore.get(TxnData.txnDataAtoms.asnd) || undefined,
        aclose: jotaiStore.get(TxnData.txnDataAtoms.aclose) || undefined,
      };
    }

    // Gather asset configuration transaction data
    if (txnType === TransactionType.acfg) {
      specificTxnData = {
        caid: jotaiStore.get(TxnData.txnDataAtoms.caid) || undefined,
        apar_un: jotaiStore.get(TxnData.txnDataAtoms.apar_un) || undefined,
        apar_an: jotaiStore.get(TxnData.txnDataAtoms.apar_an) || undefined,
        // Convert total to string just in case it is a bigint
        apar_t: `${jotaiStore.get(TxnData.txnDataAtoms.apar_t)}`,
        apar_dc: jotaiStore.get(TxnData.txnDataAtoms.apar_dc),
        apar_df: jotaiStore.get(TxnData.txnDataAtoms.apar_df) || undefined,
        apar_au: jotaiStore.get(TxnData.txnDataAtoms.apar_au) || undefined,
        apar_m: jotaiStore.get(TxnData.txnDataAtoms.apar_m) || undefined,
        apar_f: jotaiStore.get(TxnData.txnDataAtoms.apar_f) || undefined,
        apar_c: jotaiStore.get(TxnData.txnDataAtoms.apar_c) || undefined,
        apar_r: jotaiStore.get(TxnData.txnDataAtoms.apar_r) || undefined,
        apar_am: jotaiStore.get(TxnData.txnDataAtoms.apar_am) || undefined,
      };
    }

    // Gather asset freeze transaction data
    if (txnType === TransactionType.afrz) {
      specificTxnData = {
        faid: jotaiStore.get(TxnData.txnDataAtoms.faid),
        fadd: jotaiStore.get(TxnData.txnDataAtoms.fadd),
        afrz: jotaiStore.get(TxnData.txnDataAtoms.afrz),
      };
    }

    setSubmittingForm(true);
    // Store transaction data into local/session storage
    jotaiStore.set(TxnData.storedTxnDataAtom, {
      gen: genesisID,
      gh: genesisHash,
      txn: {
        ...specificTxnData,
        // Gather base transaction data
        type: txnType,
        snd: jotaiStore.get(TxnData.txnDataAtoms.snd),
        note: jotaiStore.get(TxnData.txnDataAtoms.note),
        fee: jotaiStore.get(TxnData.txnDataAtoms.fee) as number,
        fv: jotaiStore.get(TxnData.txnDataAtoms.fv) as number,
        lv: jotaiStore.get(TxnData.txnDataAtoms.lv) as number,
        lx: jotaiStore.get(TxnData.txnDataAtoms.lx) || undefined,
        rekey: jotaiStore.get(TxnData.txnDataAtoms.rekey) || undefined,
      }
    });
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
