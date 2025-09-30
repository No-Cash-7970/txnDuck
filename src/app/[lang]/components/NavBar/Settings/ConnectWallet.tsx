import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { type TFunction } from 'i18next';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { IconWallet, IconWalletOff } from '@tabler/icons-react';
import { type NetworkId, WalletId, useNetwork, useWallet } from '@txnlab/use-wallet-react';
import { walletTypes } from '@/app/lib/wallet-utils';
import {
  MagicAuthPrompt,
  magicPromptCanceledAtom,
  magicProviderAtom
} from '@/app/[lang]/components/wallet';
import { isWalletConnectedAtom } from '@/app/lib/wallet-utils';
import { nodeConfigAtom } from '@/app/lib/node-config';

/** Button and menu for connecting wallet */
export default function ConnectWallet({ t }: { t: TFunction }) {
  const nodeConfig = useAtomValue(nodeConfigAtom);
  const { wallets, activeAccount, activeWallet } = useWallet();
  const { activeNetwork, setActiveNetwork } = useNetwork();
  const [magicProvider, setMagicProvider] = useAtom(magicProviderAtom);
  const connectWalletBtnRef = useRef<HTMLButtonElement>(null);
  const magicEmailCanceled = useAtomValue(magicPromptCanceledAtom);
  const setIsWalletConnected = useSetAtom(isWalletConnectedAtom);
  /** Indicates whether there is a wallet attempting to connect */
  const [walletIsConnecting, setWalletIsConnecting ]= useState(false);

  useEffect(() => {
    // Focus on "connect wallet" button only when the prompt for entering the email address to get a
    // "magic link" was canceled
    if (!magicProvider && magicEmailCanceled) connectWalletBtnRef.current?.focus();
  }, [magicProvider, magicEmailCanceled]);

  useEffect(() => {
    // Tell other components wallet connection status has changed
    setIsWalletConnected(!!activeAccount);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccount]);

  useEffect(() => {
    // Ensure use-wallet uses the correct network ID, which can change when the user switches to a
    // different node
    setActiveNetwork(nodeConfig.network as NetworkId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetwork, nodeConfig]);

  return (<>
    {!activeAccount && <>
      {magicProvider && <MagicAuthPrompt t={t} />}
      {!magicProvider && <>
        <div className='text-secondary mb-2 text-center'>
          <i>{t('wallet.is_not_connected')}</i>
        </div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild ref={connectWalletBtnRef}>
            <button type='button' className='btn btn-block btn-secondary'>
              {walletIsConnecting
                ? <span className='loading loading-spinner' />
                : <>
                  <IconWallet aria-hidden />
                  {t('wallet.connect')}
                </>
              }
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content asChild>
              <ul className={
                'z-1000 card menu shadow-md border border-base-300 bg-base-200 overflow-auto'
                + ' data-[side=bottom]:mt-1 data-[side=top]:mb-1'
                + ' data-[side=left]:mr-1 data-[side=right]:ml-1'
                + ' max-w-[var(--radix-dropdown-menu-trigger-width)]'
                + ' max-h-[var(--radix-dropdown-menu-content-available-height)]'
                + ' prose-li:max-w-full'
              }>
                <li className='menu-title'>{t('wallet.providers_list_title')}</li>
                {// List of available wallet providers
                  wallets?.map(provider => (
                    <DropdownMenu.Item asChild key={provider.id}>
                      <li onClick={() => {
                        if (provider.id === WalletId.MAGIC) {
                          // Need to ask for email address
                          setMagicProvider(provider);
                          return;
                        }
                        setWalletIsConnecting(true);
                        provider.connect().finally(() => setWalletIsConnecting(false));
                      }}>
                        <span className='auto-cols-max'>
                          <span className='relative h-8 w-8'>
                            <Image src={provider.metadata.icon}
                              alt={t('wallet.provider_icon_alt', {
                                provider: t(`wallet.providers.${provider.id}`)
                              })}
                              fill
                              aria-hidden
                            />
                          </span>
                          <div className='leading-tight'>
                            <div>{t('wallet.providers.' + provider.id)}</div>
                            <small className='italic opacity-70'>
                              {t('wallet.type.' + walletTypes[provider.id])}
                            </small>
                          </div>
                        </span>
                      </li>
                    </DropdownMenu.Item>
                  ))
                }
              </ul>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </>}
    </>}

    {!!activeAccount && activeWallet &&
      <div className='bg-base-200 rounded-btn p-4'>
        <div className='not-prose truncate align-middle mb-3 px-1'>
          <span className='inline-block me-2 relative h-6 w-6 align-middle'>
            <Image src={activeWallet.metadata.icon}
              alt={t('wallet.provider_icon_alt', {provider: activeWallet.metadata.name})}
              fill
            />
          </span>
          <span className='align-middle'>
            {t('wallet.is_connected', {address: activeAccount.address})}
          </span>
        </div>
        <button type='button'
          className='btn btn-sm btn-secondary btn-block'
          onClick={() => activeWallet.disconnect()}
        >
          <IconWalletOff aria-hidden />
          {t('wallet.disconnect')}
        </button>
      </div>
    }
  </>);
}
