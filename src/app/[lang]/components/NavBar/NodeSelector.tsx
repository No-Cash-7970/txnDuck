'use client';

import { useRouter } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAtom } from 'jotai';
import { IconCircleLetterB, IconCircleLetterM, IconCircleLetterT } from '@tabler/icons-react';
import { type NodeConfig } from '@txnlab/use-wallet';
import { useTranslation } from '@/app/i18n/client';
import * as NodeConfigLib from '@/app/lib/node-config';

type Props = {
  /** Language */
  lng?: string
};

/** Node selection menu */
export default function NodeSelector({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['app', 'common']);
  const router = useRouter();
  const [nodeConfig, setNodeConfig] = useAtom(NodeConfigLib.nodeConfigAtom);

  /** Set the node configuration to the given configuration and apply the change
   * @param newConfig The new node configuration to apply
   */
  const updateNodeConfig = (newConfig: NodeConfig) => {
    setNodeConfig(newConfig);
    // The new node configuration isn't used unless the wallet provider is reloaded, which happens
    // when the page is refreshed.
    router.refresh();
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
      <button
          className={
            'btn w-auto max-w-[4rem] sm:max-w-xs mx-2 px-2 sm:px-4 '
            + (nodeConfig?.network === NodeConfigLib.TESTNET ? 'btn-secondary' : '')
            + (nodeConfig?.network === NodeConfigLib.MAINNET ? 'btn-primary' : '')
            + (nodeConfig?.network === NodeConfigLib.BETANET ? 'btn-accent' : '')
          }
          title={t('node_selector.choose_node')}
        >
          {nodeConfig?.network === NodeConfigLib.TESTNET && <>
            <IconCircleLetterT aria-hidden />
            <span className='truncate'>{t('node_selector.testnet')}</span>
          </>}
          {nodeConfig?.network === NodeConfigLib.MAINNET && <>
            <IconCircleLetterM aria-hidden />
            <span className='truncate'>{t('node_selector.mainnet')}</span>
          </>}
          {nodeConfig?.network === NodeConfigLib.BETANET && <>
            <IconCircleLetterB aria-hidden />
            <span className='truncate'>{t('node_selector.betanet')}</span>
          </>}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content asChild>
          <ul className={'z-[1000] card menu shadow-md border border-base-300 bg-base-200'
            + ' data-[side=bottom]:mt-1 data-[side=top]:mb-1'
            + ' data-[side=left]:mr-1 data-[side=right]:ml-1'
          }>
            <li className='menu-title'>{t('node_selector.choose_node')}</li>
            <DropdownMenu.Item asChild>
              <li onClick={(e) => {
                nodeConfig.network === NodeConfigLib.TESTNET
                ? e.preventDefault()
                : updateNodeConfig(NodeConfigLib.testnetNodeConfig);
              }}>
                <span>
                  <IconCircleLetterT aria-hidden />
                  <span>{t('node_selector.testnet')}</span>
                </span>
              </li>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <li onClick={(e) => {
                nodeConfig.network === NodeConfigLib.MAINNET
                ? e.preventDefault()
                : updateNodeConfig(NodeConfigLib.mainnetNodeConfig);
              }}>
                <span>
                  <IconCircleLetterM aria-hidden />
                  <span>{t('node_selector.mainnet')}</span>
                </span>
              </li>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <li onClick={(e) => {
                nodeConfig.network === NodeConfigLib.BETANET
                ? e.preventDefault()
                : updateNodeConfig(NodeConfigLib.betanetNodeConfig);
              }}>
                <span>
                  <IconCircleLetterB aria-hidden />
                  <span>{t('node_selector.betanet')}</span>
                </span>
              </li>
            </DropdownMenu.Item>
          </ul>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
