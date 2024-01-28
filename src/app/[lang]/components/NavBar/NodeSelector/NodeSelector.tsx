'use client';

import { useRouter } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import dynamic from 'next/dynamic';
import * as Dialog from '@radix-ui/react-dialog';
import { useAtom } from 'jotai';
import {
  IconTestPipe,
  IconBox,
  IconSandbox,
  IconFlask,
  IconEyeCog,
  IconX,
} from '@tabler/icons-react';
import { type NodeConfig } from '@txnlab/use-wallet';
import { useTranslation } from '@/app/i18n/client';
import * as NodeConfigLib from '@/app/lib/node-config';

const ViewConfigDialogContent = dynamic(() => import('./ViewConfigDialogContent'), {
  ssr: false,
  loading: () => (
    <p className='text-center'>
      <span className='loading loading-ball loading-lg text-primary'></span>
      <span className='loading loading-ball loading-lg text-secondary'></span>
      <span className='loading loading-ball loading-lg text-accent'></span>
    </p>
  ),
});

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
          className='btn btn-accent w-auto max-w-[4rem] sm:max-w-xs mx-2 px-2 sm:px-4'
          title={t('node_selector.choose_node')}
        >
          {nodeConfig?.network === NodeConfigLib.TESTNET && <>
            <IconFlask aria-hidden />
            <span className='truncate'>{t('node_selector.testnet')}</span>
          </>}
          {nodeConfig?.network === NodeConfigLib.MAINNET && <>
            <IconBox aria-hidden />
            <span className='truncate'>{t('node_selector.mainnet')}</span>
          </>}
          {nodeConfig?.network === NodeConfigLib.BETANET && <>
            <IconTestPipe aria-hidden />
            <span className='truncate'>{t('node_selector.betanet')}</span>
          </>}
          {nodeConfig?.network === NodeConfigLib.SANDBOX && <>
            <IconSandbox aria-hidden />
            <span className='truncate'>{t('node_selector.sandbox')}</span>
          </>}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content asChild>
          <ul className={'z-[1000] card menu shadow-md border border-base-300 bg-base-200 max-w-72'
            + ' data-[side=bottom]:mt-1 data-[side=top]:mb-1'
            + ' data-[side=left]:mr-1 data-[side=right]:ml-1'
          }>
            <li className='menu-title'>{t('node_selector.choose_node')}</li>
            {/* Node Presets */}
            <DropdownMenu.Item asChild>
              <li className='mb-1' onClick={
                (e) => updateNodeConfig(NodeConfigLib.testnetNodeConfig)
              }>
                <span>
                  <IconFlask aria-hidden stroke={1.5} />
                  <span>{t('node_selector.testnet')}</span>
                </span>
              </li>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <li className='mb-1' onClick={
                (e) => updateNodeConfig(NodeConfigLib.mainnetNodeConfig)
              }>
                <span>
                  <IconBox aria-hidden stroke={1.5} />
                  <span>{t('node_selector.mainnet')}</span>
                </span>
              </li>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <li className='mb-1' onClick={
                (e) => updateNodeConfig(NodeConfigLib.betanetNodeConfig)
              }>
                <span>
                  <IconTestPipe aria-hidden stroke={1.5} />
                  <span>{t('node_selector.betanet')}</span>
                </span>
              </li>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <li className='mb-1' onClick={
                (e) => updateNodeConfig(NodeConfigLib.sandboxNodeConfig)
              }>
                <span>
                  <IconSandbox aria-hidden stroke={1.5} />
                  <span>{t('node_selector.sandbox')}</span>
                </span>
              </li>
            </DropdownMenu.Item>
            {/* View current configuration */}
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <DropdownMenu.Item asChild onSelect={
                  (e) => e.preventDefault() // Disable action so dialog can work
                }>
                  <li className='mb-1'>
                    <span className='bg-neutral text-neutral-content hover:text-base-content'>
                      <IconEyeCog stroke={1.5} aria-hidden />
                      {t('node_selector.view_config.btn')}
                    </span>
                  </li>
                </DropdownMenu.Item>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay />
                <Dialog.Content
                  className='modal data-[state=open]:modal-open z-[1000]'
                  aria-describedby={undefined}
                >
                  <div className='modal-box prose px-0 max-w-xl'>
                    <Dialog.Title className='px-6 sm:px-8'>
                      {t('node_selector.view_config.heading')}
                    </Dialog.Title>
                    <ViewConfigDialogContent lng={lng} />
                    <Dialog.Close asChild>
                      {/* eslint-disable-next-line max-len */}
                      <button className='btn-ghost btn btn-sm btn-square text-base-content fixed end-3 top-3'
                        title={t('close')}
                      >
                        <IconX aria-hidden />
                      </button>
                    </Dialog.Close>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </ul>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
