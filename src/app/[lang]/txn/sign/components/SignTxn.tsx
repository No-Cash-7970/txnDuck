'use client';

import Image from 'next/image';
import { PROVIDER_ID, useWallet } from "@txnlab/use-wallet";
import * as Dialog from '@radix-ui/react-dialog';
import { useTranslation } from "@/app/i18n/client";
import { IconBallpenFilled, IconWallet, IconWalletOff, IconX } from "@tabler/icons-react";
import {
  walletTypes,
  disconnectWallet as utilsDisconnectWallet,
  getClient as utilsGetClient,
} from '@/app/lib/WalletUtils';

type Props = {
  /** Language */
  lng?: string,
  /** The open state of the dialog when it is initially rendered */
  open?: boolean,
};

/** Buttons for connecting to wallet and signing transaction */
export default function SignTxn({ lng, open = false }: Props) {
  const { t } = useTranslation(lng || '', ['app', 'common', 'sign_txn']);
  const { providers, activeAccount, clients } = useWallet();
  const disconnectWallet = () => utilsDisconnectWallet(clients, activeAccount);
  const getClient = (providerId?: PROVIDER_ID) => utilsGetClient(providerId, clients);

  return (
    <>
      {!activeAccount &&
        <Dialog.Root modal={false}>
          <Dialog.Trigger asChild>
            <button className='btn btn-secondary btn-block min-h-[5em] h-auto'>
              <IconWallet aria-hidden />
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
                        getClient(provider.metadata.id)
                          ? provider.connect()
                          : e.preventDefault();
                      }}
                      className={
                        'alert gap-1 sm:gap-4 content-evenly shadow-md border-base-300 bg-base-100'
                        + (getClient(provider.metadata.id) ? '' : ' opacity-50')
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
                              getClient(provider.metadata.id)
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
                          disabled={!getClient(provider.metadata.id)}
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
                    <IconX aria-hidden />
                  </button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      }
      {!!activeAccount &&
        <div className='mt-8'>
          {/* TODO: Add ability to sign transaction */}
          <button
            className='btn btn-primary btn-block min-h-[5em] h-auto'
            // onClick={() => signTransaction()}
          >
            <IconBallpenFilled aria-hidden />
            {t('sign_txn:sign_txn_btn')}
          </button>

          <div className='not-prose text-center mt-3'>
            <div className='truncate align-middle px-2'>
              <Image
                src={getClient(activeAccount.providerId)?.metadata.icon || ''}
                alt={t(
                  'wallet.provider_icon_alt',
                  {provider: getClient(activeAccount.providerId)?.metadata.name}
                )}
                width={24}
                height={24}
                className='inline-block me-2'
              />
              <span>{t('wallet.is_connected', {address: activeAccount.address})}</span>
            </div>
            <button className='btn btn-sm btn-link text-secondary' onClick={disconnectWallet}>
              <IconWalletOff aria-hidden />
              {t('wallet.disconnect')}
            </button>
          </div>
        </div>
      }
    </>
  );
}
