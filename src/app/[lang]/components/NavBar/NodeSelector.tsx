'use client';

import { useRouter } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAtom } from "jotai";
import { IconCircleLetterB, IconCircleLetterM, IconCircleLetterT } from "@tabler/icons-react";
import { type NodeConfig } from "@txnlab/use-wallet";
import { useTranslation } from "@/app/i18n/client";
import {
  BETANET,
  MAINNET,
  TESTNET,
  betanetNodeConfig,
  nodeConfigAtom,
  mainnetNodeConfig,
  testnetNodeConfig
} from "@/app/lib/node-config";

type Props = {
  /** Language */
  lng?: string
};

/** Node selection menu */
export default function NodeSelector({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['app', 'common']);
  const router = useRouter();
  const [nodeConfig, setNodeConfig] = useAtom(nodeConfigAtom);

  /**
   * Set the node configuration to the given configuration and apply the change
   *
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
        <div className='mx-2'>
          {nodeConfig?.network === TESTNET &&
            <button
              className='btn btn-secondary w-auto max-w-[4rem] sm:max-w-xs px-2 sm:px-4'
              title={t('node_selector.choose_node')}
            >
              <IconCircleLetterT aria-hidden />
              <span className='truncate'>{t('node_selector.testnet')}</span>
            </button>
          }
          {nodeConfig?.network === MAINNET &&
            <button
              className='btn btn-primary w-auto max-w-[4rem] sm:max-w-xs px-2 sm:px-4'
              title={t('node_selector.choose_node')}
            >
              <IconCircleLetterM aria-hidden />
              <span className='truncate'>{t('node_selector.mainnet')}</span>
            </button>
          }
          {nodeConfig?.network === BETANET &&
            <button
              className='btn btn-accent w-auto max-w-[4rem] sm:max-w-xs px-2 sm:px-4'
              title={t('node_selector.choose_node')}
            >
              <IconCircleLetterB aria-hidden />
              <span className='truncate'>{t('node_selector.betanet')}</span>
            </button>
          }
        </div>
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
                nodeConfig.network === TESTNET
                ? e.preventDefault()
                : updateNodeConfig(testnetNodeConfig);
              }}>
                <span>
                  <IconCircleLetterT aria-hidden />
                  <span>{t('node_selector.testnet')}</span>
                </span>
              </li>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <li onClick={(e) => {
                nodeConfig.network === MAINNET
                ? e.preventDefault()
                : updateNodeConfig(mainnetNodeConfig);
              }}>
                <span>
                  <IconCircleLetterM aria-hidden />
                  <span>{t('node_selector.mainnet')}</span>
                </span>
              </li>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <li onClick={(e) => {
                nodeConfig.network === BETANET
                ? e.preventDefault()
                : updateNodeConfig(betanetNodeConfig);
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
