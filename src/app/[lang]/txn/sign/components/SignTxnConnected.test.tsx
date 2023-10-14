import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TFunction } from "i18next";
import i18nextClientMock from "@/app/lib/testing/i18nextClientMock";
import { fooDisconnectFn, useWalletConnectedMock } from "@/app/lib/testing/useWalletMock";

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);
// Mock use-wallet before modules that use it are imported
jest.mock('@txnlab/use-wallet', () => useWalletConnectedMock);
// Mock algokit before modules that use it are imported
jest.mock('@algorandfoundation/algokit-utils', () => ({
  getAlgoClient: () => ({}),
  getTransactionParams: () => ({
    genesisId: 'fooNet',
    genesisHash: 'Some genesis hash'
  })
}));

import SignTxn from './SignTxn';

describe('Sign Transaction Component (Connected wallet)', () => {
  const t = i18nextClientMock.useTranslation().t as TFunction;

  it('show active wallet address', () => {
    render(<SignTxn />);
    expect(screen.getByText('wallet.is_connected')).toBeInTheDocument();
  });

  it('has "sign transaction" button', () => {
    render(<SignTxn />);
    expect(screen.getByText(/sign_txn_btn/)).toBeInTheDocument();
  });

  it('has "disconnect wallet" button', async () => {
    render(<SignTxn />);
    await userEvent.click(screen.getByText('wallet.disconnect'));
    expect(fooDisconnectFn).toBeCalledTimes(1);
  });

});
