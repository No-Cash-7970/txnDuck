'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { useAtomValue } from 'jotai';
import {
  IconBox,
  IconEyeCog,
  IconFlask,
  IconPencilCog,
  IconDeviceDesktop,
  IconServer2,
  IconServerCog,
  IconSquareRoundedLetterV,
  IconTestPipe,
  IconTopologyRing,
  IconX,
} from '@tabler/icons-react';
import { useTranslation } from '@/app/i18n/client';
import * as NodeConfigLib from '@/app/lib/node-config';
import { DialogLoadingPlaceholder } from '@/app/[lang]/components';
import NodeMenuItem from './NodeMenuItem';

const ViewConfigDialogContent = dynamic(() => import('./ViewConfigDialogContent'), {
  ssr: false,
  loading: () => <DialogLoadingPlaceholder />,
});
const CustomNodeDialogContent = dynamic(() => import('./CustomNodeDialogContent'), {
  ssr: false,
  loading: () => <DialogLoadingPlaceholder />,
});
const NodeSelectorButtonText = dynamic(() => import('./NodeSelectorButtonText'), {
  ssr: false,
  loading: () => <span className='loading loading-ring loading-lg' aria-hidden />,
});

type Props = {
  /** Language */
  lng?: string
};

/** Node selection menu */
export default function NodeSelector({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['app', 'common']);
  const customNode = useAtomValue(NodeConfigLib.customNodeAtom);
  const [customConfigOpen, setCustomConfigOpen] = useState<boolean>(false);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button title={t('node_selector.choose_node')}
          className={ 'btn btn-accent'
            + ' w-auto max-w-[4rem] mx-2 px-2 text-xs gap-1 leading-tight'
            + ' sm:max-w-sm sm:px-4 sm:text-sm sm:gap-2' }
        >
          <NodeSelectorButtonText t={t} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content asChild>
          <ul className={
            'z-[1000] card menu shadow-md border border-base-300 bg-base-200 max-w-72 overflow-auto'
            + ' data-[side=bottom]:mt-1 data-[side=top]:mb-1'
            + ' data-[side=left]:mr-1 data-[side=right]:ml-1'
            + ' max-h-[var(--radix-dropdown-menu-content-available-height)]'
            + ' prose-li:max-w-full'
          }>
            <li className='menu-title'>{t('node_selector.choose_node')}</li>
            {/* Node Presets */}
            <NodeMenuItem config={NodeConfigLib.mainnetNodeConfig}>
              <IconBox aria-hidden stroke={1.5} />
              <span>{t('node_selector.mainnet')}</span>
            </NodeMenuItem>
            <NodeMenuItem config={NodeConfigLib.testnetNodeConfig}>
              <IconFlask aria-hidden stroke={1.5} />
              <span>{t('node_selector.testnet')}</span>
            </NodeMenuItem>
            <NodeMenuItem config={NodeConfigLib.betanetNodeConfig}>
              <IconTestPipe aria-hidden stroke={1.5} />
              <span>{t('node_selector.betanet')}</span>
            </NodeMenuItem>
            <NodeMenuItem config={NodeConfigLib.fnetNodeConfig}>
              <IconTopologyRing aria-hidden stroke={1.5} />
              <span>{t('node_selector.fnet')}</span>
            </NodeMenuItem>
            <NodeMenuItem config={NodeConfigLib.voiMainnetNodeConfig}>
              <IconSquareRoundedLetterV aria-hidden stroke={1.5} />
              <span>{t('node_selector.voimain')}</span>
            </NodeMenuItem>
            <NodeMenuItem config={NodeConfigLib.localnetNodeConfig}>
              <IconDeviceDesktop aria-hidden stroke={1.5} />
              <span>{t('node_selector.localnet')}</span>
            </NodeMenuItem>
            {customNode && <NodeMenuItem config={customNode}>
              <IconServer2 aria-hidden stroke={1.5} />
              <span>{t('node_selector.custom')}</span>
            </NodeMenuItem>}
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
            {/* Custom configuration */}
            <Dialog.Root open={customConfigOpen} onOpenChange={setCustomConfigOpen}>
              <Dialog.Trigger asChild>
                <DropdownMenu.Item asChild onSelect={
                  (e) => e.preventDefault() // Disable action so dialog can work
                }>
                  <li className='mb-1'>
                    <span className='bg-secondary text-secondary-content hover:text-base-content'>
                      {!customNode && <>
                        <IconServerCog stroke={1.5} aria-hidden />
                        {t('node_selector.custom_config.set_btn')}
                      </>}
                      {customNode && <>
                        <IconPencilCog stroke={1.5} aria-hidden />
                        {t('node_selector.custom_config.edit_btn')}
                      </>}
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
                      {t('node_selector.custom_config.heading')}
                    </Dialog.Title>
                    <CustomNodeDialogContent lng={lng} setopen={setCustomConfigOpen} />
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
