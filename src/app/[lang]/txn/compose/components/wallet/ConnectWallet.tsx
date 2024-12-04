import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import * as Dialog from '@radix-ui/react-dialog';
import * as Icons from '@tabler/icons-react';
import { type NetworkId, useWallet } from '@txnlab/use-wallet-react';
import {
  magicPromptCanceledAtom,
  magicProviderAtom,
  WalletDialogContent
} from '@/app/[lang]/components/wallet';
import { nodeConfigAtom } from '@/app/lib/node-config';
import { isWalletConnectedAtom } from '@/app/lib/wallet-utils';

/** Button and menu for connecting wallet */
export default function ConnectWallet({ t, setvalfn }:{
  t: TFunction,
  setvalfn: (v: any) => void,
}) {
  const nodeConfig = useAtomValue(nodeConfigAtom);
  const { activeAccount, activeWallet, activeNetwork, setActiveNetwork } = useWallet();
  const magicProvider = useAtomValue(magicProviderAtom);
  const connectWalletBtnRef = useRef<HTMLButtonElement>(null);
  const magicEmailCanceled = useAtomValue(magicPromptCanceledAtom);
  const setIsWalletConnected = useSetAtom(isWalletConnectedAtom);

  useEffect(() => {
    // Focus on "connect wallet" button only when the prompt for entering the email address to get a
    // "magic link" was canceled
    if (!magicProvider && magicEmailCanceled) connectWalletBtnRef.current?.focus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    {!activeAccount &&
      <Dialog.Root modal={false}>
        <Dialog.Trigger asChild>
          <button type='button' className='btn btn-block btn-secondary btn-sm mt-1'>
            <Icons.IconWallet aria-hidden size={16} />
            {t('app:wallet.connect')}
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content
            className='modal data-[state=open]:modal-open'
            aria-describedby={undefined}
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <WalletDialogContent t={t} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    }

    {!!activeAccount && activeWallet &&
      <div className='bg-base-200 rounded-btn p-2 text-sm mt-1'>
        <button type='button'
          className='btn btn-sm btn-secondary btn-block mb-3'
          onClick={() => setvalfn(activeAccount.address)}
        >
          {t('app:wallet.set_field_to_connected_addr')}
        </button>
        <div className='mt-1 grid grid-cols-1 sm:grid-cols-3 gap-2'>
          <div className='not-prose truncate align-middle px-1 sm:col-span-2'>
            <span className='inline-block me-2 relative h-6 w-6 align-middle'>
              <Image src={activeWallet.metadata.icon}
                alt={t('app:wallet.provider_icon_alt', {provider: activeWallet.metadata.name})}
                fill
              />
            </span>
            <span className='align-middle'>
              {t('app:wallet.is_connected', {address: activeAccount.address})}
            </span>
          </div>
          <button type='button'
            className='btn btn-xs btn-outline btn-block sm:col-span-1'
            onClick={() => activeWallet.disconnect()}
          >
            <Icons.IconWalletOff aria-hidden size={16} />
            {t('app:wallet.disconnect')}
          </button>
        </div>
      </div>
    }
  </>);
}
