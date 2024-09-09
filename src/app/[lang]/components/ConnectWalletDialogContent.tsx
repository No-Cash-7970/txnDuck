import Image from 'next/image';
import { IconX } from '@tabler/icons-react';
import { type TFunction } from 'i18next';
import MagicAuthPrompt, { magicPromptCanceledAtom, magicProviderAtom } from './MagicAuthPrompt';
import { useEffect, useRef } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import * as Dialog from '@radix-ui/react-dialog';
import { useWallet, WalletId } from '@txnlab/use-wallet-react';
import { walletTypes } from '@/app/lib/wallet-utils';

/** The body of the content for the "Connect Wallet" dialog */
export default function ConnectWalletDialogContent({ t }: { t: TFunction }) {
  const { wallets } = useWallet();
  const [magicProvider, setMagicProvider] = useAtom(magicProviderAtom);
  const connectWalletBtnRef = useRef<HTMLButtonElement>(null);
  const magicEmailCanceled = useAtomValue(magicPromptCanceledAtom);

  useEffect(() => {
    // Focus on "connect wallet" button only when the prompt for entering the email address to get a
    // "magic link" was canceled
    if (!magicProvider && magicEmailCanceled) connectWalletBtnRef.current?.focus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [magicProvider, magicEmailCanceled]);

  return (
    <div className='modal-box prose max-w-4xl'>
      {magicProvider && <>
        <Dialog.Title className='mb-3'>{t('app:wallet.magic_prompt.heading')}</Dialog.Title>
        <form
          noValidate={true}
          aria-label={t('app:wallet.magic_prompt.heading')}
          onSubmit={(e) => e.preventDefault()}
        >
          <MagicAuthPrompt t={t} />
        </form>
      </>}
      {!magicProvider && <>
        <Dialog.Title className='mb-3'>{t('app:wallet.choose_provider')}</Dialog.Title>
        <Dialog.Description className='text-sm'>
          {t('app:wallet.choose_provider_description')}
        </Dialog.Description>
        {/* List of available wallet providers */}
        <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3'>
          {wallets?.map(provider => (
            <div key={provider.id} className={
              'alert gap-1 sm:gap-4 content-evenly shadow-md border-base-300 bg-base-100'
            }>
              <span className={'not-prose relative h-16 w-16 sm:h-24 sm:w-24'}>
                <Image src={provider.metadata.icon}
                  alt={t('app:wallet.provider_icon_alt', {provider: provider.metadata.name})}
                  fill
                  aria-hidden
                />
              </span>
              {/* Wallet provider info + button */}
              <div className='w-full'>
                <div>
                  <h3 className='m-0'>{t('app:wallet.providers.' + provider.id)}</h3>
                  <p className='italic opacity-70 m-0'>
                    {t('app:wallet.type.' + walletTypes[provider.id])}
                  </p>
                </div>
                <button className='btn btn-block btn-sm btn-secondary mt-2'
                  onClick={() => {
                    if (provider.id === WalletId.MAGIC) {
                      // Need to ask for email address
                      setMagicProvider(provider);
                      return;
                    }
                    provider.connect();
                  }}
                >
                  {t('app:wallet.use_provider_btn', {provider: provider.metadata.name})}
                </button>
              </div>
            </div>
          ))}
        </div>
      </>}
      {/* Upper corner close button */}
      <Dialog.Close asChild>
        <button type="button" title={t('close')} className={
          'btn-ghost btn btn-sm btn-square text-base-content absolute end-3 top-3'
        }>
          <IconX aria-hidden />
        </button>
      </Dialog.Close>
    </div>
  );
}
