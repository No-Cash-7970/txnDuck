'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import algosdk, { Algodv2, microalgosToAlgos } from 'algosdk';
import { useWallet } from '@txnlab/use-wallet-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Icons from '@tabler/icons-react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { CheckboxField } from '@/app/[lang]/components/form';
import { WalletDialogContent } from '@/app/[lang]/components/wallet';
import { useTranslation } from '@/app/i18n/client';
import { defaultAutoSend as defaultAutoSendAtom } from '@/app/lib/app-settings';
import { nodeConfigAtom } from '@/app/lib/node-config';
import {
  AppCallTxnData,
  AssetConfigTxnData,
  StoredTxnData,
  createTxnFromData,
  storedSignedTxnAtom,
  storedTxnDataAtom,
  tipBtnClass,
  tipContentClass,
  txnDataAtoms,
} from '@/app/lib/txn-data';
import { bytesToDataUrl, dataUrlToBytes, importParamName } from '@/app/lib/utils';
import NextStepButton from './NextStepButton';

type Props = {
  /** Language */
  lng?: string
};

/** Buttons for connecting to wallet and signing transaction */
export default function SignTxn({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['app', 'common', 'sign_txn']);
  const router = useRouter();
  const TxnFileLinkRef = useRef<any>(null);
  const nodeConfig = useAtomValue(nodeConfigAtom);
  const setFee = useSetAtom(txnDataAtoms.fee);
  const setFirstRound = useSetAtom(txnDataAtoms.fv);
  const setLastRound = useSetAtom(txnDataAtoms.lv);
  // A `null` value indicates that the default value should be used because the user has not changed
  // the value
  const [autoSend, setAutoSend] = useState<boolean|null>(null);
  const storedTxnData = useAtomValue(storedTxnDataAtom);
  const defaultAutoSend = useAtomValue(defaultAutoSendAtom);
  const [storedSignedTxn, setStoredSignedTxn] = useAtom(storedSignedTxnAtom);
  const [hasSignTxnError, setHasSignTxnError] = useState(false);
  const { activeAccount, activeWallet, signTransactions } = useWallet();

  const [isLoading, setIsLoading] = useState(true);
  const currentURLParams = useSearchParams();
  const isImporting = currentURLParams.get(importParamName) !== null;

  /** Get the suggested parameters for the network. Includes genesis ID, genesis hash, minimum fee,
   * first valid round, and last valid round.
   */
  const getSuggestedParams = useMemo(() => {
    // Get suggested parameters
    const algod = new Algodv2(
      nodeConfig.nodeToken ?? '',
      nodeConfig.nodeServer,
      nodeConfig.nodePort,
      nodeConfig.nodeHeaders
    );
    return algod.getTransactionParams().do();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeConfig, storedTxnData]);

  /** Decode all of the properties encoded in Base64 in the given transaction data object into byte
   * arrays
   * @param txnData Transaction data with the Base64 encoded properties to decode
   * @returns Transaction data with the Base64 encoded properties decoded into byte arrays
   *          (Uint8Array)
   */
  const decodeBase64TxnDataProps = async (txnData: StoredTxnData) => {
    const newTxnData: StoredTxnData = {...txnData};

    // Convert Base64 note to byte array
    if (newTxnData.b64Note && newTxnData.txn.note) {
      newTxnData.txn.note =  await dataUrlToBytes(
        `data:application/octet-stream;base64,${newTxnData.txn.note}`
      );
    }

    // Convert Base64 lease to byte array
    if (newTxnData.b64Lx && newTxnData.txn.lx) {
      newTxnData.txn.lx = await dataUrlToBytes(
        `data:application/octet-stream;base64,${newTxnData.txn.lx}`
      );
    }

    // Convert Base64 metadata hash to byte array
    if (txnData.b64Apar_am && (newTxnData.txn as AssetConfigTxnData).apar_am) {
      (newTxnData.txn as AssetConfigTxnData).apar_am = await dataUrlToBytes(
        `data:application/octet-stream;base64,${(newTxnData.txn as AssetConfigTxnData).apar_am}`
      );
    }

    // Convert Base64 arguments to byte arrays
    if (newTxnData.b64Apaa) {
      (newTxnData.txn as AppCallTxnData).apaa = await Promise.all(
        (newTxnData.txn as AppCallTxnData).apaa.map(
          async (appArg) => await dataUrlToBytes(`data:application/octet-stream;base64,${appArg}`)
        )
      );
    }

    return newTxnData;
  };

  /** Encode the stored unsigned transaction data into unsigned transaction bytes */
  const encodeUnsignedTxn = async () => {
    if (!storedTxnData) throw Error('No transaction data exists in session storage');

    const suggestedParams = await getSuggestedParams;
    const unsignedTxnData = {...storedTxnData.txn};

    // Set fee to suggested fee if suggested fee is to be used
    if (storedTxnData.useSugFee) unsignedTxnData.fee = Number(suggestedParams.fee);

    // Set first & last valid rounds to suggested first & last rounds if suggested rounds are to be
    // used
    if (storedTxnData.useSugRounds) {
      unsignedTxnData.fv = Number(suggestedParams.firstValid);
      unsignedTxnData.lv = Number(suggestedParams.lastValid);
    }

    // Encode the unsigned transaction data
    try {
      return algosdk.encodeUnsignedTransaction(
        createTxnFromData(
          (await decodeBase64TxnDataProps({...storedTxnData, txn: unsignedTxnData})).txn,
          suggestedParams.genesisID,
          algosdk.bytesToBase64(suggestedParams.genesisHash),
          !storedTxnData.useSugFee, // Enable/disable flat fee
          Number(suggestedParams.minFee),
        )
      );
    } catch (e) {
      // Display error message that something went wrong
      setHasSignTxnError(true);
      console.error(e);
      return;
    }
  };

  /** Create transaction object from stored transaction data and sign the transaction */
  const signTransaction = async () => {
    let unsignedTxn: Uint8Array;

    try {
      // Create Transaction object and encoded it
      unsignedTxn = await encodeUnsignedTxn() ?? new Uint8Array;
    } catch (e) {
      setHasSignTxnError(true);
      console.error(e);
      return;
    }

    // Sign the transaction and store it
    const signedTxn = (await signTransactions([unsignedTxn]))[0];
    const signedTxnDataUrl = await bytesToDataUrl(signedTxn ?? new Uint8Array);
    setStoredSignedTxn(signedTxnDataUrl);

    // If the user checked the box, or the default should be used and it is to automatically send
    // transaction
    if (autoSend || (autoSend === null && defaultAutoSend)) {
      // Go to send-transaction page
      router.push(`/${lng}/txn/send` + (currentURLParams.size ? `?${currentURLParams}` : ''));
    }
  };

  // Wrap local storage atom in state variable to avoid hydration error
  useEffect(() => setIsLoading(!storedTxnData), [storedTxnData]);

  useEffect(() => {
    if (!storedTxnData) return;

    /*
     * Check if transaction data has been changed after it was signed. At the same time, get the
     * current suggested parameters (valid rounds & fee-per-byte) if they are to be used.
     */
    const checkSignedTxn = async () => {
      const {
        genesisID,
        genesisHash,
        fee: feePerByte,
        firstValid,
        lastValid
      } = await getSuggestedParams;
      const unsignedTxnData = {...storedTxnData.txn}; // Copy stored transaction data
      let unsignedTxn: algosdk.Transaction|null = null;

      // If the suggested first & valid rounds are to be used, set first & valid rounds to suggested
      // first & valid rounds.
      if (storedTxnData.useSugRounds) {
        unsignedTxnData.fv = Number(firstValid);
        setFirstRound(unsignedTxnData.fv);
        unsignedTxnData.lv = Number(lastValid);
        setLastRound(unsignedTxnData.lv);
      }

      // Calculate the fee if the suggested fee is to be used. The easiest way the calculate the fee
      // is to create an algosdk `Transaction` object and set the fee-per-byte (by disabling the
      // flat fee)
      if (storedTxnData.useSugFee) {
        unsignedTxnData.fee = microalgosToAlgos(Number(feePerByte));

        try {
          unsignedTxn = createTxnFromData(
            (await decodeBase64TxnDataProps({...storedTxnData, txn: unsignedTxnData})).txn,
            genesisID,
            algosdk.bytesToBase64(genesisHash),
            false
          );
        } catch (e) { // The transaction is malformed
          setHasSignTxnError(true);
          console.error(e);
          return;
        }

        setFee(microalgosToAlgos(Number(unsignedTxn.fee)));
      }

      if (storedSignedTxn) {
        // Remove the stored signed transaction if the the unsigned transaction data does not match
        // the stored signed transaction data, indicating that the transaction data was changed
        // after it was signed.
        const signedTxnBytes = await dataUrlToBytes(storedSignedTxn);
        let signedTxn: algosdk.Transaction;

        try {
          signedTxn = algosdk.decodeSignedTransaction(signedTxnBytes).txn;
        } catch (e) { // The stored signed transaction is invalid for some reason
          console.error(e);
          setStoredSignedTxn(RESET); // The transaction will need to be signed again
          return;
        }

        // Create unsigned transaction if one was not already created when calculating the
        // suggested fee
        if (unsignedTxn === null) {
          try {
            unsignedTxn = createTxnFromData(
              (await decodeBase64TxnDataProps({...storedTxnData, txn: unsignedTxnData})).txn,
              genesisID,
              algosdk.bytesToBase64(genesisHash),
            );
          } catch (e) { // The transaction is malformed
            setHasSignTxnError(true);
            console.error(e);
            return;
          }
        }

        // The transaction has been changed and will need to be signed again
        if (unsignedTxn.txID() !== signedTxn.txID()) setStoredSignedTxn(RESET);
      }
    };

    checkSignedTxn();

  /*
   * NOTE: The node configuration is added as a dependency because the transaction may need to be
   * signed again if it is for a different network.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedTxnData, storedSignedTxn, nodeConfig]);

  return (<>
    {!isImporting && !isLoading && <>
      <div className='mt-0 mb-0 text-center'>
        <button
          className='btn btn-sm btn-dash'
          onClick={async (e) => {
            e.preventDefault();
            TxnFileLinkRef.current.href = await bytesToDataUrl(
              await encodeUnsignedTxn() ?? new Uint8Array
            );
            TxnFileLinkRef.current.download = t('sign_txn:unsigned_file_name') + '.txn.msgpack';
            TxnFileLinkRef.current.click();
          }}
        >
          <Icons.IconFileDownload aria-hidden size={22} />
          {t('sign_txn:download_unsigned_btn')}
        </button>
        {storedSignedTxn &&
          <button
            className='btn btn-sm btn-dash btn-accent mt-3 sm:ms-3 sm:mt-0 '
            onClick={async (e) => {
              e.preventDefault();
              TxnFileLinkRef.current.href = storedSignedTxn;
              TxnFileLinkRef.current.download = t('sign_txn:signed_file_name') + '.txn.msgpack';
              TxnFileLinkRef.current.click();
            }}
          >
            <Icons.IconCircleKey aria-hidden size={22} />
            {t('sign_txn:download_signed_btn')}
          </button>
        }
        <a ref={TxnFileLinkRef}
          className='hidden'
          href=''
          download=''
          tabIndex={-1}
        />
      </div>

      {// No wallet connected and the transaction has not been signed yet
        (!activeAccount && !storedSignedTxn) &&
        <Dialog.Root modal={false}>
          <Dialog.Trigger asChild>
            <button className='btn btn-lg btn-secondary btn-block min-h-[4em] h-auto mt-8'>
              <Icons.IconWallet aria-hidden />
              {t('wallet.connect')}
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content
              className='modal modal-open'
              aria-describedby={undefined}
              onPointerDownOutside={(e) => e.preventDefault()}
              onInteractOutside={(e) => e.preventDefault()}
            >
              <WalletDialogContent t={t} />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      }
      {// Transaction signing failed for some reason
        hasSignTxnError &&
        <div className='alert alert-error mt-8'>
          <Icons.IconCircleX aria-hidden size={32} />
          {t('sign_txn:sign_error')}
        </div>
      }
      {// Connected to wallet but the transaction has not been signed yet
        (activeAccount && !storedSignedTxn && !hasSignTxnError) &&
        <div className='mt-8'>
          <CheckboxField label={t('sign_txn:auto_send.label')}
            name='auto_send'
            id='autoSend-input'
            tip={{
              content: t('sign_txn:auto_send.tip'),
              btnClass: tipBtnClass,
              btnTitle: t('sign_txn:auto_send.tip_btn_title'),
              contentClass: tipContentClass
            }}
            inputInsideLabel={true}
            containerId='autoSend-field'
            containerClass='ms-2 mb-3'
            inputClass='checkbox-primary me-2'
            labelClass='justify-start w-fit max-w-full leading-6'
            value={autoSend ?? defaultAutoSend}
            onChange={(e) => setAutoSend(e.target.checked)}
          />
          <button
            className='btn btn-lg btn-primary btn-block min-h-[4rem] h-auto'
            onClick={() => signTransaction()}
          >
            <Icons.IconBallpenFilled aria-hidden />
            {t('sign_txn:sign_txn_btn')}
          </button>
          <div className='not-prose text-center mt-3'>
            <div className='truncate align-middle px-2'>
              {activeWallet &&
                <span className='relative h-6 w-6 inline-block me-2 align-middle'>
                  <Image
                    src={activeWallet.metadata.icon}
                    alt={t('wallet.provider_icon_alt', {provider: activeWallet.metadata.name})}
                    fill
                  />
                </span>
              }
              <span className='align-middle'>
                {t('wallet.is_connected', {address: activeAccount.address})}
              </span>
            </div>
            <button className='btn btn-xs btn-outline text-secondary mt-2'
              onClick={() => activeWallet?.disconnect()}
            >
              <Icons.IconWalletOff aria-hidden size={20} />
              {t('wallet.disconnect')}
            </button>
          </div>
        </div>
      }
      {// Transaction is signed!
        (storedSignedTxn && !hasSignTxnError) &&
        <div className='alert alert-success mt-8 text-[1rem]'>
          <Icons.IconCircleCheck aria-hidden size={32} />
          {t('sign_txn:txn_signed')}
        </div>
      }

      {/* Buttons */}
      <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 grid-rows-1 mx-auto mt-14'>
        {/* Next step */}
        <div><NextStepButton lng={lng} /></div>
        {/* Previous step */}
        <div className={'' + (hasSignTxnError ? 'order-first' : 'sm:order-first')}>
          <Link href={{
            pathname: `/${lng}/txn/compose`,
            query: currentURLParams.toString(),
          }} className={'btn w-full' + (hasSignTxnError ? ' btn-primary font-semibold' : '')}>
            <Icons.IconArrowLeft aria-hidden className='rtl:hidden' />
            <Icons.IconArrowRight aria-hidden className='hidden rtl:inline' />
            {t('sign_txn:compose_txn_btn')}
          </Link>
          {storedSignedTxn &&
            <div className={
              'alert bg-base-100 gap-1 border-0 py-0 mt-2 leading-snug text-base-content/70'
            }>
              <Icons.IconAlertTriangleFilled aria-hidden
                className='align-middle my-auto me-2'
              />
              <span>{t('sign_txn:compose_txn_btn_warning')}</span>
            </div>
          }
        </div>
      </div>
    </>}
  </>);
}
