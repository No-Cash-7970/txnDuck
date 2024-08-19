/** @file Collection of constants and functions for managing wallet connections */

import { WalletId } from '@txnlab/use-wallet-react';

/** The type of wallet for each supported wallet provider */
export const walletTypes: {[id: string]: string} = {
  [WalletId.PERA]: 'mobile_web',
  [WalletId.DEFLY]: 'mobile',
  [WalletId.EXODUS]: 'browser_extension',
  // [WalletId.DAFFI]: 'mobile',
  [WalletId.LUTE]: 'web',
  [WalletId.KMD]: 'cli_sandbox',
  [WalletId.KIBISIS]: 'browser_extension',
};
