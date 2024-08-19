'use client';

import {
  WalletProvider as Provider,
  WalletManager,
  WalletId,
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
  const walletManager = new WalletManager({
    wallets: [
      { id: WalletId.PERA,
        options: { compactMode: true }
      },
      WalletId.DEFLY,
      WalletId.EXODUS,
      { id: WalletId.LUTE,
        options: { siteName: sitename }
      },
      { id: WalletId.KIBISIS },
      { id: WalletId.KMD },
    ],
    algod: {
      token: nodeConfig.nodeToken,
      baseServer: nodeConfig.nodeServer,
      port: nodeConfig.nodePort,
      headers: nodeConfig.nodeHeaders,

    }
  });

  return <Provider manager={walletManager}>{children}</Provider>;
}
