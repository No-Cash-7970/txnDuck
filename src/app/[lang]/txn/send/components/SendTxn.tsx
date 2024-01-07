'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Trans } from 'react-i18next';
import { useTranslation } from '@/app/i18n/client';
import { modelsv2 } from 'algosdk';
import * as algokit from '@algorandfoundation/algokit-utils';
import * as Icons from '@tabler/icons-react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { useDebouncedCallback } from 'use-debounce';
import { dataUrlToBytes } from '@/app/lib/utils';
import { storedSignedTxnAtom, storedTxnDataAtom } from '@/app/lib/txn-data';
import { nodeConfigAtom } from '@/app/lib/node-config';
import {
  alwaysClearAfterSend as alwaysClearAfterSendAtom,
  defaultHideSendInfo as defaultHideSendInfoAtom
} from '@/app/lib/app-settings';

type Props = {
  /** Language */
  lng?: string
};

/** Message data for a failed transaction */
type FailMessage = {
  /** Type of failure message */
  type: 'error'|'warn',
  /** I18n key for the message content. */
  i18nKey: string,
  /** Values of the place holder for the message, if any */
  i18nValues?: {[name: string]: any},
  /** The detailed error message response from the node */
  details: string
}

/** Message data for a successful confirmed transaction */
type SuccessMessage = {
  /** Transaction ID of the success transaction */
  txId: string,
  /** The response data from the node */
  response: modelsv2.PendingTransactionResponse
}

/** Number of round to wait for transaction to be confirmed or to fail */
const WAIT_ROUNDS_TO_CONFIRM = 10;

/** Section for sending a transaction and showing status of the transaction */
export default function SendTxn({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['send_txn']);
  const currentURLParams = useSearchParams();
  const alwaysClearAfterSend = useAtomValue(alwaysClearAfterSendAtom);
  const defaultHideSendInfo = useAtomValue(defaultHideSendInfoAtom);

  const [waiting, setWaiting] = useState(false);
  const [pendingTxId, setPendingTxId] = useState('');
  const [failMsg, setFailMsg] = useState<FailMessage>();
  const [successMsg, setSuccessMsg] = useState<SuccessMessage>();

  const setStoredTxnData = useSetAtom(storedTxnDataAtom);
  const [storedSignedTxn, setStoredSignedTxn] = useAtom(storedSignedTxnAtom);

  const nodeConfig = useAtomValue(nodeConfigAtom);
  const algod = algokit.getAlgoClient({
    server: nodeConfig.nodeServer,
    port: nodeConfig.nodePort,
    token: (nodeConfig.nodeToken || '') as string,
  });

  /** Extract information about a failed transaction from the given error object
   * @param err Object containing the error information
   * @returns Message data about the failure
   */
  const getFailMessage = (err: any): FailMessage => {
    const details = err?.message ?? '';

    // Most likely an error when *confirming* transaction
    if (!err?.status) {
      // Node rejected transaction
      if (details.indexOf('rejected') > -1) {
        return { type: 'error', i18nKey: 'fail.rejected_msg', details };
      }

      // Transaction not confirmed within specified number of rounds
      if (details.indexOf('not confirmed') > -1) {
        return {
          type: 'warn',
          i18nKey: 'warn.not_confirmed_msg',
          i18nValues: { count: WAIT_ROUNDS_TO_CONFIRM },
          details
        };
      }

      // Some other error
      return { type: 'error', i18nKey: 'fail.unknown_msg', details };
    }

    // Most likely an error when *sending* transaction
    switch (err.status) {
      case 400:
        return { type: 'error', i18nKey: 'fail.http_400_msg', details };
      case 401:
        return { type: 'error', i18nKey: 'fail.http_401_msg', details };
      case 500:
        return { type: 'error', i18nKey: 'fail.http_500_msg', details };
      case 503:
        return { type: 'error', i18nKey: 'fail.http_503_msg', details };
      default:
        return { type: 'error', i18nKey: 'fail.http_unknown_msg', details };
    }
  };

  /** Wait for the confirmation of transaction with the given transaction ID for the given number of
   * rounds.
   * @param txId Transaction ID of the transaction to wait for
   * @param wait Number of rounds to wait
   */
  const waitForConfirmation = async (txId: string, wait: number = WAIT_ROUNDS_TO_CONFIRM) =>  {
    // Save/update transaction ID just in case the user wants to wait again
    if (txId !== pendingTxId) setPendingTxId(txId);

    try {
      const response = await algokit.waitForConfirmation(txId, wait, algod);
      setSuccessMsg({txId, response});

      // Remove stored transaction data because it is not needed anymore, if allowed by the settings
      if (alwaysClearAfterSend) {
        setStoredTxnData(RESET);
        setStoredSignedTxn(RESET);
      }
    } catch (e) {
      setFailMsg(getFailMessage(e));
    } finally {
      setWaiting(false);
    }
  };

  /** Attempt to send stored signed transaction. This function is designed to be able to be used
   * with `useEffect()` or by itself. (`useEffect` does not accept asynchronous functions)
   */
  const attemptSendTxn = useDebouncedCallback(() => {
    // If there is a signed transaction and a transaction is not currently being sent
    if (storedSignedTxn && !waiting) {
      setFailMsg(undefined); // Reset, just in case this was set before
      setSuccessMsg(undefined); // Reset, just in case this was set before
      setWaiting(true);

      const sendTxn = async () => {
        // Retrieve signed transaction
        const signedTxnBytes = await dataUrlToBytes(storedSignedTxn);
        /** JSON response to send-transaction HTTP request */
        let sendTxnResponse;

        // Send transaction
        try {
          sendTxnResponse = await algod.sendRawTransaction(signedTxnBytes).do();
          // NOTE: The state variable value isn't updated until component is re-rendered
          setPendingTxId(sendTxnResponse.txId);
        } catch (e) {
          setFailMsg(getFailMessage(e));
          setWaiting(false);
          return; // Abort
        }

        await waitForConfirmation(sendTxnResponse.txId);
      };

      sendTxn();
    }
  }, 500, {leading: true});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(attemptSendTxn, [storedSignedTxn]);

  return (
    <div className='mt-12'>
      {// Waiting...
      waiting &&
        <div className='not-prose pt-8'>
          <p className='text-2xl text-center mb-4'>{t('txn_confirm_wait')}</p>
          <progress className='progress progress-accent p-2'></progress>
        </div>
      }

      {// Transaction succeeded
      (!waiting && successMsg) && <>
        <div className='alert alert-success'>
          <Icons.IconMoodHappyFilled stroke={1.5} aria-hidden className='h-14 w-14' />
          <div
            className={'prose text-current'
              + ' prose-strong:text-current prose-headings:text-current'
              + ' max-w-none'
            }
          >
            <h2><Trans t={t} i18nKey='success.heading' /></h2>
            <p className='break-all text-start mr-1'>
              <Trans t={t} i18nKey='success.msg' values={{ txn_id: successMsg.txId }} />
            </p>
            {defaultHideSendInfo && <p className='text-start'>
              <Trans t={t} i18nKey='click_for_details'
                values={{details_title: t('success.details')}}
              />
            </p>}
          </div>
        </div>
        <details className='collapse-plus collapse border mt-6' open={!defaultHideSendInfo}>
          <summary className='collapse-title text-lg w-full'>{t('success.details')}</summary>
          <div className='collapse-content not-prose'>
            <code className={'card font-mono bg-neutral text-neutral-content'
              +' whitespace-pre overflow-x-scroll'
              +' mt-1 p-4'
            }>
{JSON.stringify(successMsg.response.get_obj_for_encoding(), null, 2)}
            </code>
          </div>
        </details>
        <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 grid-rows-1 mx-auto mt-12'>
          <Link className='btn btn-primary btn-block h-auto' href={`/${lng}`}>
            <Icons.IconHome aria-hidden />
            {t('done_btn')}
          </Link>
          <Link className='btn btn-secondary btn-block h-auto' href={`/${lng}/txn`}>
            <Icons.IconPlus aria-hidden />
            {t('make_new_txn_btn')}
          </Link>
        </div>
      </>}

      {// Transaction failed with an error
      (!waiting && failMsg?.type === 'error') && <>
        <div className='alert alert-error'>
          <Icons.IconMoodWrrr stroke={1.5} aria-hidden className='h-14 w-14' />
          <div
            className={'prose text-current'
              + ' prose-strong:text-current prose-headings:text-current'
              + ' max-w-none'
            }
          >
            <h2><Trans t={t} i18nKey='fail.heading'/></h2>
            <p className='text-start'>
              <Trans t={t} i18nKey={failMsg?.i18nKey} values={failMsg?.i18nValues} />
            </p>
            {defaultHideSendInfo && <p className='text-start'>
              <Trans t={t} i18nKey='click_for_details'
                values={{details_title: t('fail.details')}}
              />
            </p>}
          </div>
        </div>
        <details className='collapse-plus collapse border mt-6' open={!defaultHideSendInfo}>
          <summary className='collapse-title text-lg w-full'>{t('fail.details')}</summary>
          <div className='collapse-content'>
            <div className='card font-mono bg-neutral text-neutral-content mt-1 p-4'>
              {failMsg?.details}
            </div>
          </div>
        </details>
        <div className='grid gap-4 md:gap-4 grid-cols-1 md:grid-cols-5 grid-rows-1 mt-8'>
          <Link className='btn btn-primary h-auto col-span-2'
            href={{ pathname: `/${lng}/txn/compose`, query: currentURLParams.toString()}}
          >
            <Icons.IconArrowBackUpDouble aria-hidden />
            {t('compose_txn_btn')}
          </Link>
          <Link
            className='btn btn-secondary h-auto md:col-span-1 col-span-2'
            href={{pathname: `/${lng}/txn/sign`, query: currentURLParams.toString()}}
          >
            <Icons.IconArrowBackUp aria-hidden />
            {t('sign_txn_btn')}
          </Link>
          <button
            className='btn h-auto col-span-1'
            onClick={attemptSendTxn}
          >
            <Icons.IconRotate aria-hidden />
            {t('retry_btn')}
          </button>
          <Link className='btn btn-outline h-auto col-span-1 flex-1' href={`/${lng}`}>
            <Icons.IconBan aria-hidden />
            {t('quit_btn')}
          </Link>
        </div>
      </>}

      {// Warning: Transaction *may* have failed
      (!waiting && failMsg?.type === 'warn' ) && <>
        <div className='alert alert-warning'>
          <Icons.IconMoodConfuzed stroke={1.5} aria-hidden className='h-14 w-14' />
          <div
            className={'prose text-current'
              + ' prose-strong:text-current prose-headings:text-current'
              + ' max-w-none'
            }
          >
            <h2><Trans t={t} i18nKey='warn.heading' /></h2>
            <p className='text-start'>
              <Trans t={t} i18nKey={failMsg?.i18nKey} values={failMsg?.i18nValues} />
            </p>
          </div>
        </div>
        <div className='grid gap-4 md:gap-4 grid-cols-1 md:grid-cols-4 grid-rows-1 mt-8'>
          <button
            className='btn btn-primary h-auto col-span-2'
            onClick={() => {
              setFailMsg(undefined);
              waitForConfirmation(pendingTxId);
            }}
          >
            <Icons.IconClockPlus aria-hidden />
            {t('wait_longer_btn')}
          </button>
          <button
            className='btn h-auto col-span-1'
            onClick={attemptSendTxn}
          >
            <Icons.IconRotate aria-hidden />
            {t('retry_btn')}
          </button>
          <Link className='btn btn-outline h-auto col-span-1' href={`/${lng}`}>
            <Icons.IconBan aria-hidden />
            {t('quit_btn')}
          </Link>
        </div>
      </>}
    </div>
  );
}
