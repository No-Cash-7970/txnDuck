'use client';

import {
  WalletProvider as Provider,
  WalletManager,
  WalletId,
  type SupportedWallets,
} from '@txnlab/use-wallet-react';
import { useAtomValue } from 'jotai';
import { MAINNET, nodeConfigAtom, VOIMAIN } from '@/app/lib/node-config';

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
     * Pera, Defly, Lute, WalletConnect?, Kibisis, Magic, Exodus, KMD
     */
  }

  // Add mnemonic as a supported wallet if it is enabled in the environment variables
  // AND the network is not MainNet
  if (process.env.NEXT_PUBLIC_FEAT_MNEMONIC_WALLET === 'true'
      && nodeConfig.network !== MAINNET
      && nodeConfig.network !== VOIMAIN
  ) {
    // Insert mnemonic wallet at the end of the list of supported wallets
    supportedWallets.push({
      id: WalletId.MNEMONIC,
      options: { persistToStorage: process.env.NEXT_PUBLIC_FEAT_MNEMONIC_WALLET_PERSIST === 'true'}
    });
    /*
     * Wallets list is now:
     * Pera, Defly, Lute, WalletConnect?, Kibisis, Magic?, Exodus, KMD, Mnemonic
     */
  }

  const walletManager = new WalletManager({
    wallets: supportedWallets,
    algod: {
      token: nodeConfig.nodeToken,
      baseServer: nodeConfig.nodeServer,
      port: nodeConfig.nodePort,
      headers: nodeConfig.nodeHeaders,
    },
    options: {
      // Setting `debug` to `true` same as setting `logLevel` to `LogLevel.DEBUG`
      debug: process.env.NEXT_PUBLIC_WALLET_DEBUG === 'true',
    },
  });

  return <Provider manager={walletManager}>{children}</Provider>;
}
