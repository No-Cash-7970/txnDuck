'use client';

import Image from 'next/image';
import algosdk from 'algosdk';
import { PROVIDER_ID, useWallet } from '@txnlab/use-wallet';
import * as Dialog from '@radix-ui/react-dialog';
import * as Icons from '@tabler/icons-react';
import { useAtom, useAtomValue } from 'jotai';
import { RESET } from 'jotai/utils';
import { useTranslation } from '@/app/i18n/client';
import {
  walletTypes,
  disconnectWallet as utilsDisconnectWallet,
  getWalletClient as utilsGetClient,
} from '@/app/lib/wallet-utils';
import { storedSignedTxnAtom, storedTxnDataAtom } from '@/app/lib/txn-data';
import { createTxnFromData } from '@/app/lib/txn-data-processor';
import { bytesToBase64DataUrl, dataUrlToBytes } from '@/app/lib/utils';
import { useEffect } from 'react';

type Props = {
  /** Language */
  lng?: string
};

/** Buttons for connecting to wallet and signing transaction */
export default function SignTxn({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['app', 'common', 'sign_txn']);
  const storedTxnData = useAtomValue(storedTxnDataAtom);
  const [storedSignedTxn, setStoredSignedTxn] = useAtom(storedSignedTxnAtom);
  const { providers, activeAccount, clients, signTransactions } = useWallet();

  const disconnectWallet = () => utilsDisconnectWallet(clients, activeAccount);
  const getWalletClient = (providerId?: PROVIDER_ID) => utilsGetClient(providerId, clients);

  /** Create transaction object from stored transaction data and sign the transaction */
  const signTransaction = async () => {
    if (!storedTxnData) throw Error('No transaction data exists in session storage');

    // Create Transaction object and encoded it
    const unsignedTxn = algosdk.encodeUnsignedTransaction(
      createTxnFromData(storedTxnData.txn, storedTxnData.gen, storedTxnData.gh)
    );

    // Sign the transaction and store it
    const signedTxn = (await signTransactions([unsignedTxn]))[0];
    const signedTxnBase64 = await bytesToBase64DataUrl(signedTxn);
    setStoredSignedTxn(signedTxnBase64);
  };

  useEffect(() => {
    if (!storedTxnData || !storedSignedTxn) return;

    // Remove stored signed transaction if the transaction data was edited
    dataUrlToBytes(storedSignedTxn)
      .then((signedTxnBytes) => {
        const unsignedTxn = createTxnFromData(
          storedTxnData.txn, storedTxnData.gen, storedTxnData.gh
        );
        const signedTxn = algosdk.decodeSignedTransaction(signedTxnBytes).txn;

        if (unsignedTxn.txID() !== signedTxn.txID()) setStoredSignedTxn(RESET);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedTxnData]);

  return (
    <>
      {(!activeAccount && !storedSignedTxn) &&
        <Dialog.Root modal={false}>
          <Dialog.Trigger asChild>
            <button className='btn btn-secondary btn-block min-h-[5em] h-auto'>
              <Icons.IconWallet aria-hidden />
              {t('wallet.connect')}
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content
              className='modal data-[state=open]:modal-open'
              onPointerDownOutside={(e) => e.preventDefault()}
              onInteractOutside={(e) => e.preventDefault()}
            >
              <div className='modal-box prose max-w-4xl'>
                <Dialog.Title className='mb-3'>{t('wallet.choose_provider')}</Dialog.Title>
                <Dialog.Description className='text-sm'>
                  {t('wallet.choose_provider_description')}
                </Dialog.Description>

                <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3'>
                  {providers?.map(provider => (
                    <div
                      key={provider.metadata.id}
                      onClick={(e) => {
                        getWalletClient(provider.metadata.id)
                          ? provider.connect()
                          : e.preventDefault();
                      }}
                      className={
                        'alert gap-1 sm:gap-4 content-evenly shadow-md border-base-300 bg-base-100'
                        + (getWalletClient(provider.metadata.id) ? '' : ' opacity-50')
                      }
                    >
                      <Image
                        src={provider.metadata.icon}
                        alt={t('wallet.provider_icon_alt', {provider: provider.metadata.name})}
                        width={80}
                        height={80}
                        className={'not-prose h-16 w-auto sm:h-24'}
                      />

                      <div className='w-full'>
                        <div>
                          <h3 className='m-0'>
                            {t('wallet.providers.' + provider.metadata.id)}
                            {
                              getWalletClient(provider.metadata.id)
                              ? ''
                              : <i>{t('wallet.provider_unavailable')}</i>
                            }
                          </h3>
                          <p className='italic opacity-70 m-0'>
                            {t('wallet.type.' + walletTypes[provider.metadata.id])}
                          </p>
                        </div>
                        <button
                          className='btn btn-block btn-sm btn-secondary mt-2'
                          disabled={!getWalletClient(provider.metadata.id)}
                        >
                          {t('wallet.use_provider_btn', {provider: provider.metadata.name})}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <Dialog.Close asChild>
                  <button
                    className={
                      'btn-ghost btn btn-sm btn-square text-base-content absolute end-3 top-3'
                    }
                    title={t('close')}
                  >
                    <Icons.IconX aria-hidden />
                  </button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      }
      {(activeAccount && !storedSignedTxn) &&
        <div className='mt-8'>
          <button
            className='btn btn-primary btn-block min-h-[5em] h-auto'
            onClick={() => signTransaction()}
          >
            <Icons.IconBallpenFilled aria-hidden />
            {t('sign_txn:sign_txn_btn')}
          </button>

          <div className='not-prose text-center mt-3'>
            <div className='truncate align-middle px-2'>
              <Image
                src={getWalletClient(activeAccount.providerId)?.metadata.icon || ''}
                alt={t(
                  'wallet.provider_icon_alt',
                  {provider: getWalletClient(activeAccount.providerId)?.metadata.name}
                )}
                width={24}
                height={24}
                className='inline-block me-2'
              />
              <span>{t('wallet.is_connected', {address: activeAccount.address})}</span>
            </div>
            <button className='btn btn-sm btn-link text-secondary' onClick={disconnectWallet}>
              <Icons.IconWalletOff aria-hidden />
              {t('wallet.disconnect')}
            </button>
          </div>
        </div>
      }
      {storedSignedTxn &&
        <div className='alert alert-success break-all mt-8'>
          <Icons.IconCircleCheck aria-hidden />
          {t('sign_txn:txn_signed')}
        </div>
      }
    </>
  );
}
