import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TFunction } from "i18next";
import i18nextClientMock from "@/app/lib/testing/i18nextClientMock";
import {
  barConnectFn,
  fooConnectFn,
  useWalletUnconnectedMock
} from "@/app/lib/testing/useWalletMock";

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);
// Mock use-wallet before modules that use it are imported
jest.mock('@txnlab/use-wallet', () => useWalletUnconnectedMock);
// Mock the utils library because of the use of `fetch()`
jest.mock('../../../../lib/Utils.ts', () => ({
  dataUrlToBytes: async (dataUrl: string) => new Uint8Array([
    // {"gen":"testnet-v1.0","gh":"SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
    // "txn":{"type":"pay","snd":"7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M",
    // "fee":0.001,"fv":1,"lv":2, rcv":"7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M,
    // "amt":0}}
    130,163,115,105,103,196,64,37,21,106,1,57,107,80,242,128,8,97,9,238,113,67,123,201,222,146,146,
    103,88,71,191,126,81,172,69,55,251,124,130,249,184,68,26,236,229,212,59,55,231,47,238,34,218,
    204,101,60,45,150,140,217,142,194,59,52,147,204,9,96,24,90,11,163,116,120,110,136,163,102,101,
    101,205,3,232,162,102,118,1,163,103,101,110,172,116,101,115,116,110,101,116,45,118,49,46,48,162,
    103,104,196,32,72,99,181,24,164,179,200,78,200,16,242,45,79,16,129,203,15,113,240,89,167,172,32,
    222,198,47,127,112,229,9,58,34,162,108,118,2,163,114,99,118,196,32,250,70,29,35,81,230,110,222,
    4,6,203,34,172,63,38,83,166,0,196,6,226,155,168,254,118,112,12,192,137,116,205,208,163,115,110,
    100,196,32,250,70,29,35,81,230,110,222,4,6,203,34,172,63,38,83,166,0,196,6,226,155,168,254,118,
    112,12,192,137,116,205,208,164,116,121,112,101,163,112,97,121
  ])
}));

import SignTxn from './SignTxn';

describe('Sign Transaction Component (Unconnected wallet)', () => {
  const t = i18nextClientMock.useTranslation().t as TFunction;

  it('has "connect wallet" button', () => {
    render(<SignTxn />);
    expect(screen.getByRole('button')).toHaveTextContent('wallet.connect');
  });

  it('shows modal with selection of wallets', async () => {
    render(<SignTxn />);

    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByText('wallet.choose_provider')).toBeInTheDocument();
    expect(screen.getByText('wallet.providers.fooWallet')).toBeInTheDocument();
  });

  it('tries to connect to available wallet provider when it is selected', async () => {
    render(<SignTxn />);

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('wallet.providers.fooWallet'));

    expect(fooConnectFn).toBeCalledTimes(1);
    expect(barConnectFn).not.toBeCalled();
  });

  it('does not try to connect to unavailable wallet provider when it is selected', async () => {
    render(<SignTxn />);

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('wallet.providers.barWallet'));

    expect(barConnectFn).not.toBeCalled();
  });

  it('removes stored signed transaction if it is different from stored unsigned transaction',
  async () => {
    sessionStorage.setItem('txnData',
      '{"gen":"testnet-v1.0","gh":"SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=","txn":{'
      + '"type":"pay","snd":"7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M",'
      + '"fee":0.002,"fv":1,"lv":2,' // Change the fee
      +'"rcv":"7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M","amt":0}}'
    );
    // The function that converts a data URL to bytes is mocked, so any value can be put in storage
    sessionStorage.setItem('signedTxn', '"data:application/octet-stream;base64,"');
    render(<SignTxn />);

    expect(await screen.findByText('sign_txn:txn_signed')).not.toBeInTheDocument();
  });

  it('does not remove stored signed transaction if it is the same as stored unsigned transaction',
  async () => {
    sessionStorage.setItem('txnData',
      '{"gen":"testnet-v1.0","gh":"SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=","txn":{'
      + '"type":"pay","snd":"7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M",'
      + '"fee":0.001,"fv":1,"lv":2,'
      +'"rcv":"7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M","amt":0}}'
    );
    // The function that converts a data URL to bytes is mocked, so any value can be put in storage
    sessionStorage.setItem('signedTxn', '"data:application/octet-stream;base64,..."');
    render(<SignTxn />);

    expect(await screen.findByText('sign_txn:txn_signed')).toBeInTheDocument();
  });

});
