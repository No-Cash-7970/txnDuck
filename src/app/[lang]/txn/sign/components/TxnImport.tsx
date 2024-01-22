'use client';

import { useState } from "react";
import { IconMoodWrrr } from "@tabler/icons-react";
import { Transaction, decodeSignedTransaction, decodeUnsignedTransaction } from "algosdk";
import { getAlgoClient, getTransactionParams } from "@algorandfoundation/algokit-utils";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { CheckboxField, FieldGroup, FileField } from "@/app/[lang]/components/form";
import { useTranslation } from "@/app/i18n/client";
import { createDataFromTxn, storedSignedTxnAtom, storedTxnDataAtom } from "@/app/lib/txn-data";
import { bytesToBase64, bytesToDataUrl, fileToBytes } from "@/app/lib/utils";
import { nodeConfigAtom } from '@/app/lib/node-config';

type Props = {
  /** Language */
  lng?: string
};

/** Section of the sign-transaction page for importing a transaction file when there is no stored
 * transaction data
 */
export default function TxnImport({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['sign_txn']);
  const [storedTxnData, setStoredTxnData] = useAtom(storedTxnDataAtom);
  const setStoredSignedTxn = useSetAtom(storedSignedTxnAtom);
  const nodeConfig = useAtomValue(nodeConfigAtom);
  const [diffNetwork, setDiffNetwork] = useState(false);
  const [noDiffNetworkOption, setNoDiffNetworkOption] = useState(true);
  const [b64NoteOption, setB64NoteOption] = useState(false);
  const [b64LxOption, setB64LxOption] = useState(false);
  const [b64Apar_amOption, setB64Apar_amOption] = useState(false);

  /** Processes the given file as a signed or unsigned transaction file
   * @param file File to process
   */
  const processTxnFile = async (file: File) => {
    const txnByteData = await fileToBytes(file);
    let txn: Transaction;
    /** If the imported transaction is a signed transaction */
    let isSignedTxn = false;

    // Try decoding file into a `Transaction` object
    try {
      txn = decodeUnsignedTransaction(txnByteData);
    } catch (error) {
      // Decoding the transaction as an unsigned transaction did not work, so try to decode
      // it as a signed transaction because it may be a signed transaction
      txn = decodeSignedTransaction(txnByteData).txn;
      isSignedTxn = true;
    }

    if (noDiffNetworkOption) {
      const nodeGenesisHash = (await getTransactionParams(undefined, getAlgoClient({
        server: nodeConfig.nodeServer,
        port: nodeConfig.nodePort,
        token: (nodeConfig.nodeToken || '') as string,
      }))).genesisHash;
      const txnGenesisHash = await bytesToBase64(txn.genesisHash);
      // Compare the network used for the transaction to currently selected node network.
      if (txnGenesisHash !== nodeGenesisHash) {
        setDiffNetwork(true);
        return;
      }
    }

    // Reset this just in case the "different network" flag was triggered before
    setDiffNetwork(false);

    if (isSignedTxn) {
      setStoredSignedTxn(await bytesToDataUrl(txnByteData));
    }

    setStoredTxnData({
      txn: await createDataFromTxn(txn, {
        b64Note: b64NoteOption,
        b64Lx: b64LxOption,
        b64Apar_am: !!txn.assetMetadataHash ? b64Apar_amOption : undefined,
      }),
      useSugFee: false,
      useSugRounds: false,
      b64Note: b64NoteOption,
      b64Lx: b64LxOption,
      b64Apar_am: !!txn.assetMetadataHash ? b64Apar_amOption : undefined,
    });
  };

  return (<>
    {!storedTxnData && <>
      {diffNetwork && <div className="alert alert-error sm:-mb-6">
        <IconMoodWrrr stroke={1.5} aria-hidden className='h-14 w-14' />
        <div className="prose-headings:text-current">
          <h2 className="mt-0">{t('import_txn.fail_heading')}</h2>
          <p>{t('import_txn.fail_msg')}</p>
        </div>
      </div>}

      <FileField label={t('import_txn.label')}
        id='txn-import'
        containerId='txn-import-field'
        containerClass='max-w-full sm:mt-12'
        inputClass='file-input sm:file-input-lg file-input-primary'
        labelClass=''
        labelTextClass='sm:text-lg'
        onChange={(e) => {
          if (!!e.target.files?.length) {
            processTxnFile(e.target.files[0]);
          }
        }}
      />

      <FieldGroup heading={t('import_txn.options_heading')}>
        <CheckboxField label={t('import_txn.no_diff_network')}
          inputInsideLabel={true}
          containerClass='ms-2 mb-2'
          inputClass='checkbox-secondary me-4'
          labelClass='justify-start w-fit max-w-full'
          value={noDiffNetworkOption}
          onChange={(e) => setNoDiffNetworkOption(e.target.checked)}
        />
        <CheckboxField label={t('import_txn.b64_note')}
          inputInsideLabel={true}
          containerClass='ms-2 mb-2'
          inputClass='checkbox-secondary me-4'
          labelClass='justify-start w-fit max-w-full'
          value={b64NoteOption}
          onChange={(e) => setB64NoteOption(e.target.checked)}
        />
        <CheckboxField label={t('import_txn.b64_lx')}
          inputInsideLabel={true}
          containerClass='ms-2 mb-2'
          inputClass='checkbox-secondary me-4'
          labelClass='justify-start w-fit max-w-full'
          value={b64LxOption}
          onChange={(e) => setB64LxOption(e.target.checked)}
        />
        <CheckboxField label={t('import_txn.b64_apar_am')}
          inputInsideLabel={true}
          containerClass='ms-2 mb-2'
          inputClass='checkbox-secondary me-4'
          labelClass='justify-start w-fit max-w-full'
          value={b64Apar_amOption}
          onChange={(e) => setB64Apar_amOption(e.target.checked)}
        />
      </FieldGroup>
    </>}
  </>);
}
