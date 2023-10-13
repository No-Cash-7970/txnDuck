'use client';

import {
  WalletProvider as Provider,
  useInitializeProviders,
  PROVIDER_ID,
} from '@txnlab/use-wallet';

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

export default function WalletProvider({ children }: { children: React.ReactNode }) {
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
    ],
    nodeConfig: {
      network: 'testnet',
      nodeServer: 'https://testnet-api.algonode.cloud',
      nodeToken: '',
      nodePort: '443'
    }
  });

  return (
    <Provider value={providers}>
      {children}
    </Provider>
  );
}
