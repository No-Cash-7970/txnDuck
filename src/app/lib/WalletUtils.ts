import { type Account, PROVIDER_ID } from "@txnlab/use-wallet";

/** The type of wallet for each supported wallet provider */
export const walletTypes: {[id: string]: string} = {
  [PROVIDER_ID.PERA]: 'mobile_web',
  [PROVIDER_ID.DEFLY]: 'mobile',
  [PROVIDER_ID.EXODUS]: 'browser_extension',
  [PROVIDER_ID.MYALGO]: 'web',
  [PROVIDER_ID.DAFFI]: 'mobile',
};

/**
 * Disconnect the current wallet provider. (Only one wallet provider is allowed for now).
 *
 * @param clients  Collection of clients returned by `useWallet()`
 * @param activeAccount The wallet account that is currently active, as returned by `useWallet()`
 */
export const disconnectWallet = (clients: any, activeAccount?: Account|null ) => {
  if (clients && activeAccount) {
    clients[activeAccount.providerId]?.disconnect();
  }
};

/**
 * Get the client for the provider with the given provider ID.
 *
 * @param clients  Collection of clients returned by `useWallet()`
 * @param activeAccount The wallet account that is currently active, as returned by `useWallet()`
 */
export const getClient = (providerId?: PROVIDER_ID, clients?: any) => {
  return (clients && providerId) ? clients[providerId] : null;
};
