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

import ConnectWallet from './ConnectWallet';

describe('Wallet Connect (in Settings) (Connected wallet)', () => {
  const t = i18nextClientMock.useTranslation().t as TFunction;

  it('has "disconnect" button', () => {
    render(<ConnectWallet t={t} />);
    expect(screen.getByRole('button')).toHaveTextContent('wallet.disconnect');
    expect(screen.getByText('wallet.is_connected')).toBeInTheDocument();
  });

  it('disconnects wallet when "disconnect" button is clicked', async () => {
    render(<ConnectWallet t={t} />);
    await userEvent.click(screen.getByRole('button'));
    expect(fooDisconnectFn).toBeCalledTimes(1);
  });

});
