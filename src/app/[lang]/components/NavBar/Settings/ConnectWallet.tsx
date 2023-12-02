import Image from 'next/image';
import { type TFunction } from 'i18next';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { IconWallet, IconWalletOff } from '@tabler/icons-react';
import { useWallet } from '@txnlab/use-wallet';
import {
  walletTypes,
  getWalletClient,
  getActiveProvider,
} from '@/app/lib/wallet-utils';
import { useMemo } from 'react';

/** Button and menu for connecting wallet */
export default function ConnectWallet({ t }: { t: TFunction }) {
  const { providers, activeAccount, clients } = useWallet();
  const walletClient = useMemo(
    () => getWalletClient(activeAccount?.providerId, clients),
    [activeAccount, clients]
  );

  return (<>
    {!activeAccount && <>
      <div className='text-secondary mb-1'>
        <i>{t('wallet.is_not_connected')}</i>
      </div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className='btn btn-sm btn-secondary'>
            <IconWallet aria-hidden />
            {t('wallet.connect')}
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content asChild>
            <ul className={'z-[1000] card menu shadow-md border border-base-300 bg-base-200'
              + ' data-[side=bottom]:mt-1 data-[side=top]:mb-1'
              + ' data-[side=left]:mr-1 data-[side=right]:ml-1'
            }>
              <li className='menu-title'>{t('wallet.choose_provider')}</li>
              {// List of available wallet providers
                providers?.map(provider => (
                  <DropdownMenu.Item asChild key={provider.metadata.id}>
                    <li onClick={provider.connect}>
                      <span className=' auto-cols-max'>
                        <Image src={provider.metadata.icon}
                          alt={t('wallet.provider_icon_alt', {provider: provider.metadata.name})}
                          width={32}
                          height={32}
                        />
                        <div className='leading-tight'>
                          <div>{t('wallet.providers.' + provider.metadata.id)}</div>
                          <small className='italic opacity-70'>
                            {t('wallet.type.' + walletTypes[provider.metadata.id])}
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

    {!!activeAccount && walletClient &&
      <div className='bg-base-200 rounded-btn p-4'>
        <div className='not-prose truncate align-middle mb-3 px-1'>
          <Image src={walletClient.metadata.icon}
            alt={t('wallet.provider_icon_alt', {provider: walletClient.metadata.name})}
            width={20}
            height={20}
            className='inline-block me-2'
          />
          <span>{t('wallet.is_connected', {address: activeAccount.address})}</span>
        </div>
        <button type='button'
          className='btn btn-sm btn-secondary btn-block'
          onClick={() => getActiveProvider(providers)?.disconnect()}
        >
          <IconWalletOff aria-hidden />
          {t('wallet.disconnect')}
        </button>
      </div>
    }
  </>);
}
