'use client';

import {
  WalletProvider as Provider,
  useInitializeProviders,
  PROVIDER_ID,
} from '@txnlab/use-wallet';
import { useAtomValue } from 'jotai';
import { nodeConfigAtom } from '@/app/lib/node-config';

const getDynamicDeflyWalletConnect = async () => {
  const DeflyWalletConnect = (await import('@blockshake/defly-connect')).DeflyWalletConnect;
  return DeflyWalletConnect;
};

const getDynamicPeraWalletConnect = async () => {
  const PeraWalletConnect = (await import('@perawallet/connect')).PeraWalletConnect;
  return PeraWalletConnect;
};

const getDynamicMyAlgoWalletConnect = async () => {
  const MyAlgoWalletConnect = (await import('@randlabs/myalgo-connect')).default;
  return MyAlgoWalletConnect;
};

const getDynamicDaffiWalletConnect = async () => {
  const DaffiWalletConnect = (await import('@daffiwallet/connect')).DaffiWalletConnect;
  return DaffiWalletConnect;
};

const getDynamicLuteConnect = async () => {
  const LuteConnect = (await import('lute-connect')).default;
  return LuteConnect;
};

/** Wrapper for initializing the use-wallet library. Also serves as a provider to convert the
 * use-wallet wallet provider to a client component so it can be used in server components with
 * Next.js server-side rendering (SSR)
 */
export default function WalletProvider({ sitename, children }: {
  sitename: string,
  children: React.ReactNode
}) {
  const nodeConfig = useAtomValue(nodeConfigAtom);
  const providers = useInitializeProviders({
    debug: process.env.NEXT_PUBLIC_WALLET_DEBUG === 'true',
    providers: [
      { id: PROVIDER_ID.PERA,
        getDynamicClient: getDynamicPeraWalletConnect,
        // @ts-ignore
        clientOptions: { compactMode: true }
      },
      { id: PROVIDER_ID.DEFLY, getDynamicClient: getDynamicDeflyWalletConnect },
      { id: PROVIDER_ID.EXODUS },
      { id: PROVIDER_ID.MYALGO, getDynamicClient: getDynamicMyAlgoWalletConnect },
      { id: PROVIDER_ID.DAFFI, getDynamicClient: getDynamicDaffiWalletConnect },
      {
        id: PROVIDER_ID.LUTE,
        getDynamicClient: getDynamicLuteConnect,
        clientOptions: { siteName: sitename }
      }
    ],
    nodeConfig
  });

  return <Provider value={providers}>{children}</Provider>;
}
