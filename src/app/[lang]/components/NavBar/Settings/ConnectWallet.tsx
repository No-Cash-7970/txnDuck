import Image from 'next/image';
import { type TFunction } from 'i18next';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { IconWallet, IconWalletOff } from '@tabler/icons-react';
import { PROVIDER_ID, useWallet } from '@txnlab/use-wallet';
import {
  walletTypes,
  disconnectWallet as utilsDisconnectWallet,
  getWalletClient as utilsGetClient,
} from '@/app/lib/wallet-utils';

/** Button and menu for connecting wallet */
export default function ConnectWallet({ t }: { t: TFunction }) {
  const { providers, activeAccount, clients } = useWallet();
  const disconnectWallet = () => utilsDisconnectWallet(clients, activeAccount);
  const getClient = (providerId?: PROVIDER_ID) => utilsGetClient(providerId, clients);

  return (
    <>
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
                {
                  providers?.map(provider => (
                    <DropdownMenu.Item asChild key={provider.metadata.id}>
                      <li
                        onClick={(e) => {
                          getClient(provider.metadata.id)
                            ? provider.connect()
                            : e.preventDefault();
                        }}
                        className={getClient(provider.metadata.id) ? '' : 'disabled'}
                      >
                        <span className=' auto-cols-max'>
                          <Image
                            src={provider.metadata.icon}
                            alt={t('wallet.provider_icon_alt', {provider: provider.metadata.name})}
                            width={32}
                            height={32}
                            className={getClient(provider.metadata.id) ? '' : 'opacity-20'}
                          />
                          <div className='leading-tight'>
                            <div>
                              {t('wallet.providers.' + provider.metadata.id)}
                              {
                                getClient(provider.metadata.id)
                                ? ''
                                : <i>{t('wallet.provider_unavailable')}</i>
                              }
                            </div>
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

      {!!activeAccount &&
        <div className='bg-base-200 rounded-btn p-4'>
          <div className='not-prose truncate align-middle mb-3 px-1'>
            <Image
              src={getClient(activeAccount.providerId)?.metadata.icon || ''}
              alt={t(
                'wallet.provider_icon_alt',
                {provider: getClient(activeAccount.providerId)?.metadata.name}
              )}
              width={20}
              height={20}
              className='inline-block me-2'
            />
            <span>{t('wallet.is_connected', {address: activeAccount.address})}</span>
          </div>
          <button className='btn btn-sm btn-secondary btn-block' onClick={disconnectWallet}>
            <IconWalletOff aria-hidden />
            {t('wallet.disconnect')}
          </button>
        </div>
      }
    </>
  );
}
