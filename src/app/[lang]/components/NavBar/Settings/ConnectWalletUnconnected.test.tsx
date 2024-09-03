import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type TFunction } from 'i18next';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';
import {
  barConnectFn,
  fooConnectFn,
  magicConnectFn,
  useWalletUnconnectedMock
} from '@/app/lib/testing/useWalletMock';
// This must be imported after the mock classes are imported
import { JotaiProvider } from '@/app/[lang]/components';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);
// Mock use-wallet
jest.mock('@txnlab/use-wallet-react', () => useWalletUnconnectedMock);

import ConnectWallet from './ConnectWallet';

describe('Wallet Connect (in Settings) (Unconnected wallet)', () => {
  const t = i18nextClientMock.useTranslation().t as TFunction;

  it('has "connect" button', () => {
    render(<JotaiProvider><ConnectWallet t={t} /></JotaiProvider>);
    expect(screen.getByRole('button')).toHaveTextContent('wallet.connect');
  });

  it('shows dropdown list of wallets when "connect" button is clicked', async () => {
    render(<JotaiProvider><ConnectWallet t={t} /></JotaiProvider>);

    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByText('wallet.choose_provider')).toBeInTheDocument();
    expect(screen.getByText('wallet.providers.fooWallet')).toBeInTheDocument();
  });

  it('tries to connect to available wallet provider when it is selected', async () => {
    render(<JotaiProvider><ConnectWallet t={t} /></JotaiProvider>);

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('wallet.providers.fooWallet'));

    expect(fooConnectFn).toHaveBeenCalledTimes(1);
    expect(barConnectFn).not.toHaveBeenCalled();
  });

  it('prompts for email address when "Magic" is selected as the wallet', async () => {
    render(<JotaiProvider><ConnectWallet t={t} /></JotaiProvider>);

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('wallet.providers.magic'));

    expect(magicConnectFn).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/wallet.magic_prompt.email_label/))
      .toBeInTheDocument();
    expect(screen.getByText('wallet.magic_prompt.email_submit_btn')).toHaveRole('button');
    expect(screen.getByText('cancel')).toHaveRole('button');
  });

  it('shows "connect wallet" button after the Magic wallet prompt is canceled', async () => {
    render(<JotaiProvider><ConnectWallet t={t} /></JotaiProvider>);

    // Trigger prompt to enter email for Magic wallet
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('wallet.providers.magic'));
    // Cancel prompt
    await userEvent.click(screen.getByText('cancel'));

    // Check if it shows "connect wallet" button
    expect(screen.getByRole('button')).toHaveTextContent('wallet.connect');
  });

  it('tries to connect using Magic if the given email address is valid', async () => {
    render(<JotaiProvider><ConnectWallet t={t} /></JotaiProvider>);

    // Trigger prompt to enter email for Magic wallet and submit it
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('wallet.providers.magic'));
    await userEvent.click(screen.getByLabelText(/wallet.magic_prompt.email_label/));
    await userEvent.paste('magic.user@example.com');
    await userEvent.click(screen.getByText('wallet.magic_prompt.email_submit_btn'));

    // Check if there was an attempt to connect using Magic
    expect(magicConnectFn).toHaveBeenCalledWith({email: 'magic.user@example.com'});
  });

  it('shows error message if Magic authentication fails', async () => {
    render(<JotaiProvider><ConnectWallet t={t} /></JotaiProvider>);
    // Simulate error from attempting to connect using Magic
    magicConnectFn.mockRejectedValueOnce('error!');

    // Trigger prompt to enter email for Magic wallet and submit it
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('wallet.providers.magic'));
    await userEvent.click(screen.getByLabelText(/wallet.magic_prompt.email_label/));
    await userEvent.paste('magic.user@example.com');
    await userEvent.click(screen.getByText('wallet.magic_prompt.email_submit_btn'));

    // Check if attempt to connect using Magic failed
    expect(screen.getByText(/wallet.magic_prompt.fail/)).toBeInTheDocument();
  });

});
