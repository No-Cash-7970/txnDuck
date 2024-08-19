import Image from 'next/image';
import { type TFunction } from 'i18next';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { IconWallet, IconWalletOff } from '@tabler/icons-react';
import { WalletId, useWallet } from '@txnlab/use-wallet-react';
import { walletTypes } from '@/app/lib/wallet-utils';

/** Button and menu for connecting wallet */
export default function ConnectWallet({ t }: { t: TFunction }) {
  const { wallets, activeAccount, activeWallet } = useWallet();

  return (<>
    {!activeAccount && <>
      <div className='text-secondary mb-2 text-center'>
        <i>{t('wallet.is_not_connected')}</i>
      </div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className='btn btn-block btn-secondary'>
            <IconWallet aria-hidden />
            {t('wallet.connect')}
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content asChild>
            <ul className={
              'z-[1000] card menu shadow-md border border-base-300 bg-base-200 overflow-auto'
              + ' data-[side=bottom]:mt-1 data-[side=top]:mb-1'
              + ' data-[side=left]:mr-1 data-[side=right]:ml-1'
              + ' max-w-[var(--radix-dropdown-menu-trigger-width)]'
              + ' max-h-[var(--radix-dropdown-menu-content-available-height)]'
              + ' prose-li:max-w-full'
            }>
              <li className='menu-title'>{t('wallet.choose_provider')}</li>
              {// List of available wallet providers
                wallets?.map(provider => (
                  <DropdownMenu.Item asChild key={provider.id}>
                    <li onClick={provider.connect}>
                      <span className='auto-cols-max'>
                        <span className='relative h-8 w-8'>
                          <Image src={provider.metadata.icon}
                            alt={t('wallet.provider_icon_alt', {provider: provider.metadata.name})}
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

    {!!activeAccount && activeWallet &&
      <div className='bg-base-200 rounded-btn p-4'>
        <div className='not-prose truncate align-middle mb-3 px-1'>
          <span className='inline-block me-2 relative h-6 w-6 align-middle'>
            <Image src={activeWallet.metadata.icon}
              alt={t('wallet.provider_icon_alt', {provider: activeWallet.metadata.name})}
              fill
              className={
                // Add a light background to the dark-text KMD icon for visibility in dark mode
                activeWallet.id === WalletId.KMD ? 'bg-gray-100' : undefined
              }
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
