import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TFunction } from 'i18next';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';
import {
  barConnectFn,
  fooConnectFn,
  useWalletUnconnectedMock
} from '@/app/lib/testing/useWalletMock';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);
// Mock use-wallet
jest.mock('@txnlab/use-wallet', () => useWalletUnconnectedMock);

import ConnectWallet from './ConnectWallet';

describe('Wallet Connect (in Settings) (Unconnected wallet)', () => {
  const t = i18nextClientMock.useTranslation().t as TFunction;

  it('has "connect" button', () => {
    render(<ConnectWallet t={t} />);
    expect(screen.getByRole('button')).toHaveTextContent('wallet.connect');
  });

  it('shows dropdown list of wallets when "connect" button is clicked', async () => {
    render(<ConnectWallet t={t} />);

    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByText('wallet.choose_provider')).toBeInTheDocument();
    expect(screen.getByText('wallet.providers.fooWallet')).toBeInTheDocument();
  });

  it('tries to connect to available wallet provider when it is selected', async () => {
    render(<ConnectWallet t={t} />);

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('wallet.providers.fooWallet'));

    expect(fooConnectFn).toHaveBeenCalledTimes(1);
    expect(barConnectFn).not.toBeCalled();
  });

});
