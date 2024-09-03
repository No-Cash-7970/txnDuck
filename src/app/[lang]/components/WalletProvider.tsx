'use client';

import {
  WalletProvider as Provider,
  WalletManager,
  WalletId,
  type SupportedWallets,
} from '@txnlab/use-wallet-react';
import { useAtomValue } from 'jotai';
import { nodeConfigAtom } from '@/app/lib/node-config';

/** Wrapper for initializing the use-wallet library. Also serves as a provider to convert the
 * use-wallet wallet provider to a client component so it can be used in server components with
 * Next.js server-side rendering (SSR)
 */
export default function WalletProvider({ sitename, children }: {
  sitename: string,
  children: React.ReactNode
}) {
  const nodeConfig = useAtomValue(nodeConfigAtom);
  const supportedWallets: SupportedWallets = [
    { id: WalletId.PERA,
      options: { compactMode: true }
    },
    WalletId.DEFLY,
    { id: WalletId.LUTE,
      options: { siteName: sitename }
    },
    { id: WalletId.KIBISIS },
    WalletId.EXODUS,
    { id: WalletId.KMD },
  ];

  // Add WalletConnect as a supported wallet if a WalletConnect project ID is set
  if (process.env.NEXT_PUBLIC_WC_PROJECT_ID) {
    // Insert WalletConnect after Lute in the list of supported wallets
    supportedWallets.splice(3, 0, {
      id: WalletId.WALLETCONNECT,
      options: {
        projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
        themeVariables: {
          '--wcm-z-index': '999999',
        }
      }
    });
    /*
     * Wallets list is now:
     * Pera, Defly, Lute, WalletConnect, Kibisis, Exodus, KMD
     */
  }

  // Add Magic as a supported wallet if a Magic API key is set
  if (process.env.NEXT_PUBLIC_MAGIC_API_KEY) {
    // Insert Magic after Kibisis in the list of supported wallets
    supportedWallets.splice(4, 0, {
      id: WalletId.MAGIC,
      options: { apiKey: process.env.NEXT_PUBLIC_MAGIC_API_KEY }
    });
    /*
     * Wallets list is now:
     * Pera, Defly, Lute, WalletConnect, Kibisis, Magic, Exodus, KMD
     */
  }

  const walletManager = new WalletManager({
    wallets: supportedWallets,
    algod: {
      token: nodeConfig.nodeToken,
      baseServer: nodeConfig.nodeServer,
      port: nodeConfig.nodePort,
      headers: nodeConfig.nodeHeaders,

    }
  });

  return <Provider manager={walletManager}>{children}</Provider>;
}
