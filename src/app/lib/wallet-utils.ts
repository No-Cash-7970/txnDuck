/** @file Collection of constants and functions for managing wallet connections */

import { WalletId } from '@txnlab/use-wallet-react';
import { atomWithValidate } from 'jotai-form';
import { string } from 'yup';
import '@/app/lib/validation-set-locale'; // Run setup for the locales for Yup (`Yup.setLocale()`)

/** The type of wallet for each supported wallet provider */
export const walletTypes: {[id: string]: string} = {
  [WalletId.PERA]: 'mobile_web',
  [WalletId.DEFLY]: 'mobile',
  [WalletId.EXODUS]: 'browser_extension',
  // [WalletId.DAFFI]: 'mobile',
  [WalletId.LUTE]: 'web',
  [WalletId.KMD]: 'cli_sandbox',
  [WalletId.KIBISIS]: 'browser_extension',
  [WalletId.WALLETCONNECT]: 'protocol',
  [WalletId.MAGIC]: 'waas',
};

export const magicEmailAtom = atomWithValidate<string>('', {
  validate: v => {
    string().email().required().validateSync(v);
    return v;
  }
});
