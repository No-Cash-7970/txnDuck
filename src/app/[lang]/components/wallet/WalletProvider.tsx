'use client';

import {
  NetworkConfigBuilder,
  WalletProvider as Provider,
  WalletManager,
  WalletId,
  type SupportedWallets,
} from '@txnlab/use-wallet-react';
import { useAtomValue } from 'jotai';
import {
  customNodeAtom,
  NetworkId,
  nodeConfigAtom,
  defaultConfigs as defaultNodeConfigs,
  type NodeConfig,
} from '@/app/lib/node-config';

/** Wrapper for initializing the use-wallet library. Also serves as a provider to convert the
 * use-wallet wallet provider to a client component so it can be used in server components with
 * Next.js server-side rendering (SSR)
 */
export default function WalletProvider({ sitename, children }: {
  sitename: string,
  children: React.ReactNode
}) {
  const networks = new NetworkConfigBuilder();
  let config: NodeConfig;

  // Set mainnet
  config = defaultNodeConfigs[NetworkId.MAINNET];
  networks.mainnet({
    algod: {
      token: config.nodeToken ?? '',
      baseServer: config.nodeServer,
      port: config.nodePort,
      headers: config.nodeHeaders,
    },
    isTestnet: config.isTestnet,
  });

  // Set testnet
  config = defaultNodeConfigs[NetworkId.TESTNET];
  networks.testnet({
    algod: {
      token: config.nodeToken ?? '',
      baseServer: config.nodeServer,
      port: config.nodePort,
      headers: config.nodeHeaders,
    },
  });

  // Set betanet
  config = defaultNodeConfigs[NetworkId.BETANET];
  networks.betanet({
    algod: {
      token: config.nodeToken ?? '',
      baseServer: config.nodeServer,
      port: config.nodePort,
      headers: config.nodeHeaders,
    },
  });

  // Set fnet
  config = defaultNodeConfigs[NetworkId.FNET];
  networks.fnet({
    algod: {
      token: config.nodeToken ?? '',
      baseServer: config.nodeServer,
      port: config.nodePort,
      headers: config.nodeHeaders,
    },
  });

  // Set voimain
  config = defaultNodeConfigs[NetworkId.LOCALNET];
  networks.addNetwork(NetworkId.VOIMAIN, {
    algod: {
      token: config.nodeToken ?? '',
      baseServer: config.nodeServer,
      port: config.nodePort,
      headers: config.nodeHeaders,
    },
  });

  // Set localnet
  config = defaultNodeConfigs[NetworkId.LOCALNET];
  networks.localnet({
    algod: {
      token: config.nodeToken ?? '',
      baseServer: config.nodeServer,
      port: config.nodePort,
      headers: config.nodeHeaders,
    },
  });

  // Add custom node configuration (if any)
  const customNodeConfig = useAtomValue(customNodeAtom);
  if (customNodeConfig) {
    networks.addNetwork(NetworkId.CUSTOM, {
      algod: {
        token: customNodeConfig.nodeToken ?? '',
        baseServer: customNodeConfig.nodeServer,
        port: customNodeConfig.nodePort,
        headers: customNodeConfig.nodeHeaders,
      },
      isTestnet: customNodeConfig.isTestnet,
    });
  }

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
    const wcOptions = {
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
      themeVariables: { '--wcm-z-index': '999999' }
    };

    // Insert WalletConnect after Lute in the list of supported wallets
    supportedWallets.splice(3, 0, { id: WalletId.WALLETCONNECT, options: wcOptions });
    /*
     * Wallets list is now:
     * Pera, Defly, Lute, WalletConnect, Kibisis, Exodus, KMD
     */

    // Insert Biatec between Exodus and KMD in the list of supported wallets
    supportedWallets.splice(6, 0, { id: WalletId.BIATEC, options: wcOptions });
    /*
     * Wallets list is now:
     * Pera, Defly, Lute, WalletConnect, Kibisis, Exodus, Biatec, KMD
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
     * Pera, Defly, Lute, WalletConnect?, Kibisis, Magic, Exodus, Biatec?, KMD
     */
  }

  const nodeConfig = useAtomValue(nodeConfigAtom);
  // Add mnemonic as a supported wallet if it is enabled in the environment variables
  // AND the network is not MainNet
  if (process.env.NEXT_PUBLIC_FEAT_MNEMONIC_WALLET === 'true'
      && nodeConfig.network !== NetworkId.MAINNET
      && nodeConfig.network !== NetworkId.VOIMAIN
  ) {
    // Insert mnemonic wallet at the end of the list of supported wallets
    supportedWallets.push({
      id: WalletId.MNEMONIC,
      options: { persistToStorage: process.env.NEXT_PUBLIC_FEAT_MNEMONIC_WALLET_PERSIST === 'true'}
    });
    /*
     * Wallets list is now:
     * Pera, Defly, Lute, WalletConnect?, Kibisis, Magic?, Exodus, Biatec?, KMD, Mnemonic
     */
  }

  const walletManager = new WalletManager({
    wallets: supportedWallets,
    // NOTE: Some wallets (e.g. WalletConnect wallets) rely on the network ID to connect properly
    defaultNetwork: process.env.NEXT_PUBLIC_DEFAULT_NETWORK ?? NetworkId.MAINNET,
    networks: networks.build(),
    options: {
      // Setting `debug` to `true` same as setting `logLevel` to `LogLevel.DEBUG`
      debug: process.env.NEXT_PUBLIC_WALLET_DEBUG === 'true',
    },
  });

  return <Provider manager={walletManager}>{children}</Provider>;
}
