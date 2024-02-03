/** @file Collection of constants and functions for managing wallet connections */

import { PROVIDER_ID, type Provider } from '@txnlab/use-wallet';

/** The type of wallet for each supported wallet provider */
export const walletTypes: {[id: string]: string} = {
  [PROVIDER_ID.PERA]: 'mobile_web',
  [PROVIDER_ID.DEFLY]: 'mobile',
  [PROVIDER_ID.EXODUS]: 'browser_extension',
  [PROVIDER_ID.DAFFI]: 'mobile',
  [PROVIDER_ID.LUTE]: 'web',
  [PROVIDER_ID.KMD]: 'cli_sandbox',
  [PROVIDER_ID.KIBISIS]: 'browser_extension',
};

/** Get the client for the provider with the given provider ID.
 * @param providerId Provider ID
 * @param clients  Collection of clients returned by `useWallet()`
 */
export const getWalletClient = (providerId?: PROVIDER_ID, clients?: any) => {
  return (clients && providerId) ? clients[providerId] : null;
};

/** Get the provider that is currently active
 * @param providers
 * @returns Collection of providers returned by `useWallet()`
 */
export const getActiveProvider = (providers?: Provider[]|null) => {
  return providers
    ? providers.find((provider) => provider.isActive)
    : undefined;
};
