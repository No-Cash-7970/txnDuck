'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IconAlertTriangle, IconMoodWrrr } from "@tabler/icons-react";
import algosdk from "algosdk";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { CheckboxField, FieldGroup, FileField } from "@/app/[lang]/components/form";
import { useTranslation } from "@/app/i18n/client";
import {
  createDataFromTxn,
  storedSignedTxnAtom,
  storedTxnDataAtom,
  tipBtnClass,
  tipContentClass
} from "@/app/lib/txn-data";
import { bytesToDataUrl, fileToBytes, importParamName } from "@/app/lib/utils";
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
  const router = useRouter();
  const [storedTxnData, setStoredTxnData] = useAtom(storedTxnDataAtom);
  const setStoredSignedTxn = useSetAtom(storedSignedTxnAtom);
  const nodeConfig = useAtomValue(nodeConfigAtom);
  const [diffNetwork, setDiffNetwork] = useState(false);
  const [noDiffNetworkOption, setNoDiffNetworkOption] = useState(true);
  const [useSugFeeOption, setUseSugFeeOption] = useState(false);
  const [useSugRoundsOption, setUseSugRoundsOption] = useState(false);
  const [b64NoteOption, setB64NoteOption] = useState(false);
  const [b64LxOption, setB64LxOption] = useState(false);
  const [b64Apar_amOption, setB64Apar_amOption] = useState(false);
  const [b64ApaaOption, setB64ApaaOption] = useState(false);

  const currentURLParams = useSearchParams();
  const isImporting = currentURLParams.get(importParamName) !== null;

  /** Processes the given file as a signed or unsigned transaction file
   * @param file File to process
   */
  const processTxnFile = async (file: File) => {
    const txnByteData = await fileToBytes(file);
    let txn: algosdk.Transaction;
    /** If the imported transaction is a signed transaction */
    let isSignedTxn = false;

    // Try decoding file into a `Transaction` object
    try {
      txn = algosdk.decodeUnsignedTransaction(txnByteData);
    } catch {
      // Decoding the transaction as an unsigned transaction did not work, so try to decode
      // it as a signed transaction because it may be a signed transaction
      txn = algosdk.decodeSignedTransaction(txnByteData).txn;
      isSignedTxn = true;
    }

    if (noDiffNetworkOption) {
      const nodeGenesisHash = (await (new algosdk.Algodv2(
        nodeConfig.nodeToken ?? '',
        nodeConfig.nodeServer,
        nodeConfig.nodePort,
        nodeConfig.nodeHeaders
      )).getTransactionParams().do()).genesisHash;
      const txnGenesisHash = txn.genesisHash ?? new Uint8Array;

      // Compare the network used for the transaction to currently selected node network.
      if (txnGenesisHash.toString() !== nodeGenesisHash.toString()) {
        // Trigger error and stop
        setDiffNetwork(true);
        return;
      }
    }

    // Reset this just in case the "different network" flag was triggered before
    setDiffNetwork(false);

    // Overwrite stored signed transaction with imported signed transaction if the suggested fee or
    // suggested rounds are not going to be used
    if (isSignedTxn && !(useSugFeeOption || useSugRoundsOption)) {
      setStoredSignedTxn(await bytesToDataUrl(txnByteData));
    } else {
      // Remove the stored signed transaction when importing an unsigned transaction or when
      // importing a signed transaction that will be overwritten with suggested fee or valid rounds
      setStoredSignedTxn(RESET);
    }

    setStoredTxnData({
      txn: createDataFromTxn(txn, {
        b64Note: b64NoteOption,
        b64Lx: b64LxOption,
        b64Apar_am: !!txn.assetConfig?.assetMetadataHash ? b64Apar_amOption : undefined,
        b64Apaa: !!txn.applicationCall?.appArgs ? b64ApaaOption : undefined,
      }),
      useSugFee: useSugFeeOption,
      useSugRounds: useSugRoundsOption,
      b64Note: b64NoteOption,
      b64Lx: b64LxOption,
      b64Apar_am: !!txn.assetConfig?.assetMetadataHash ? b64Apar_amOption : undefined,
      b64Apaa: !!txn.applicationCall?.appArgs ? b64ApaaOption : undefined,
    });

    // Show transaction data after processing file
    router.push(`/${lng}/txn/sign`);
  };

  return (<>
    {isImporting && <>
      {!!storedTxnData && <div className='alert alert-warning mb-2 sm:mt-12 sm:-mb-8'>
        <IconAlertTriangle aria-hidden className=' my-auto me-2' />
        <div>{t('import_txn.overwrite_warning')}</div>
        <Link className="btn btn-outline" replace={true} href={`/${lng}/txn/sign`}>
          {t('import_txn.cancel')}
        </Link>
      </div>}
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
          tip={{
            content: t('import_txn.no_diff_network_tip'),
            btnClass: tipBtnClass,
            btnTitle: t('import_txn.opt_more_info'),
            contentClass: tipContentClass
          }}
        />
        <CheckboxField label={t('import_txn.use_sug_rounds')}
          inputInsideLabel={true}
          containerClass='ms-2 mb-2'
          inputClass='checkbox-secondary me-4'
          labelClass='justify-start w-fit max-w-full'
          value={useSugRoundsOption}
          onChange={(e) => setUseSugRoundsOption(e.target.checked)}
          tip={{
            content: t('import_txn.use_sug_rounds_tip'),
            btnClass: tipBtnClass,
            btnTitle: t('import_txn.opt_more_info'),
            contentClass: tipContentClass
          }}
        />
        <CheckboxField label={t('import_txn.use_sug_fee')}
          inputInsideLabel={true}
          containerClass='ms-2 mb-2'
          inputClass='checkbox-secondary me-4'
          labelClass='justify-start w-fit max-w-full'
          value={useSugFeeOption}
          onChange={(e) => setUseSugFeeOption(e.target.checked)}
          tip={{
            content: t('import_txn.use_sug_fee_tip'),
            btnClass: tipBtnClass,
            btnTitle: t('import_txn.opt_more_info'),
            contentClass: tipContentClass
          }}
        />
        <CheckboxField label={t('import_txn.b64_note')}
          inputInsideLabel={true}
          containerClass='ms-2 mb-2'
          inputClass='checkbox-secondary me-4'
          labelClass='justify-start w-fit max-w-full'
          value={b64NoteOption}
          onChange={(e) => setB64NoteOption(e.target.checked)}
          tip={{
            content: t('import_txn.b64_note_tip'),
            btnClass: tipBtnClass,
            btnTitle: t('import_txn.opt_more_info'),
            contentClass: tipContentClass
          }}
        />
        <CheckboxField label={t('import_txn.b64_lx')}
          inputInsideLabel={true}
          containerClass='ms-2 mb-2'
          inputClass='checkbox-secondary me-4'
          labelClass='justify-start w-fit max-w-full'
          value={b64LxOption}
          onChange={(e) => setB64LxOption(e.target.checked)}
          tip={{
            content: t('import_txn.b64_lx_tip'),
            btnClass: tipBtnClass,
            btnTitle: t('import_txn.opt_more_info'),
            contentClass: tipContentClass
          }}
        />
        <CheckboxField label={t('import_txn.b64_apar_am')}
          inputInsideLabel={true}
          containerClass='ms-2 mb-2'
          inputClass='checkbox-secondary me-4'
          labelClass='justify-start w-fit max-w-full'
          value={b64Apar_amOption}
          onChange={(e) => setB64Apar_amOption(e.target.checked)}
          tip={{
            content: t('import_txn.b64_apar_am_tip'),
            btnClass: tipBtnClass,
            btnTitle: t('import_txn.opt_more_info'),
            contentClass: tipContentClass
          }}
        />
        <CheckboxField label={t('import_txn.b64_apaa')}
          inputInsideLabel={true}
          containerClass='ms-2 mb-2'
          inputClass='checkbox-secondary me-4'
          labelClass='justify-start w-fit max-w-full'
          value={b64ApaaOption}
          onChange={(e) => setB64ApaaOption(e.target.checked)}
          tip={{
            content: t('import_txn.b64_apaa_tip'),
            btnClass: tipBtnClass,
            btnTitle: t('import_txn.opt_more_info'),
            contentClass: tipContentClass
          }}
        />
      </FieldGroup>
    </>}
  </>);
}
